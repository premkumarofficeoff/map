// geo-aware-chatbot.ts
'use server';

/**
 * @fileOverview Implements the geo-aware chatbot flow for answering questions about a listing and its surroundings.
 *
 * - geoAwareChatbot - A function that handles the chatbot interactions.
 * - GeoAwareChatbotInput - The input type for the geoAwareChatbot function.
 * - GeoAwareChatbotOutput - The return type for the geoAwareChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Tool Signatures (TypeScript):
// /lib/tools/geoTools.ts
export type LatLng = { lat: number; lng: number };
export type Mode = 'driving' | 'walking' | 'bicycling' | 'transit';
export type Category = 'school'|'college'|'university'|'hospital'|'clinic'|'pharmacy'|'grocery'|'bank'|'atm'|'park'|'bus_stop'|'rail_station';

export interface FindNearbyArgs { center: LatLng; radiusMeters: number; categories: Category[] }
export interface DistanceMatrixArgs { origins: LatLng[]; destinations: LatLng[]; mode: Mode }
export interface SearchListingsArgs { bounds: {north:number;south:number;east:number;west:number}; filters: Record<string,unknown> }

async function findNearbyPOIs(args: FindNearbyArgs): Promise<any[]> { return []; }
async function distanceMatrix(args: DistanceMatrixArgs): Promise<any> { return {}; }
async function searchListings(args: SearchListingsArgs): Promise<any[]> { return []; }
async function getListingById(id: string): Promise<any | null> { return null; }
async function reverseGeocode(ll: LatLng): Promise<any> { return {}; }
async function geocode(query: string): Promise<LatLng | null> { return null; }
async function getStatsAround(center: LatLng, radiusMeters: number): Promise<Record<Category, number>> { return {}; }


const GeoAwareChatbotInputSchema = z.object({
  listingId: z.string().describe('The ID of the land listing.'),
  question: z.string().describe('The user question about the listing and its surroundings.'),
});
export type GeoAwareChatbotInput = z.infer<typeof GeoAwareChatbotInputSchema>;

const GeoAwareChatbotOutputSchema = z.object({
  answer: z.string().describe('The answer to the user question.'),
});
export type GeoAwareChatbotOutput = z.infer<typeof GeoAwareChatbotOutputSchema>;


const findNearbyPOIsTool = ai.defineTool({
  name: 'findNearbyPOIs',
  description: 'Finds nearby points of interest given a location, radius, and categories.',
  inputSchema: z.object({
    center: z.object({
      lat: z.number().describe('Latitude of the center location.'),
      lng: z.number().describe('Longitude of the center location.'),
    }).describe('The center location.'),
    radiusMeters: z.number().describe('The radius in meters to search within.'),
    categories: z.array(z.string()).describe('An array of categories to search for (e.g., school, hospital).'),
  }),
  outputSchema: z.any(), // Replace with a proper schema if POI data structure is known
}, async (input) => {
  return findNearbyPOIs(input as FindNearbyArgs);
});

const distanceMatrixTool = ai.defineTool({
  name: 'distanceMatrix',
  description: 'Calculates the distance and travel time between multiple origins and destinations.',
  inputSchema: z.object({
    origins: z.array(z.object({
      lat: z.number().describe('Latitude of the origin.'),
      lng: z.number().describe('Longitude of the origin.'),
    })).describe('Array of origin locations.'),
    destinations: z.array(z.object({
      lat: z.number().describe('Latitude of the destination.'),
      lng: z.number().describe('Longitude of the destination.'),
    })).describe('Array of destination locations.'),
    mode: z.string().describe('The travel mode (driving, walking, bicycling, transit).'),
  }),
  outputSchema: z.any(), // Replace with a proper schema for distance matrix results
}, async (input) => {
  return distanceMatrix(input as DistanceMatrixArgs);
});

const searchListingsTool = ai.defineTool({
  name: 'searchListings',
  description: 'Searches listings within a given bounding box and filters.',
  inputSchema: z.object({
    bounds: z.object({
      north: z.number().describe('North latitude of the bounding box.'),
      south: z.number().describe('South latitude of the bounding box.'),
      east: z.number().describe('East longitude of the bounding box.'),
      west: z.number().describe('West longitude of the bounding box.'),
    }).describe('The bounding box to search within.'),
    filters: z.record(z.any()).describe('Filters to apply to the search.'),
  }),
  outputSchema: z.any(), // Replace with a proper schema for listing search results
}, async (input) => {
  return searchListings(input as SearchListingsArgs);
});

const getListingByIdTool = ai.defineTool({
  name: 'getListingById',
  description: 'Retrieves a listing by its ID.',
  inputSchema: z.object({
    id: z.string().describe('The ID of the listing to retrieve.'),
  }),
  outputSchema: z.any().nullable(), // Replace with a proper schema for a single listing
}, async (input) => {
  return getListingById(input.id);
});

const reverseGeocodeTool = ai.defineTool({
  name: 'reverseGeocode',
  description: 'Reverse geocodes a latitude and longitude to find an address.',
  inputSchema: z.object({
    lat: z.number().describe('Latitude of the location.'),
    lng: z.number().describe('Longitude of the location.'),
  }),
  outputSchema: z.any(), // Replace with a proper schema for address information
}, async (input) => {
  return reverseGeocode(input as LatLng);
});

const geocodeTool = ai.defineTool({
  name: 'geocode',
  description: 'Geocodes a query string to find a latitude and longitude.',
  inputSchema: z.object({
    query: z.string().describe('The query string to geocode (e.g., an address).'),
  }),
  outputSchema: z.object({
    lat: z.number().nullable().describe('Latitude of the geocoded location, null if not found.'),
    lng: z.number().nullable().describe('Longitude of the geocoded location, null if not found.'),
  }).nullable(),
}, async (input) => {
  return geocode(input.query);
});

const getStatsAroundTool = ai.defineTool({
  name: 'getStatsAround',
  description: 'Gets statistics about points of interest around a central location.',
  inputSchema: z.object({
    center: z.object({
      lat: z.number().describe('Latitude of the center location.'),
      lng: z.number().describe('Longitude of the center location.'),
    }).describe('The center location.'),
    radiusMeters: z.number().describe('The radius in meters to search within.'),
  }),
  outputSchema: z.record(z.number()), // Replace with a proper schema for category counts
}, async (input) => {
  return getStatsAround(input.center, input.radiusMeters);
});

const systemPromptContent = `You are TalkingMap’s geo assistant. Always call a tool to fetch facts (nearby, distance, geocode). Never fabricate places. If no results, suggest expanding the radius or changing categories. Use kilometers/meters, INR, and local names. Be transparent about data sources and timestamps.`;

const geoAwareChatbotPrompt = ai.definePrompt({
  name: 'geoAwareChatbotPrompt',
  input: { schema: GeoAwareChatbotInputSchema },
  output: { schema: GeoAwareChatbotOutputSchema },
  tools: [
    findNearbyPOIsTool,
    distanceMatrixTool,
    searchListingsTool,
    getListingByIdTool,
    reverseGeocodeTool,
    geocodeTool,
    getStatsAroundTool,
  ],
  system: systemPromptContent,
  prompt: `{{question}}`,
});

const geoAwareChatbotFlow = ai.defineFlow({
  name: 'geoAwareChatbotFlow',
  inputSchema: GeoAwareChatbotInputSchema,
  outputSchema: GeoAwareChatbotOutputSchema,
}, async (input) => {
  const { output } = await geoAwareChatbotPrompt(input);
  return output!;
});

export async function geoAwareChatbot(input: GeoAwareChatbotInput): Promise<GeoAwareChatbotOutput> {
  return geoAwareChatbotFlow(input);
}

