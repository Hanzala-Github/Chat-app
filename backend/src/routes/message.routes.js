import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";

import {
  getMessages,
  getUsersForSidebar,
  sendMessage,
  deleteMessagesHistory,
  deleteMessageForMe,
  deleteMessageForEveryOne,
} from "../controllers/message.controller.js";

const router = Router();

router.route("/users").get(protectRoute, getUsersForSidebar);
router.route("/:id").get(protectRoute, getMessages);
router.route("/send/:id").post(protectRoute, sendMessage);
router
  .route("/delete-messages-history/:id")
  .delete(protectRoute, deleteMessagesHistory);
router
  .route("/delete-message-forme/:messageId")
  .delete(protectRoute, deleteMessageForMe);
router
  .route("/delete-message-foreveryone/:messageId")
  .delete(protectRoute, deleteMessageForEveryOne);
// export
export default router;
