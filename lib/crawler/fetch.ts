import { setTimeout } from 'node:timers/promises';

const BASE_URL = 'https://livetiming.formula1.com/static/';

const fetchJson = async <T>(url: string): Promise<T> => {
  try {
    const res = await fetch(`${BASE_URL}${url}`);
    if (!res.ok)
      throw new Error(
        `Failed to fetch ${url}: ${res.status} ${res.statusText}`,
      );
    await setTimeout(100);
    return (await res.json()) as T;
  } catch (e) {
    console.error(`Error fetching ${url}:`, e);
    throw e;
  }
};

export default fetchJson;
