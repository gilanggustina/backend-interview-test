import express, { Application } from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler";
import { responseWrapper } from "./middlewares/responseWrapper";
import routes from "./routes";
import { startScheduler } from "./modules/scheduler/scheduler";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middlewares global
app.use(cors());
app.use(responseWrapper);

// Health check
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Backend Test API is running 🚀",
  });
});

// Register routes
app.use(routes);

// Start Scheduler
startScheduler();

// Error handler global
app.use(errorHandler);

export default app;
