import knex from 'knex';
import pg from 'pg';
import config from '../knexfile.js';

// 1114 = timestamp, 1184 = timestamptz — return raw string instead of Date
pg.types.setTypeParser(1114, (v) => v);
pg.types.setTypeParser(1184, (v) => v);

const toCamel = (s: string) => {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
};

const camelizeKeys = (obj: unknown): unknown => {
  if (Array.isArray(obj)) return obj.map(camelizeKeys);
  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>).map(([k, v]) => [
        toCamel(k),
        camelizeKeys(v),
      ]),
    );
  }
  return obj;
};

const db = knex({
  postProcessResponse: (result) => camelizeKeys(result),
  ...config,
});

export default db;
