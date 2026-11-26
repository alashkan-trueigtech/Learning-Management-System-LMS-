
const { redisClient } = require("../config/redis");

const getCache = async (key) => {
    try {
        if (!redisClient.isReady) return null;

        const data = await redisClient.get(key);

        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error("Redis cache read error:", error.message);
        return null;
    }
};

const setCache = async (key, data, ttl = 60) => {
    try {
        if (!redisClient.isReady) return;

        await redisClient.set(key, JSON.stringify(data), {
            EX: ttl,
        });
    } catch (error) {
        console.error("Redis cache write error:", error.message);
    }
};

const getCacheVersion = async () => {
    try {
        if (!redisClient.isReady) return "0";

        return (await redisClient.get("courses:cache:version")) || "0";
    } catch (error) {
        console.error("Redis version read error:", error.message);
        return "0";
    }
};

const invalidateCourseCache = async () => {
    try {
        if (!redisClient.isReady) return;

        await redisClient.incr("courses:cache:version");
    } catch (error) {
        console.error("Redis cache invalidation error:", error.message);
    }
};

module.exports = {
    getCache,
    setCache,
    getCacheVersion,
    invalidateCourseCache,
};
