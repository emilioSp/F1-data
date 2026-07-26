import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE IF NOT EXISTS teams_standings (
        team_name TEXT NOT NULL,
        points INTEGER NOT NULL,
        session_id INTEGER REFERENCES sessions(id),
        PRIMARY KEY (team_name, session_id)
    );
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP TABLE IF EXISTS teams_standings;');
}
