import { setTimeout } from 'node:timers/promises';

const BASE_URL = 'https://livetiming.formula1.com/static/';

const MAX_ATTEMPTS = 5;

const fetchJson = async <T>(url: string): Promise<T> => {
  let attempts = 0;
  while (attempts < MAX_ATTEMPTS) {
    try {
      const res = await fetch(`${BASE_URL}${url}`);
      if (!res.ok)
        throw new Error(
          `Failed to fetch ${url}: ${res.status} ${res.statusText}`,
        );
      await setTimeout(100);
      return (await res.json()) as T;
    } catch (e) {
      attempts++;
      console.error(`Attempt ${attempts}. Error fetching ${url}:`, e);
      if (attempts >= MAX_ATTEMPTS) {
        throw e;
      }

      await setTimeout(1000 * 2 ** attempts);
    }
  }
};

export default fetchJson;
