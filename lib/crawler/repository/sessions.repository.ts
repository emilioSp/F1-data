import db from '../../db.ts';
import type { Session } from '../types.ts';

const TABLE_NAME = 'sessions';

const SessionsRepository = {
  upsert: async (session: Session) => {
    const [row] = await db<Session>(TABLE_NAME)
      .insert(session)
      .onConflict(['gp_id', 'type'])
      .merge()
      .returning('*');

    return row;
  },
};

export default SessionsRepository;
