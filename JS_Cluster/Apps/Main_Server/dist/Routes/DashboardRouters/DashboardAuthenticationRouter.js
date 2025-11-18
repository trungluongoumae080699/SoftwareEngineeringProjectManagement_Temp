import express from "express";
import { authenticateAdmin } from "../../Controllers/AuthenticationController.js";
export const dashboardAuthenticationRouter = express.Router();
dashboardAuthenticationRouter.post("/signIn", (request, response, next) => {
    const customerRequest = request;
    authenticateAdmin(customerRequest, response, next);
});
