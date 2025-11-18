import { getSession } from "../Repositories/RedisRepo/SessionRepo.js";
export function authorize(allowedRoles) {
    return async (req, res, next) => {
        console.log("🔐 Authorizing...");
        let session = null;
        const sessionId = req.headers["authorization"];
        if (sessionId) {
            session = await getSession(sessionId);
            if (session) {
                const now = Date.now();
                const createdAtMs = new Date(session.createdAt).getTime();
                const expiryMs = createdAtMs + session.validPeriod;
                if (now > expiryMs) {
                    res.status(401).json({ message: "Phiên đăng nhập đã hết hạn." });
                    return;
                }
                if (!allowedRoles.includes(session.logInType)) {
                    res.status(401).json({ message: "Bạn không được thực hiện thao tác này" });
                    return;
                }
                req.session = session;
            }
        }
        if (!sessionId || !session) {
            res.status(401).json({ message: "Thiếu mã phiên đăng nhập." });
            return;
        }
        next();
    };
}
