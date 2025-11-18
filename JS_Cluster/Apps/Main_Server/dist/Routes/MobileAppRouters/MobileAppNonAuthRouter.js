import express from "express";
import { fetchMyTrips } from "../../Controllers/MobileAppController.js";
export const mobileAppNonAuthRouter = express.Router();
mobileAppNonAuthRouter.get("/trips", (request, response, next) => {
    const customerRequest = request;
    fetchMyTrips(customerRequest, response);
});
