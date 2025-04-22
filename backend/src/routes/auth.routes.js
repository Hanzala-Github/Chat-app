import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";

import {
  Login,
  Logout,
  Signup,
  updateProfile,
  checkAuth,
} from "../controllers/auth.controller.js";

const router = Router();
// Signup
router.route("/signup").post(Signup);
// Login
router.route("/login").post(Login);
// Logout
router.route("/logout").post(Logout);
// update-profile
router.route("/update-profile").put(protectRoute, updateProfile);
//
router.route("/check").get(protectRoute, checkAuth);
// export router

export default router;
