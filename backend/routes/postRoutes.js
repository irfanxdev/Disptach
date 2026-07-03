import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  publishNow,
} from "../controllers/postController.js";

const router = express.Router();

router.use(protect);
router.route("/").get(getPosts).post(createPost);
router.route("/:id").patch(updatePost).delete(deletePost);
router.post("/:id/publish-now", publishNow);

export default router;
