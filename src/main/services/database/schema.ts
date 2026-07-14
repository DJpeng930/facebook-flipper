export const SCHEMA_VERSION = 1;

export const schemaStatements = [
  `CREATE TABLE IF NOT EXISTS listings (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    image_url TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'pending',
    price REAL NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT '$',
    location_name TEXT NOT NULL DEFAULT '',
    location_latitude REAL,
    location_longitude REAL,
    location_distance REAL,
    age_string TEXT NOT NULL DEFAULT '',
    age INTEGER NOT NULL DEFAULT 0,
    value_analysis_json TEXT,
    raw_json TEXT NOT NULL,
    outcome_status TEXT NOT NULL DEFAULT 'active',
    first_seen_at TEXT NOT NULL,
    last_seen_at TEXT NOT NULL,
    disappeared_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS listing_snapshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    listing_id TEXT NOT NULL,
    observed_at TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    price REAL NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT '$',
    location_name TEXT NOT NULL DEFAULT '',
    location_distance REAL,
    status TEXT NOT NULL DEFAULT 'pending',
    raw_json TEXT NOT NULL,
    FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
  )`,

  `CREATE TABLE IF NOT EXISTS listing_search_hits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    listing_id TEXT NOT NULL,
    query TEXT NOT NULL,
    search_location TEXT,
    radius_km REAL,
    hit_at TEXT NOT NULL,
    FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
  )`,

  `CREATE TABLE IF NOT EXISTS listing_price_changes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    listing_id TEXT NOT NULL,
    old_price REAL NOT NULL,
    new_price REAL NOT NULL,
    currency TEXT NOT NULL DEFAULT '$',
    changed_at TEXT NOT NULL,
    FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
  )`,

  `CREATE TABLE IF NOT EXISTS bicycle_identifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    listing_id TEXT NOT NULL,
    brand TEXT,
    model_family TEXT,
    exact_model_candidate TEXT,
    alternative_candidates_json TEXT,
    probable_year INTEGER,
    probable_year_range TEXT,
    category TEXT,
    frame_material TEXT,
    frame_size TEXT,
    confidence REAL NOT NULL DEFAULT 0,
    extraction_method TEXT NOT NULL DEFAULT 'unclassified',
    explanation TEXT,
    identified_at TEXT NOT NULL,
    FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
  )`,

  `CREATE TABLE IF NOT EXISTS bicycle_components (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    listing_id TEXT NOT NULL,
    identification_id INTEGER,
    component_type TEXT NOT NULL,
    brand TEXT,
    model TEXT,
    tier TEXT,
    condition_note TEXT,
    confidence REAL NOT NULL DEFAULT 0,
    raw_text TEXT,
    FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
    FOREIGN KEY (identification_id) REFERENCES bicycle_identifications(id) ON DELETE SET NULL
  )`,

  `CREATE TABLE IF NOT EXISTS bicycle_catalogue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    brand TEXT NOT NULL,
    model_family TEXT NOT NULL,
    exact_model TEXT,
    generation TEXT,
    year_start INTEGER,
    year_end INTEGER,
    category TEXT,
    frame_platform TEXT,
    frame_material TEXT,
    notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS component_catalogue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    component_type TEXT NOT NULL,
    brand TEXT,
    model TEXT,
    tier TEXT,
    release_year INTEGER,
    notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS comparables (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    listing_id TEXT NOT NULL,
    evidence_id INTEGER,
    source TEXT NOT NULL,
    evidence_type TEXT NOT NULL,
    comparable_title TEXT,
    comparable_url TEXT,
    price REAL NOT NULL,
    currency TEXT NOT NULL DEFAULT 'AUD',
    evidence_date TEXT,
    identity_match_score REAL NOT NULL DEFAULT 0,
    comparable_match_score REAL NOT NULL DEFAULT 0,
    evidence_confidence REAL NOT NULL DEFAULT 0,
    recency_weight REAL NOT NULL DEFAULT 1,
    included_in_valuation INTEGER NOT NULL DEFAULT 0,
    exclusion_reason TEXT,
    raw_json TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
  )`,

  `CREATE TABLE IF NOT EXISTS historical_market_evidence (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source TEXT NOT NULL,
    evidence_type TEXT NOT NULL,
    title TEXT NOT NULL,
    url TEXT,
    price REAL NOT NULL,
    currency TEXT NOT NULL DEFAULT 'AUD',
    evidence_date TEXT NOT NULL,
    brand TEXT,
    model_family TEXT,
    exact_model TEXT,
    category TEXT,
    condition_note TEXT,
    location_name TEXT,
    confidence REAL NOT NULL DEFAULT 0,
    raw_json TEXT,
    created_at TEXT NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS valuations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    listing_id TEXT NOT NULL,
    conservative_resale_value REAL,
    expected_resale_value REAL,
    optimistic_resale_value REAL,
    expected_purchase_price REAL,
    estimated_repair_cost REAL,
    component_adjustment REAL,
    part_out_value REAL,
    expected_net_profit REAL,
    return_on_cash REAL,
    valuation_confidence REAL NOT NULL DEFAULT 0,
    expected_holding_days REAL,
    deal_score INTEGER NOT NULL DEFAULT 0,
    valuation_method TEXT NOT NULL DEFAULT 'unvalued',
    created_at TEXT NOT NULL,
    FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
  )`,

  `CREATE TABLE IF NOT EXISTS valuation_factor_contributions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    valuation_id INTEGER NOT NULL,
    factor_key TEXT NOT NULL,
    label TEXT NOT NULL,
    enabled INTEGER NOT NULL DEFAULT 1,
    weight REAL NOT NULL DEFAULT 1,
    amount REAL NOT NULL DEFAULT 0,
    explanation TEXT,
    FOREIGN KEY (valuation_id) REFERENCES valuations(id) ON DELETE CASCADE
  )`,

  `CREATE TABLE IF NOT EXISTS risk_assessments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    listing_id TEXT NOT NULL,
    valuation_id INTEGER,
    risk_key TEXT NOT NULL,
    severity TEXT NOT NULL,
    explanation TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
    FOREIGN KEY (valuation_id) REFERENCES valuations(id) ON DELETE SET NULL
  )`,

  `CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    listing_id TEXT NOT NULL,
    valuation_id INTEGER,
    priority TEXT NOT NULL,
    channel TEXT NOT NULL,
    triggered_reason TEXT NOT NULL,
    sent_at TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    payload_json TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
    FOREIGN KEY (valuation_id) REFERENCES valuations(id) ON DELETE SET NULL
  )`,

  `CREATE TABLE IF NOT EXISTS application_settings (
    key TEXT PRIMARY KEY,
    value_json TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    listing_id TEXT,
    investigated_at TEXT,
    seller_contacted_at TEXT,
    inspected_at TEXT,
    negotiated_purchase_price REAL,
    actual_purchase_price REAL,
    actual_repair_cost REAL,
    founder_time_minutes INTEGER,
    actual_resale_price REAL,
    sold_at TEXT,
    days_held INTEGER,
    actual_profit REAL,
    rejected_reason TEXT,
    notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE SET NULL
  )`,

  `CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status)`,
  `CREATE INDEX IF NOT EXISTS idx_listings_last_seen_at ON listings(last_seen_at)`,
  `CREATE INDEX IF NOT EXISTS idx_listing_snapshots_listing_id ON listing_snapshots(listing_id)`,
  `CREATE INDEX IF NOT EXISTS idx_listing_search_hits_listing_id ON listing_search_hits(listing_id)`,
  `CREATE INDEX IF NOT EXISTS idx_listing_price_changes_listing_id ON listing_price_changes(listing_id)`,
  `CREATE INDEX IF NOT EXISTS idx_bicycle_identifications_listing_id ON bicycle_identifications(listing_id)`,
  `CREATE INDEX IF NOT EXISTS idx_comparables_listing_id ON comparables(listing_id)`,
  `CREATE INDEX IF NOT EXISTS idx_historical_market_evidence_identity ON historical_market_evidence(brand, model_family, exact_model)`,
  `CREATE INDEX IF NOT EXISTS idx_valuations_listing_id ON valuations(listing_id)`,
  `CREATE INDEX IF NOT EXISTS idx_alerts_listing_id ON alerts(listing_id)`
];
