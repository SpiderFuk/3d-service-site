const cache = new Map<string, { data: unknown; fetchedAt: number }>();
const pending = new Map<string, Promise<unknown>>();
const CACHE_TTL = 5 * 60 * 1000;
const TIMEOUT = 10_000;

export async function fetchContent<T>(type: string, fallback: T): Promise<T> {
	const cached = cache.get(type);
	if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
		return cached.data as T;
	}

	const inflight = pending.get(type);
	if (inflight) {
		return inflight as Promise<T>;
	}

	const promise = (async (): Promise<T> => {
		try {
			const response = await fetch(`/content/data/${type}.json`, {
				signal: AbortSignal.timeout(TIMEOUT)
			});

			if (!response.ok) {
				return fallback;
			}

			const data = (await response.json()) as T;
			cache.set(type, { data, fetchedAt: Date.now() });
			return data;
		} catch {
			return fallback;
		} finally {
			pending.delete(type);
		}
	})();

	pending.set(type, promise);
	return promise;
}
