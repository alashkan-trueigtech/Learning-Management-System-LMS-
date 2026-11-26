
require("dotenv").config();

const app = require("./app");
const sequelize = require("./config/database");
require("./models");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connected successfully!");

        await sequelize.sync();
        console.log("All models synchronized successfully!");

        app.listen(PORT, () => {
            console.log(`LMS Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();

