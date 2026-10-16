-- D1 schema. Apply once: npx wrangler d1 execute mishna-bekviuta --remote --file=schema.sql
CREATE TABLE IF NOT EXISTS progress (
  uid        TEXT PRIMARY KEY,   -- Firebase user id
  email      TEXT,
  name       TEXT,
  bits       TEXT NOT NULL,      -- one bit per chapter, base64url (same encoding as the site's local storage)
  updated_at INTEGER NOT NULL    -- ms since epoch
);
