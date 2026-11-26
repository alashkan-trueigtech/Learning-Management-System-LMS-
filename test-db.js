
const sequelize = require("./config/database");

const testConnection = async () => {
  try {
    await sequelize.authenticate();

    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Unable to connect to database:", error.message);
  } finally {
    await sequelize.close();
  }
};

testConnection();