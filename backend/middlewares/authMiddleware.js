import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const Authorization = req.headers.Authorization || req.headers.authorization;

  if (Authorization && Authorization.startsWith("Bearer")) {
    const token = Authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, info) => {
      if (err) {
        return res
          .status(403)
          .json({ message: "Unauthorized. Invalid token." });
      }
      req.user = info;
      next();
    });
  } else {
    return res
      .status(403)
      .json({ message: "You must be logged in to do this." });
  }
};

export default authMiddleware;
