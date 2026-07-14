import Store from "electron-store";
import { BicycleIdentification, Listing, ListingStatus } from "../../../shared/types";
import { getDatabase } from "../database/database";

interface ListingHashTable {
  [id: string]: Listing;
}

interface ListingRow {
  id: string;
  title: string;
  description: string;
  image_url: string;
  status: ListingStatus;
  price: number;
  currency: string;
  location_name: string;
  location_latitude: number | null;
  location_longitude: number | null;
  location_distance: number | null;
  age_string: string;
  age: number;
  value_analysis_json: string | null;
}

interface SearchObservation {
  query: string;
  searchLocation: string | null;
  radiusKm: number | null;
}

export class ListingRepository {
  private static legacyStore = new Store<{ listings: ListingHashTable }>({
    name: "savedListings",
    defaults: {
      listings: {}
    }
  });

  public static getById(id: string): Listing | null {
    this.migrateLegacyListings();

    const row = getDatabase().prepare("SELECT * FROM listings WHERE id = ?").get(id) as ListingRow | undefined;
    return row ? this.rowToListing(row) : null;
  }

  public static getPending(): Listing[] {
    return this.getByStatus("pending");
  }

  public static getDiscarded(): Listing[] {
    return this.getByStatus("discarded");
  }

  public static getSaved(): Listing[] {
    return this.getByStatus("saved");
  }

  public static getAll(): Listing[] {
    this.migrateLegacyListings();

    return (getDatabase().prepare("SELECT * FROM listings ORDER BY last_seen_at DESC").all() as ListingRow[]).map((row) => this.rowToListing(row));
  }

  public static updateStatus(id: string, status: ListingStatus): void {
    this.migrateLegacyListings();

    getDatabase()
      .prepare(
        `UPDATE listings
         SET status = ?, updated_at = ?
         WHERE id = ?`
      )
      .run(status, new Date().toISOString(), id);
  }

  public static saveAll(listings: Listing[]): void {
    this.migrateLegacyListings();
    this.persistListings(listings, false);
  }

  public static saveSearchResults(listings: Listing[], observation: SearchObservation): void {
    this.migrateLegacyListings();
    this.persistListings(listings, true, observation);
  }

  public static saveBicycleIdentifications(identifications: BicycleIdentification[]): void {
    this.migrateLegacyListings();

    if (identifications.length === 0) {
      return;
    }

    const db = getDatabase();
    const now = new Date().toISOString();

    const deleteComponents = db.prepare("DELETE FROM bicycle_components WHERE listing_id = ?");
    const deleteIdentifications = db.prepare("DELETE FROM bicycle_identifications WHERE listing_id = ?");
    const insertIdentification = db.prepare(
      `INSERT INTO bicycle_identifications (
        listing_id,
        brand,
        model_family,
        exact_model_candidate,
        alternative_candidates_json,
        probable_year,
        probable_year_range,
        category,
        frame_material,
        frame_size,
        confidence,
        extraction_method,
        explanation,
        identified_at
      ) VALUES (
        @listingId,
        @brand,
        @modelFamily,
        @exactModelCandidate,
        @alternativeCandidatesJson,
        @probableYear,
        @probableYearRange,
        @category,
        @frameMaterial,
        @frameSize,
        @confidence,
        @extractionMethod,
        @explanation,
        @now
      )`
    );
    const insertComponent = db.prepare(
      `INSERT INTO bicycle_components (
        listing_id,
        identification_id,
        component_type,
        brand,
        model,
        tier,
        condition_note,
        confidence,
        raw_text
      ) VALUES (
        @listingId,
        @identificationId,
        @componentType,
        @brand,
        @model,
        @tier,
        @conditionNote,
        @confidence,
        @rawText
      )`
    );

    const saveIdentifications = db.transaction((items: BicycleIdentification[]) => {
      items.forEach((identification) => {
        deleteComponents.run(identification.listingId);
        deleteIdentifications.run(identification.listingId);

        const result = insertIdentification.run({
          listingId: identification.listingId,
          brand: identification.brand ?? null,
          modelFamily: identification.modelFamily ?? null,
          exactModelCandidate: identification.exactModelCandidate ?? null,
          alternativeCandidatesJson: JSON.stringify(identification.alternativeCandidates),
          probableYear: identification.probableYear ?? null,
          probableYearRange: identification.probableYearRange ?? null,
          category: identification.isBicycle ? identification.category : `not_bicycle:${identification.category}`,
          frameMaterial: identification.frameMaterial ?? null,
          frameSize: identification.frameSize ?? null,
          confidence: identification.confidence,
          extractionMethod: identification.extractionMethod,
          explanation: identification.explanation,
          now
        });

        identification.components.forEach((component) => {
          insertComponent.run({
            listingId: identification.listingId,
            identificationId: result.lastInsertRowid,
            componentType: component.componentType,
            brand: component.brand ?? null,
            model: component.model ?? null,
            tier: component.tier ?? null,
            conditionNote: component.conditionNote ?? null,
            confidence: component.confidence,
            rawText: component.rawText
          });
        });
      });
    });

    saveIdentifications(identifications);
  }

  public static delete(id: string): void {
    this.migrateLegacyListings();
    getDatabase().prepare("DELETE FROM listings WHERE id = ?").run(id);
  }

  public static deleteAllByStatus(status: ListingStatus): void {
    this.migrateLegacyListings();
    getDatabase().prepare("DELETE FROM listings WHERE status = ?").run(status);
  }

  private static getByStatus(status: ListingStatus): Listing[] {
    this.migrateLegacyListings();

    return (getDatabase().prepare("SELECT * FROM listings WHERE status = ? ORDER BY last_seen_at DESC").all(status) as ListingRow[]).map((row) =>
      this.rowToListing(row)
    );
  }

  private static persistListings(listings: Listing[], createSnapshots: boolean, observation?: SearchObservation): void {
    if (listings.length === 0) {
      return;
    }

    const db = getDatabase();
    const now = new Date().toISOString();

    const upsertListing = db.prepare(
      `INSERT INTO listings (
        id,
        title,
        description,
        image_url,
        status,
        price,
        currency,
        location_name,
        location_latitude,
        location_longitude,
        location_distance,
        age_string,
        age,
        value_analysis_json,
        raw_json,
        first_seen_at,
        last_seen_at,
        created_at,
        updated_at
      ) VALUES (
        @id,
        @title,
        @description,
        @imageUrl,
        @status,
        @price,
        @currency,
        @locationName,
        @locationLatitude,
        @locationLongitude,
        @locationDistance,
        @ageString,
        @age,
        @valueAnalysisJson,
        @rawJson,
        @now,
        @now,
        @now,
        @now
      )
      ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        description = excluded.description,
        image_url = excluded.image_url,
        status = excluded.status,
        price = excluded.price,
        currency = excluded.currency,
        location_name = excluded.location_name,
        location_latitude = excluded.location_latitude,
        location_longitude = excluded.location_longitude,
        location_distance = excluded.location_distance,
        age_string = excluded.age_string,
        age = excluded.age,
        value_analysis_json = excluded.value_analysis_json,
        raw_json = excluded.raw_json,
        last_seen_at = excluded.last_seen_at,
        updated_at = excluded.updated_at`
    );

    const insertSnapshot = db.prepare(
      `INSERT INTO listing_snapshots (
        listing_id,
        observed_at,
        title,
        description,
        price,
        currency,
        location_name,
        location_distance,
        status,
        raw_json
      ) VALUES (
        @id,
        @now,
        @title,
        @description,
        @price,
        @currency,
        @locationName,
        @locationDistance,
        @status,
        @rawJson
      )`
    );

    const insertSearchHit = db.prepare(
      `INSERT INTO listing_search_hits (
        listing_id,
        query,
        search_location,
        radius_km,
        hit_at
      ) VALUES (
        @id,
        @query,
        @searchLocation,
        @radiusKm,
        @now
      )`
    );

    const getExistingPrice = db.prepare("SELECT price FROM listings WHERE id = ?");
    const insertPriceChange = db.prepare(
      `INSERT INTO listing_price_changes (
        listing_id,
        old_price,
        new_price,
        currency,
        changed_at
      ) VALUES (
        @id,
        @oldPrice,
        @newPrice,
        @currency,
        @now
      )`
    );

    const saveListings = db.transaction((items: Listing[]) => {
      items.forEach((listing) => {
        const existing = getExistingPrice.get(listing.id) as { price: number } | undefined;
        const params = this.listingToSqlParams(listing, now);

        upsertListing.run(params);

        if (createSnapshots) {
          insertSnapshot.run(params);

          if (observation) {
            insertSearchHit.run({ ...params, ...observation });
          }

          if (existing && existing.price !== listing.price) {
            insertPriceChange.run({
              id: listing.id,
              oldPrice: existing.price,
              newPrice: listing.price,
              currency: listing.currency || "$",
              now
            });
          }
        }
      });
    });

    saveListings(listings);
  }

  private static listingToSqlParams(listing: Listing, now: string): Record<string, unknown> {
    return {
      id: listing.id,
      title: listing.title,
      description: listing.description || "",
      imageUrl: listing.imageUrl || "",
      status: listing.status,
      price: listing.price || 0,
      currency: listing.currency || "$",
      locationName: listing.location?.name || "",
      locationLatitude: listing.location?.latitude ?? null,
      locationLongitude: listing.location?.longitude ?? null,
      locationDistance: listing.location?.distance ?? null,
      ageString: listing.ageString || "",
      age: listing.age || 0,
      valueAnalysisJson: listing.valueAnalysis ? JSON.stringify(listing.valueAnalysis) : null,
      rawJson: JSON.stringify(listing),
      now
    };
  }

  private static rowToListing(row: ListingRow): Listing {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      imageUrl: row.image_url,
      status: row.status,
      price: row.price,
      currency: row.currency,
      location: {
        name: row.location_name,
        latitude: row.location_latitude ?? 0,
        longitude: row.location_longitude ?? 0,
        distance: row.location_distance
      },
      ageString: row.age_string,
      age: row.age,
      valueAnalysis: row.value_analysis_json ? JSON.parse(row.value_analysis_json) : undefined
    };
  }

  private static migrateLegacyListings(): void {
    const db = getDatabase();
    const migrationKey = "migration.legacy_listings_v1";
    const migrationComplete = db.prepare("SELECT value_json FROM application_settings WHERE key = ?").get(migrationKey) as { value_json: string } | undefined;

    if (migrationComplete) {
      return;
    }

    const listings = Object.values(this.legacyStore.get("listings") || {});
    this.persistListings(listings, false);

    db.prepare(
      `INSERT INTO application_settings (key, value_json, updated_at)
       VALUES (?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json, updated_at = excluded.updated_at`
    ).run(migrationKey, JSON.stringify(true), new Date().toISOString());
  }
}
