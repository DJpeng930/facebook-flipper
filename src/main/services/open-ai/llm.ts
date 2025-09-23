import OpenAI from "openai";
import { FBMarketListing } from "../../../shared/types";

// Type for the analysis result
interface ListingAnalysis {
  listingId: string;
  title: string;
  dealScore: number;
  askingPrice: number;
  estResaleValue: number;
  potentialProfit: number;
  roi: string;
  pros: string[];
  cons: string[];
  recommendation: "SKIP" | "MAYBE" | "CHECK_OUT" | "STRONG BUY";
  reasoning: string;
}

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
title: string; // Normalized listing title to include key details
dealScore: number; // Score from 1-10 on how good of a deal this is
askingPrice: number; // Price seller is asking
estResaleValue: number; // Estimated resale value based on market research
potentialProfit: number; // Potential profit after resale
roi: string; // Return on investment percentage
pros: string[]; // List of pros for this listing
cons: string[]; // List of cons for this listing
recommendation: "SKIP" | "MAYBE" | "CHECK_OUT" | "STRONG BUY"; // Overall recommendation based on analysis
reasoning: string; // Brief explanation of your reasoning

Return your analysis as a structured JSON response with an array of listing analyses.`;

  // Fixed schema to return an array of objects
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
                title: { type: "string" },
                dealScore: { type: "integer", minimum: 1, maximum: 10 },
                askingPrice: { type: "number" },
                estResaleValue: { type: "number" },
                potentialProfit: { type: "number" },
                roi: { type: "string" },
                pros: {
                  type: "array",
                  items: { type: "string" }
                },
                cons: {
                  type: "array",
                  items: { type: "string" }
                },
                recommendation: {
                  type: "string",
                  enum: ["SKIP", "MAYBE", "CHECK_OUT", "STRONG BUY"]
                },
                reasoning: { type: "string" }
              },
              required: ["listingId", "title", "dealScore", "askingPrice", "estResaleValue", "potentialProfit", "roi", "pros", "cons", "recommendation", "reasoning"],
              additionalProperties: false
            }
          }
        },
        required: ["analyses"],
        additionalProperties: false
      }
    }
  };

  static async analyzeListings(listings: Partial<FBMarketListing>[]): Promise<ListingAnalysis[]> {
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
      const parsedResponse = JSON.parse(content) as ListingAnalysis[];

      // Validate the structure
      if (!parsedResponse || !Array.isArray(parsedResponse)) {
        throw new Error("Invalid response structure: expected analyses array");
      }

      return parsedResponse;
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
