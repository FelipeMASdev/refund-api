import { Router } from "express";
import { healthRoutes } from "./health";

import { usersRoutes } from "./users-routes";
import { sessionsRoutes } from "./sessions-routes";

const routes = Router();

//health check
routes.use("/health", healthRoutes);

//public routes
routes.use("/users", usersRoutes);
routes.use("/sessions", sessionsRoutes);

export { routes };