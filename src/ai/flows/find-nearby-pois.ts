'use server';

/**
 * @fileOverview Flow for finding nearby points of interest (POIs) using the geo-aware chatbot.
 *
 * - findNearbyPOIsFlow - A function that takes latitude, longitude, radius, and categories as input and returns a list of nearby POIs.
 * - FindNearbyPOIsInput - The input type for the findNearbyPOIs function.
 * - FindNearbyPOIsOutput - The return type for the findNearbyPOIs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindNearbyPOIsInputSchema = z.object({
  center: z.object({lat: z.number(), lng: z.number()}).describe('The latitude and longitude of the center point.'),
  radiusMeters: z.number().describe('The radius in meters to search within.'),
  categories: z.array(z.enum(['school', 'college', 'university', 'hospital', 'clinic', 'pharmacy', 'grocery', 'bank', 'atm', 'park', 'bus_stop', 'rail_station'])).describe('An array of categories to search for.'),
});
export type FindNearbyPOIsInput = z.infer<typeof FindNearbyPOIsInputSchema>;

const POISchema = z.object({
  name: z.string().describe('The name of the point of interest.'),
  latitude: z.number().describe('The latitude of the point of interest.'),
  longitude: z.number().describe('The longitude of the point of interest.'),
  category: z.enum(['school', 'college', 'university', 'hospital', 'clinic', 'pharmacy', 'grocery', 'bank', 'atm', 'park', 'bus_stop', 'rail_station']).describe('The category of the point of interest.'),
  distance: z.number().describe('The distance in meters from the center point.'),
  bearing: z.string().describe('The bearing from the center point (e.g., N, NE, E).'),
});

const FindNearbyPOIsOutputSchema = z.array(POISchema).describe('An array of nearby points of interest.');
export type FindNearbyPOIsOutput = z.infer<typeof FindNearbyPOIsOutputSchema>;

export async function findNearbyPOIs(input: FindNearbyPOIsInput): Promise<FindNearbyPOIsOutput> {
  return findNearbyPOIsFlow(input);
}

const findNearbyPOIsFlow = ai.defineFlow(
  {
    name: 'findNearbyPOIsFlow',
    inputSchema: FindNearbyPOIsInputSchema,
    outputSchema: FindNearbyPOIsOutputSchema,
  },
  async input => {
    // No LLM is used, this directly returns structured data.
    // In a real application, this might call an external API or database.
    return mockFindNearbyPOIs(input);
  }
);

// Mock implementation for testing purposes.
async function mockFindNearbyPOIs(input: FindNearbyPOIsInput): Promise<FindNearbyPOIsOutput> {
  const {
    center: {lat, lng},
    radiusMeters,
    categories,
  } = input;

  const mockPOIs = [
    {
      name: 'School 1', latitude: lat + 0.001, longitude: lng + 0.001, category: 'school', distance: 100, bearing: 'NE',
    },
    {
      name: 'Hospital A', latitude: lat - 0.002, longitude: lng - 0.002, category: 'hospital', distance: 200, bearing: 'SW',
    },
    {
      name: 'Grocery Store X', latitude: lat + 0.003, longitude: lng - 0.003, category: 'grocery', distance: 300, bearing: 'NW',
    },
  ];

  // Filter by category and radius.
  const filteredPOIs = mockPOIs
    .filter(poi => categories.includes(poi.category))
    .filter(poi => poi.distance <= radiusMeters);

  return filteredPOIs as FindNearbyPOIsOutput;
}
