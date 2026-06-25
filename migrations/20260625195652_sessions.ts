import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TYPE session_type AS ENUM (
     'sprint_qualifying',
     'sprint',
     'qualifying',
     'race'
    )
  `);

  await knex.raw(`
    CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY,
        type session_type NOT NULL,
        gp_id INTEGER NOT NULL REFERENCES grand_prixs(id),
        start_date TIMESTAMPTZ NOT NULL,
        end_date TIMESTAMPTZ NOT NULL,
        start_date_local TIMESTAMP NOT NULL,
        end_date_local TIMESTAMP NOT NULL,
        gmt_offset TEXT NOT NULL,
        air_temp NUMERIC(5, 2) NOT NULL,
        track_temp NUMERIC(5, 2) NOT NULL,
        humidity NUMERIC(5, 2) NOT NULL,
        UNIQUE (gp_id, type)
    );
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP TABLE IF EXISTS sessions;`);
  await knex.raw(`DROP TYPE IF EXISTS session_type;`);
}
