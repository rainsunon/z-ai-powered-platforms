/**
 * JSONB Utility Functions
 * Helper functions for working with PostgreSQL JSONB columns
 */

/**
 * Safely get a nested value from a JSONB object
 */
export function getJsonbValue<T>(jsonb: any, path: string, defaultValue: T): T {
  try {
    const keys = path.split('.');
    let value = jsonb;
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return defaultValue;
      }
    }
    return value as T;
  } catch {
    return defaultValue;
  }
}

/**
 * Merge JSONB data with new values
 */
export function mergeJsonbData<T>(existing: T, updates: Partial<T>): T {
  return {
    ...existing,
    ...updates,
  };
}

/**
 * Create GIN index query for JSONB columns
 */
export function createJsonbIndexQuery(column: string, path: string) {
  return `CREATE INDEX IF NOT EXISTS idx_${column}_${path.replace(/\./g, '_')} 
          ON ${column} USING GIN ((${column} -> '${path}'))`;
}

/**
 * Check if JSONB field has a specific key
 */
export function hasJsonbKey(jsonb: any, key: string): boolean {
  return jsonb && typeof jsonb === 'object' && key in jsonb;
}

/**
 * Remove a key from JSONB object
 */
export function removeJsonbKey<T>(jsonb: T, key: keyof T): Omit<T, keyof T> {
  const { [key]: removed, ...rest } = jsonb;
  return rest as Omit<T, keyof T>;
}
