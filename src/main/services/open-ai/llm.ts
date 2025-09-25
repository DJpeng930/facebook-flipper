import OpenAI from "openai";
import { Listing, ListingValueAnalysis, RECOMMENDATIONS } from "../../../shared/types";

// Extend ImportMetaEnv interface to include our custom environment variable
declare global {
  interface ImportMetaEnv {
    MAIN_VITE_OPENAI_API_KEY: string;
  }
}

export class LargeLanguageModel {
  static openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: import.meta.env.MAIN_VITE_OPENAI_API_KEY
  });

  private static readonly model = "google/gemini-2.5-flash:online";

  private static readonly systemPrompt = `
  You are an expert at identifying profitable resale opportunities on Facebook Marketplace. Your job is to analyze listings and determine if they're worth pursuing for flipping.

EVALUATION CRITERIA:

High-value categories to prioritize:
- Electronics (phones, laptops, gaming, audio equipment)
- Power tools and equipment
- Designer clothing/accessories
- Collectibles (vintage, sports cards, etc.)
- Exercise equipment
- Small appliances in good condition

Red flags to avoid:
- "For parts" or "broken" items (unless you repair)
- IKEA/cheap furniture
- Items with missing pieces
- Vague descriptions with poor titles
- Items that are hard to ship
- Time since listed (older = less likely to sell or not a great deal)

Pricing signals:
- Compare to typical retail/used prices
- Consider shipping costs and fees (eBay ~13%, FB/local ~0%)
- Factor in time investment
- Look for urgent sale indicators ("moving", "need gone")

ANALYSIS REQUIREMENTS:

For each listing provided, analyze and provide:

listingId: string; // Unique identifier for the listing
estResaleValue: number; // Estimated resale value based on market research
potentialProfit: number; // Potential profit after resale (estResaleValue - askingPrice - fees)
roi: string; // Return on investment percentage
dealScore: number; // Score from 1-10 on how good of a deal this is
recommendation: "AVOID" | "LOW_POTENTIAL" | "CONSIDER" | "STRONG_BUY"; // Overall recommendation

Return your analysis as a structured JSON response with an array of listing analyses.`;

  // Schema to match ListingValueAnalysis interface
  private static readonly response_format = {
    type: "json_schema" as const,
    json_schema: {
      name: "listings_analysis",
      strict: true,
      schema: {
        type: "object",
        properties: {
          analyses: {
            type: "array",
            items: {
              type: "object",
              properties: {
                listingId: { type: "string" },
                estResaleValue: { type: "number" },
                potentialProfit: { type: "number" },
                roi: { type: "string" },
                dealScore: { type: "integer", minimum: 1, maximum: 10 },
                recommendation: {
                  type: "string",
                  enum: RECOMMENDATIONS
                }
              },
              required: ["listingId", "estResaleValue", "potentialProfit", "roi", "dealScore", "recommendation"],
              additionalProperties: false
            }
          }
        },
        required: ["analyses"],
        additionalProperties: false
      }
    }
  };

  static async analyzeListings(listings: Listing[]): Promise<Listing[]> {
    if (listings.length === 0) {
      return [];
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: "system",
            content: this.systemPrompt
          },
          {
            role: "user",
            content: `Here are all the listings you need to analyze: ${JSON.stringify(listings)}`
          }
        ],
        response_format: this.response_format
      });

      const content = response.choices[0].message?.content;
      if (!content) {
        throw new Error("No content received from OpenAI");
      }

      // Parse the JSON response
      const parsedResponse = JSON.parse(content) as { analyses: ListingValueAnalysis[] };

      // Validate the structure
      if (!parsedResponse || !Array.isArray(parsedResponse.analyses)) {
        throw new Error("Invalid response structure: expected analyses array");
      }

      listings.forEach((listing) => {
        const analysis = parsedResponse.analyses.find((a) => a.listingId === listing.id);

        if (!analysis) {
          throw new Error(`LLM did not output analysis for listing ID: ${listing.id}`);
        }

        //eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { listingId, ...rest } = analysis;
        listing.valueAnalysis = rest;
        return listing;
      });

      return listings;
    } catch (error) {
      console.error("Error generating or parsing analysis:", error);

      // If it's a JSON parsing error, log the raw content
      if (error instanceof SyntaxError) {
        console.error("Failed to parse JSON response");
      }

      throw error;
    }
  }
}
