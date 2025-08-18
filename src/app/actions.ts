"use server";

import { geoAwareChatbot } from "@/ai/flows/geo-aware-chatbot";
import { z } from "zod";

const AskGeoBotSchema = z.object({
  question: z.string().min(1, "Question cannot be empty."),
  listingId: z.string().min(1, "Listing ID is required."),
});

export async function askGeoBot(
  prevState: any,
  formData: FormData
): Promise<{
  status: "success" | "error";
  message: string;
  answer?: string;
}> {
  const validatedFields = AskGeoBotSchema.safeParse({
    question: formData.get("question"),
    listingId: formData.get("listingId"),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      message: "Invalid input. " + validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { question, listingId } = validatedFields.data;

  try {
    const response = await geoAwareChatbot({ question, listingId });
    return {
      status: "success",
      message: "Answer received.",
      answer: response.answer,
    };
  } catch (error) {
    console.error("Error calling geoAwareChatbot flow:", error);
    return {
      status: "error",
      message: "An error occurred while getting an answer. Please try again.",
    };
  }
}
