const cache = new Map();

export function cachedFetch(key, fetcher, ttl = 60000) {
  if (cache.has(key)) {
    const { data, time } = cache.get(key);
    if (Date.now() - time < ttl) return Promise.resolve(data);
  }

  return fetcher().then(data => {
    cache.set(key, { data, time: Date.now() });
    return data;
  });
}
