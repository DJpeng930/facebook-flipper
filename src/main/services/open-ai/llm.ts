import OpenAI from "openai";
import { Listing, ListingValueAnalysis, RECOMMENDATIONS, SerializableError } from "../../../shared/types";
import { SettingsRepository } from "../repositories/settings-repository";
import { ResponseFormatJSONSchema } from "openai/resources/shared";

type ResponseFormat = {
  [key in keyof ListingValueAnalysis]: {
    type: string;
    description: string;
    enum?: string[];
    minimum?: number;
    maximum?: number;
  };
};

export class LargeLanguageModel {
  private static readonly model = "google/gemini-2.5-flash:online";

  private static readonly systemPrompt = `
  You are an expert marketplace analyst specializing in identifying profitable resale opportunities on Facebook Marketplace. Analyze the provided listings and evaluate their flip potential based on market dynamics, profit margins, and risk factors.

## HIGH-VALUE CATEGORIES (Priority Order)

**Tier 1 - Best ROI:**
- Electronics: Latest-gen phones, MacBooks, gaming consoles/PCs, high-end audio (Bose, Sony, AirPods)
- Power tools: Makita, DeWalt, Milwaukee, Bosch professional lines
- Designer items: Authenticated luxury bags, watches, streetwear (Supreme, Yeezy)

**Tier 2 - Solid Returns:**
- Collectibles: Sealed vintage items, graded sports cards, limited editions
- Exercise equipment: Peloton, Bowflex, free weights, resistance bands
- Small appliances: KitchenAid, Dyson, Vitamix, espresso machines

**Tier 3 - Selective Picks:**
- Furniture: Only mid-century modern, designer pieces, or solid wood antiques
- Musical instruments: Fender, Gibson, Roland, established brands only

## RED FLAGS (Auto-disqualify unless compelling reason)

**Condition Issues:**
- "For parts," "broken," "not working," "as-is" (unless you have repair expertise)
- Missing components, accessories, or original packaging (especially electronics)
- Water damage, cracks, heavy wear, or stains

**Marketplace Signals:**
- Listed 7+ days ago (indicates overpricing or low demand)
- Vague titles like "stuff for sale" or minimal description
- Prioritize recent listings as those ones are usually the good deals that get taken fast


## PRICING ANALYSIS FRAMEWORK

**Market Research:**
- Check recent eBay sold listings (filter for the last 30 days).
- Compare prices to current active listings on eBay or similar platforms.
- Factor in seasonal demand fluctuations when estimating value.

**Special Cases:**
- If a listing has a **price of 0**, check the **description** to determine the actual price.
  - If the description explicitly states the item is **free**, assume it is free.
  - If the description includes terms like "OBO" (or best offer), "best offer", or "make an offer", estimate a realistic market price based on the item details.
  - If the description contains a **specific price**, use that price instead of 0.
  - If its unclear what the product is, like vague titles or descriptions, assign a price of 0. and resale value of 0.

**Multiple Items:**
- If the listing includes **multiple items**, analyze the description to identify the **best or primary item** being offered.
  - Focus on the **main or most valuable item** when estimating or assigning a price.
  - If individual prices are listed, use the price for the **best or primary item**.

**Profit Thresholds:**
- Minimum target: 40% ROI after all costs
- Ideal target: 100%+ ROI
- Time investment: Profit should justify >$25/hour equivalent

**Urgency Indicators (Negotiate Lower):**
- Keywords: "moving," "need gone ASAP," "must sell today"
- Seller accepts "best offer"
- Posted within last 24 hours (motivated seller)


Return your analysis as a structured JSON response with an array of listing analyses.
OUTPUT FORMAT:
Return your analysis as a JSON array with the following structure:
`;

  private static readonly responseFormat: ResponseFormat = {
    listingId: { type: "string", description: "Unique identifier for the listing" },
    estResaleValue: { type: "number", description: "Estimated resale value based on market research" },
    potentialProfit: { type: "number", description: "Potential profit after resale (estResaleValue - askingPrice - fees)" },
    roi: { type: "string", description: "Return on investment percentage" },
    dealScore: { type: "integer", minimum: 1, maximum: 10, description: "Score from 1-10 on how good of a deal this is" },
    recommendation: {
      type: "string",
      description: "Overall recommendation",
      enum: [...RECOMMENDATIONS]
    }
  };

  static async analyzeListings(listings: Listing[]): Promise<{ error?: SerializableError; listings: Listing[] }> {
    if (listings.length === 0) {
      console.log("No listings to analyze with LLM");
      return { listings: [] };
    }

    console.log("Analyzing listings with LLM");

    try {
      const response = await this.createOpenAIClient().chat.completions.create({
        model: this.model,
        messages: [
          {
            role: "system",
            content: `${this.systemPrompt}\n${this.responseFormat}`
          },
          {
            role: "user",
            content: `Here are all the listings you need to analyze: ${this.parseListings(listings)}`
          }
        ],
        response_format: this.getResponseFormat()
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

      return { listings };
    } catch (error) {
      console.error("Error generating or parsing analysis:", error);

      // If it's a JSON parsing error, log the raw content
      if (error instanceof SyntaxError) {
        console.error("Failed to parse JSON response");
      }

      // Serialize the error properly for IPC
      const errorObj = error as Record<string, unknown>;
      const serializedError: SerializableError = {
        message: error instanceof Error ? error.message : String(error),
        code: errorObj.code as number | string | undefined,
        status: errorObj.status as number | undefined,
        type: errorObj.type as string | undefined,
        name: error instanceof Error ? error.name : "Error"
      };

      return { error: serializedError, listings: [] };
    }
  }

  private static parseListings(listings: Listing[]): string {
    return listings
      .map(
        (listing) => `
        Listing ID: ${listing.id}
        Title: ${listing.title}
        Time Since Listed: ${listing.ageString || "N/A"}}
        Price: ${listing.currency + listing.price}
        Description:\n ${listing.description || "N/A"}
        `
      )
      .join("\n---\n");
  }

  private static createOpenAIClient() {
    return new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: SettingsRepository.getApiKey()
    });
  }

  private static getResponseFormat(): ResponseFormatJSONSchema {
    const requiredFields = Object.keys(this.responseFormat);

    return {
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
                properties: this.responseFormat,
                required: requiredFields,
                additionalProperties: false
              }
            }
          },
          required: ["analyses"],
          additionalProperties: false
        }
      }
    };
  }
}
