import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";

import {
  getMessages,
  getUsersForSidebar,
  sendMessage,
  deleteMessagesHistory,
} from "../controllers/message.controller.js";

const router = Router();

router.route("/users").get(protectRoute, getUsersForSidebar);
router.route("/:id").get(protectRoute, getMessages);
router.route("/send/:id").post(protectRoute, sendMessage);
router
  .route("/delete-messages-history/:id")
  .delete(protectRoute, deleteMessagesHistory);

// export
export default router;
