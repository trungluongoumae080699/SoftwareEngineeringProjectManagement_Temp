import { getMyTrips } from "../Repositories/MySqlRepo/TripRepo.js";
export const fetchMyTrips = async (request, response) => {
    let session = request.session;
    let page = request.query.page ? Number(request.query.page) : 1;
    const result = await getMyTrips(session.userId, page);
    response.status(200).json(result);
};
