class TTLCache {
  constructor(cleanupIntervalInSeconds = 300) {
    this.cache = new Map();
    this.cleanupInterval = setInterval(
      () => this.cleanup(),
      cleanupIntervalInSeconds * 1000
    );
  }

  set(key, value, ttlInSeconds) {
    const expireAt = Date.now() + ttlInSeconds * 1000;
    this.cache.set(key, { value, expireAt });
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expireAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }
  getTTL(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expireAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.expireAt;
  }

  delete(key) {
    return this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  cleanup() {
    for (const [key, entry] of this.cache.entries()) {
      const now = Date.now();
      if (entry.expireAt <= now) {
        this.cache.delete(key);
        console.log(
          `Cache entry for "${key}" has expired and been removed during cleanup.`
        );
      }
    }
  }

  stopCleanup() {
    clearInterval(this.cleanupInterval);
  }

  print() {
    console.log("************* PRINTING CACHE ****************");

    for (const [key, value] of this.cache)
      console.log(`${value.value.name} \t\t`, "\t\t", value.expireAt, key);
  }
}

module.exports = TTLCache;
