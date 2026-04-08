const express = require("express");
const app = express();
const PORT = 3000;
const route = require("./src/routes/index");
const connectDatabase = require("./src/config/dbConfig");
const errorHandler = require("./src/middlewares/middleware");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/config/swagger");

app.use(express.json());

//database connections
connectDatabase();

// routes
app.use(route);

// error Handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listening port of ${PORT}`);

  // console.log("Swagger paths:", swaggerSpec.paths);
  app.use("/swagger-ui", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`http://localhost:${PORT}/swagger-ui`);
});
