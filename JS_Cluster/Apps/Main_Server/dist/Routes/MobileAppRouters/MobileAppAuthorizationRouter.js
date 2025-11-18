import express from "express";
import { authenticateCustomer, formlessAuthenticateCustomer, registerCustomer } from "../../Controllers/AuthenticationController.js";
export const mobileAppAuthenticationRouter = express.Router();
mobileAppAuthenticationRouter.post("/signIn", (request, response, next) => {
    const customerRequest = request;
    authenticateCustomer(customerRequest, response, next);
});
mobileAppAuthenticationRouter.get("/signIn/session", (request, response, next) => {
    const customerRequest = request;
    formlessAuthenticateCustomer(customerRequest, response);
});
mobileAppAuthenticationRouter.post("/signUp", (request, response, next) => {
    console.log("Handing Registration Request");
    const customerRequest = request;
    registerCustomer(customerRequest, response, next);
});
