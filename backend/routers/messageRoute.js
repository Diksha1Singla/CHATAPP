import express from "express"
import { protectRoute } from "../middleware/authMiddleWare.js"
import {getUsersForSidebar, getMessages,sendMessages} from "../controllers/messageController.js"
const router = express.Router()

router.get("/users",protectRoute,getUsersForSidebar);
router.get("/:id",protectRoute,getMessages);
router.post("/send/:id",protectRoute,sendMessages);

export default router;