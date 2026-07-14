import { BicycleCategory, BicycleComponent, BicycleIdentification, Listing } from "../../../shared/types";

interface BrandPattern {
  canonical: string;
  pattern: RegExp;
}

interface CategoryPattern {
  category: BicycleCategory;
  pattern: RegExp;
}

interface ComponentPattern {
  componentType: BicycleComponent["componentType"];
  brand?: string;
  model?: string;
  tier?: string;
  pattern: RegExp;
}

const BRAND_PATTERNS: BrandPattern[] = [
  { canonical: "Trek", pattern: /\btrek\b/i },
  { canonical: "Giant", pattern: /\bgiant\b/i },
  { canonical: "Liv", pattern: /\bliv\b/i },
  { canonical: "Specialized", pattern: /\bspeciali[sz]ed\b/i },
  { canonical: "Cannondale", pattern: /\bcannondale\b/i },
  { canonical: "Merida", pattern: /\bmerida\b/i },
  { canonical: "Scott", pattern: /\bscott\b/i },
  { canonical: "Norco", pattern: /\bnorco\b/i },
  { canonical: "Polygon", pattern: /\bpolygon\b/i },
  { canonical: "Canyon", pattern: /\bcanyon\b/i },
  { canonical: "Cervelo", pattern: /\bcervelo\b/i },
  { canonical: "BMC", pattern: /\bbmc\b/i },
  { canonical: "Cube", pattern: /\bcube\b/i },
  { canonical: "Focus", pattern: /\bfocus\b/i },
  { canonical: "Orbea", pattern: /\borbea\b/i },
  { canonical: "Santa Cruz", pattern: /\bsanta\s+cruz\b/i },
  { canonical: "Yeti", pattern: /\byeti\b/i },
  { canonical: "Kona", pattern: /\bkona\b/i },
  { canonical: "Avanti", pattern: /\bavanti\b/i },
  { canonical: "Reid", pattern: /\breid\b/i },
  { canonical: "Malvern Star", pattern: /\bmalvern\s+star\b/i },
  { canonical: "Apollo", pattern: /\bapollo\b/i },
  { canonical: "Bianchi", pattern: /\bbianchi\b/i },
  { canonical: "Pinarello", pattern: /\bpinarello\b/i },
  { canonical: "Colnago", pattern: /\bcolnago\b/i },
  { canonical: "Wilier", pattern: /\bwilier\b/i },
  { canonical: "Felt", pattern: /\bfelt\b/i },
  { canonical: "Fuji", pattern: /\bfuji\b/i },
  { canonical: "Marin", pattern: /\bmarin\b/i },
  { canonical: "GT", pattern: /\bgt\b/i },
  { canonical: "Mongoose", pattern: /\bmongoose\b/i },
  { canonical: "Diamondback", pattern: /\bdiamondback\b/i },
  { canonical: "Salsa", pattern: /\bsalsa\b/i },
  { canonical: "Surly", pattern: /\bsurly\b/i },
  { canonical: "Raleigh", pattern: /\braleigh\b/i },
  { canonical: "Brompton", pattern: /\bbrompton\b/i }
];

const CATEGORY_PATTERNS: CategoryPattern[] = [
  { category: "electric", pattern: /\b(e-?bike|electric bike|pedal assist)\b/i },
  { category: "gravel", pattern: /\bgravel\b/i },
  { category: "mountain", pattern: /\b(mountain bike|mtb|dual suspension|hardtail|downhill|enduro|trail bike)\b/i },
  { category: "road", pattern: /\b(road bike|roadie|aero bike|endurance bike)\b/i },
  { category: "hybrid", pattern: /\b(hybrid|flat bar road)\b/i },
  { category: "commuter", pattern: /\b(commuter|city bike|urban bike|fixie|single speed)\b/i },
  { category: "bmx", pattern: /\bbmx\b/i },
  { category: "kids", pattern: /\b(kids|children'?s|junior|balance bike)\b/i },
  { category: "triathlon", pattern: /\b(triathlon|tt bike|time trial)\b/i },
  { category: "cyclocross", pattern: /\b(cyclocross|cx bike)\b/i }
];

const COMPONENT_PATTERNS: ComponentPattern[] = [
  { componentType: "groupset", brand: "Shimano", tier: "Dura-Ace", pattern: /\bdura[-\s]?ace\b/i },
  { componentType: "groupset", brand: "Shimano", tier: "Ultegra", pattern: /\bultegra\b/i },
  { componentType: "groupset", brand: "Shimano", tier: "105", pattern: /\bshimano\s+105\b|\b105\s+(groupset|group set)\b/i },
  { componentType: "groupset", brand: "Shimano", tier: "Tiagra", pattern: /\btiagra\b/i },
  { componentType: "groupset", brand: "Shimano", tier: "Sora", pattern: /\bsora\b/i },
  { componentType: "groupset", brand: "Shimano", tier: "Claris", pattern: /\bclaris\b/i },
  { componentType: "groupset", brand: "Shimano", tier: "XTR", pattern: /\bxtr\b/i },
  { componentType: "groupset", brand: "Shimano", tier: "XT", pattern: /\bdeore\s+xt\b|\bshimano\s+xt\b/i },
  { componentType: "groupset", brand: "Shimano", tier: "SLX", pattern: /\bslx\b/i },
  { componentType: "groupset", brand: "Shimano", tier: "Deore", pattern: /\bdeore\b/i },
  { componentType: "groupset", brand: "SRAM", tier: "Red", pattern: /\bsram\s+red\b/i },
  { componentType: "groupset", brand: "SRAM", tier: "Force", pattern: /\bsram\s+force\b/i },
  { componentType: "groupset", brand: "SRAM", tier: "Rival", pattern: /\bsram\s+rival\b/i },
  { componentType: "groupset", brand: "SRAM", tier: "Apex", pattern: /\bsram\s+apex\b/i },
  { componentType: "groupset", brand: "SRAM", tier: "GX", pattern: /\bsram\s+gx\b/i },
  { componentType: "groupset", brand: "SRAM", tier: "NX", pattern: /\bsram\s+nx\b/i },
  { componentType: "groupset", brand: "SRAM", tier: "SX", pattern: /\bsram\s+sx\b/i },
  { componentType: "brakes", model: "hydraulic disc", pattern: /\bhydraulic\s+disc\b|\bhydro\s+disc\b/i },
  { componentType: "brakes", model: "mechanical disc", pattern: /\bmechanical\s+disc\b|\bcable\s+disc\b/i },
  { componentType: "brakes", model: "rim brakes", pattern: /\brim\s+brakes?\b|\bcaliper\s+brakes?\b/i },
  { componentType: "fork", brand: "Fox", pattern: /\bfox\s+(fork|float|factory|performance|32|34|36|38)\b/i },
  { componentType: "fork", brand: "RockShox", pattern: /\brock\s?shox\b|\bjudy\b|\breba\b|\bzed\b|\bpike\b|\blyrik\b/i },
  { componentType: "fork", brand: "Suntour", pattern: /\bsr\s+suntour\b|\bsuntour\b/i },
  { componentType: "wheels", model: "carbon wheels", pattern: /\bcarbon\s+(wheelset|wheels)\b/i },
  { componentType: "drivetrain", model: "1x drivetrain", pattern: /\b1x(10|11|12)?\b|\bone\s+by\b/i }
];

const BICYCLE_TERMS = /\b(bicycle|bike|roadie|mtb|mountain bike|gravel bike|e-?bike|bmx|frameset|frame set|wheelset|groupset)\b/i;
const ACCESSORY_TERMS = /\b(helmet|bike rack|trainer|wheelset|wheels|groupset|fork|crankset|derailleur|pedals|cycling shoes|bike bag)\b/i;
const MOTOR_TERMS = /\b(motorbike|motorcycle|dirt bike|pit bike|quad bike)\b/i;
const FRAME_MATERIALS = [
  { material: "carbon", pattern: /\bcarbon\b/i },
  { material: "aluminium", pattern: /\baluminium\b|\baluminum\b|\balloy\b/i },
  { material: "steel", pattern: /\bsteel\b|\bcromoly\b|\bchromoly\b/i },
  { material: "titanium", pattern: /\btitanium\b|\bti frame\b/i }
];

export class BicycleIdentifier {
  public static identify(listing: Listing): BicycleIdentification {
    const text = this.searchableText(listing);
    const brand = this.findBrand(text);
    const category = this.findCategory(text);
    const components = this.findComponents(text);
    const isAccessory = ACCESSORY_TERMS.test(text) && !BICYCLE_TERMS.test(text);
    const isMotorListing = MOTOR_TERMS.test(text);
    const isBicycle = !isMotorListing && (BICYCLE_TERMS.test(text) || Boolean(brand && category !== "unknown"));
    const frameMaterial = this.findFrameMaterial(text);
    const frameSize = this.findFrameSize(text);
    const probableYear = this.findProbableYear(text);
    const modelFamily = brand ? this.findModelFamily(listing.title, brand) : undefined;
    const confidence = this.calculateConfidence({
      brand: Boolean(brand),
      categoryKnown: category !== "unknown",
      hasBicycleTerm: BICYCLE_TERMS.test(text),
      hasComponents: components.length > 0,
      hasFrameDetail: Boolean(frameMaterial || frameSize),
      isAccessory,
      isBicycle
    });

    return {
      listingId: listing.id,
      isBicycle,
      brand,
      modelFamily,
      exactModelCandidate: brand && modelFamily ? `${brand} ${modelFamily}` : brand,
      alternativeCandidates: [],
      probableYear,
      category: isAccessory && !isBicycle ? "component_or_accessory" : category,
      frameMaterial,
      frameSize,
      confidence,
      extractionMethod: "deterministic_text",
      explanation: this.createExplanation({ brand, category, components, isAccessory, isBicycle, isMotorListing }),
      components
    };
  }

  private static searchableText(listing: Listing): string {
    return `${listing.title || ""}\n${listing.description || ""}`.replace(/\s+/g, " ").trim();
  }

  private static findBrand(text: string): string | undefined {
    return BRAND_PATTERNS.find((brand) => brand.pattern.test(text))?.canonical;
  }

  private static findCategory(text: string): BicycleCategory {
    return CATEGORY_PATTERNS.find((category) => category.pattern.test(text))?.category || "unknown";
  }

  private static findComponents(text: string): BicycleComponent[] {
    return COMPONENT_PATTERNS.filter((component) => component.pattern.test(text)).map((component) => ({
      componentType: component.componentType,
      brand: component.brand,
      model: component.model,
      tier: component.tier,
      confidence: 0.8,
      rawText: this.extractMatchedText(text, component.pattern)
    }));
  }

  private static findFrameMaterial(text: string): string | undefined {
    return FRAME_MATERIALS.find((material) => material.pattern.test(text))?.material;
  }

  private static findFrameSize(text: string): string | undefined {
    const match =
      text.match(/\b(XXS|XS|S|M|L|XL|XXL)\b(?=\s*(frame|size|bike)?\b)/i) ||
      text.match(/\b(4[4-9]|5[0-9]|6[0-4])\s?cm\b/i) ||
      text.match(/\b(1[3-9]|2[0-3])\s?(inch|in|")\b/i);

    return match?.[0];
  }

  private static findProbableYear(text: string): number | undefined {
    const match = text.match(/\b(199[0-9]|20[0-2][0-9])\b/);
    return match ? Number(match[1]) : undefined;
  }

  private static findModelFamily(title: string, brand: string): string | undefined {
    const escapedBrand = brand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
    const match = title.match(new RegExp(`\\b${escapedBrand}\\b\\s+([A-Za-z0-9][A-Za-z0-9+.-]*(?:\\s+[A-Za-z0-9][A-Za-z0-9+.-]*){0,2})`, "i"));
    const genericWords = new Set(["bike", "bicycle", "road", "mountain", "gravel", "hybrid", "frame", "frameset", "mtb"]);
    const candidate = match?.[1]
      ?.split(/\s+/)
      .filter((word) => !genericWords.has(word.toLowerCase()))
      .join(" ")
      .trim();

    return candidate || undefined;
  }

  private static extractMatchedText(text: string, pattern: RegExp): string {
    return text.match(pattern)?.[0] || "";
  }

  private static calculateConfidence(signals: {
    brand: boolean;
    categoryKnown: boolean;
    hasBicycleTerm: boolean;
    hasComponents: boolean;
    hasFrameDetail: boolean;
    isAccessory: boolean;
    isBicycle: boolean;
  }): number {
    let score = 0.15;

    if (signals.hasBicycleTerm) score += 0.3;
    if (signals.brand) score += 0.2;
    if (signals.categoryKnown) score += 0.15;
    if (signals.hasComponents) score += 0.1;
    if (signals.hasFrameDetail) score += 0.1;
    if (signals.isAccessory && !signals.isBicycle) score = Math.min(score, 0.55);
    if (!signals.isBicycle) score = Math.min(score, 0.35);

    return Math.min(Number(score.toFixed(2)), 0.95);
  }

  private static createExplanation(details: {
    brand?: string;
    category: BicycleCategory;
    components: BicycleComponent[];
    isAccessory: boolean;
    isBicycle: boolean;
    isMotorListing: boolean;
  }): string {
    if (details.isMotorListing) {
      return "Text matched motorbike terms, so it is excluded from bicycle identification.";
    }

    if (!details.isBicycle && details.isAccessory) {
      return "Text looks bicycle-related but appears to describe a component or accessory rather than a complete bike.";
    }

    if (!details.isBicycle) {
      return "Text did not contain enough bicycle, brand, category, or component signals.";
    }

    const signals = [
      details.brand ? `brand: ${details.brand}` : null,
      details.category !== "unknown" ? `category: ${details.category}` : null,
      details.components.length > 0 ? `${details.components.length} component signal${details.components.length === 1 ? "" : "s"}` : null
    ].filter(Boolean);

    return `Identified from listing text${signals.length > 0 ? ` (${signals.join(", ")})` : ""}.`;
  }
}
