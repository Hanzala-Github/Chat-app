import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { generateTokens } from "../utils/generateTokens.js";
import validator from "validator";
import cloudinary from "../lib/cloudinary.js";

// ........Signup controller...........//

const Signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Basic validation
    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    if (password.length < 6 || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters long and include a special character.",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    // Create a new user
    const newUser = await User.create({
      fullName,
      email,
      password,
    });

    // Generate JWT token
    await generateTokens(newUser._id, res);

    // Remove password before sending response
    const userResponse = {
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      createdAt: newUser.createdAt,
    };

    return res.status(200).json({
      success: true,
      user: userResponse,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Error in Signup Controller:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// ...............Login controller...............//

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400) // 🔹 Use 400 for "Bad Request" instead of 401
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(401) // 🔹 Use 401 for unauthorized access
        .json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // 🔹 Ensure `generateTokens` does NOT send a response
    const { accessToken, refreshToken } = await generateTokens(user._id, res);

    // 🔹 Remove password before sending response
    const { password: _, ...userData } = user.toObject();

    const responseUser = { ...userData, token: accessToken };

    return res.status(200).json({
      success: true,
      user: responseUser,
      message: "User Logged in successfully",
    });
  } catch (error) {
    console.error("Error in Login Controller:", error);
    // return next(error); // ✅ Properly pass errors to Express middleware
  }
};

// ..........logout controller..............//

const Logout = async (req, res, next) => {
  try {
    const token = req?.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No refresh token found",
      });
    }

    res.clearCookie("accessToken", { httpOnly: true, sameSite: "strict" });
    res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });

    return res
      .status(200)
      .json({ success: true, message: "User Logged Out successfully" });
  } catch (error) {
    console.error(`Error in Logout controller : ${error}`);
    next(error);
  }
};

// ..........updateProfile controller..............//

const updateProfile = async (req, res, next) => {
  const { profilePic } = req.body;
  const userId = req.user?._id;

  try {
    if (!profilePic) {
      return res
        .status(400)
        .json({ success: false, message: "Profile picture is required" });
    }

    // Validate that profilePic is a valid Base64 string or URL
    if (
      typeof profilePic !== "string" ||
      (!profilePic.startsWith("data:image/") && !profilePic.startsWith("http"))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid profile picture format",
      });
    }

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(profilePic, {
      folder: "profile_pictures",
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    });

    if (!uploadResponse?.secure_url) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload profile picture",
      });
    }

    // Update User Profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse?.secure_url },
      { new: true, select: "-password" }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error in updateProfile controller:", error.message);
    return next(error);
  }
};

// ...........checkAuth controller..........//
const checkAuth = (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - No user found",
    });
  }

  res.status(200).json({
    success: true,
    user: req.user,
    message: "User authenticated successfully",
  });
};

// export controllers

export { Signup, Login, Logout, updateProfile, checkAuth };
