const LRU = require("lru-cache");

const cacheOptions = { max: 500, maxAge: 1000 * 60 * 60 };
const cache = new LRU(cacheOptions);

/**
 *
 * @param {string} key
 * @param {Function} [fetchFunc]
 */
const withCache = async (key, fetchFunc = async () => key) => {
  const cachedResult = cache.get(key);
  if (cachedResult) {
    console.log(
      `===================== Fetching Cache: ${key} =====================`
    );
    return cachedResult;
  } else {
    try {
      console.log(
        `===================== Fetching API: ${key} =====================`
      );
      const result = await fetchFunc();
      cache.set(key, result);
      return result;
    } catch (error) {
      console.log(error);
    }
  }
};

module.exports = {
  withCache,
};
