const { createClient } = require("redis");

const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
});

redisClient.on("error", (error) => {
    console.error("Redis connection error:", error.message);
});

redisClient.on("connect", () => {
    console.log("Connecting to Redis...");
});

redisClient.on("ready", () => {
    console.log("Redis connected successfully!");
});

const connectRedis = async () => {
    try {
        if (redisClient.isOpen) {
            return true;
        }

        await redisClient.connect();
        return true;
    } catch (error) {
        console.error("Redis unavailable:", error.message);
        return false;
    }
};

const disconnectRedis = async () => {
    if (redisClient.isOpen) {
        await redisClient.quit();
    }
};

module.exports = {
    redisClient,
    connectRedis,
    disconnectRedis,
};
