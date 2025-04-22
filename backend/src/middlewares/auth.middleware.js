import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const accessToken = req?.cookies?.accessToken;

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "Access token not found",
      });
    }

    let decode;
    try {
      decode = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message:
          error.name === "TokenExpiredError"
            ? "Unauthorized - Access token expired"
            : "Unauthorized - Invalid access token",
      });
    }
    const user = await User.findById(decode.userId || decode._id).select(
      "-password"
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(`Error in protectRoute middleware : ${error}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
