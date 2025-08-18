"use client";

import * as React from "react";
import { useActionState, useFormStatus } from "react-dom";
import { askGeoBot } from "@/app/actions";
import type { Listing } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User, CornerDownLeft, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ChatPanelProps {
  selectedListing: Listing | null;
}

type Message = {
  role: "user" | "assistant";
  content: string;
};

const initialState = {
  status: "success" as "success" | "error",
  message: "",
  answer: undefined as string | undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="icon" disabled={pending} aria-label="Send message">
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <CornerDownLeft className="h-4 w-4" />
      )}
    </Button>
  );
}

export function ChatPanel({ selectedListing }: ChatPanelProps) {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [open, setOpen] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const [state, formAction] = React.useActionState(askGeoBot, initialState);

  React.useEffect(() => {
    if (state.status === "error") {
      toast({
        variant: "destructive",
        title: "Chatbot Error",
        description: state.message,
      });
    } else if (state.status === "success" && state.answer) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: state.answer! },
      ]);
    }
  }, [state, toast]);
  
  const handleFormSubmit = async (formData: FormData) => {
    const question = formData.get("question") as string;
    if (question.trim()) {
      setMessages((prev) => [...prev, { role: "user", content: question }]);
      formAction(formData);
      formRef.current?.reset();
    }
  };


  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground z-20"
          size="icon"
          aria-label="Open chatbot"
        >
          <Bot className="h-8 w-8" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col p-0">
        <SheetHeader className="p-6 pb-4 border-b">
          <SheetTitle className="font-headline text-2xl">
            Geo-Aware Assistant
          </SheetTitle>
          <SheetDescription>
            Ask me anything about{" "}
            <span className="font-semibold text-primary">
              {selectedListing?.title || "the selected property"}
            </span>
            .
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-3",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "rounded-lg p-3 max-w-[80%] text-sm",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <p>{message.content}</p>
                </div>
                 {message.role === "user" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {useFormStatus().pending && (
                <div className="flex items-start gap-3 justify-start">
                    <Avatar className="h-8 w-8">
                       <AvatarFallback>
                         <Bot className="h-5 w-5" />
                       </AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg p-3 max-w-[80%] text-sm bg-muted text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                </div>
             )}
          </div>
        </ScrollArea>
        <SheetFooter className="p-4 border-t bg-background">
          <form
            ref={formRef}
            action={handleFormSubmit}
            className="flex w-full items-center gap-2"
          >
            <Input
              name="question"
              placeholder="e.g., How far are schools?"
              autoComplete="off"
              disabled={!selectedListing || useFormStatus().pending}
            />
            <input
              type="hidden"
              name="listingId"
              value={selectedListing?.id || ""}
            />
            <SubmitButton />
          </form>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
