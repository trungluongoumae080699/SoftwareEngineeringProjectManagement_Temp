import { Response_MobileAppLogInDTO } from "@trungthao/mobile_app_dto";
import { CustomRequest } from "../Middlewares/Authorization.js";
import { Customer } from "../Models/Customer.js";
import { getCustomerById } from "../Repositories/MySqlRepo/CustomerRepo.js";
import { SessionObject, getSession } from "../Repositories/RedisRepo/SessionRepo.js";
import { getMyTrips } from "../Repositories/MySqlRepo/TripRepo.js";
import { Response } from "express";

export const fetchMyTrips = async (request: CustomRequest<{},{},{},{page?: string}>, response: Response) => {
    let session: SessionObject = request.session as SessionObject
    let page = request.query.page ? Number(request.query.page) : 1
    const result = await getMyTrips(session.userId, page)
    response.status(200).json(result)

}