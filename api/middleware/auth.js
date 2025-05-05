const { verifyToken } = require("../config/jwt");
const Response = require("../lib/Response");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json(
      Response.errorResponse({
        message: "Yetkilendirme token'ı bulunamadı",
        code: 401,
      })
    );
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json(
      Response.errorResponse({
        message: "Geçersiz veya süresi dolmuş token",
        code: 401,
      })
    );
  }

  req.user = decoded;
  next();
};

module.exports = authMiddleware;
