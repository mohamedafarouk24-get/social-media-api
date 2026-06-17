import express from "express";

import {
  createPost,
  getAllPosts,
  getPostById,
  getUserPosts,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  deleteComment,
} from "../controllers/post.controller";

import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", authMiddleware, createPost);

router.get("/", getAllPosts);

router.get("/user/:userId", getUserPosts);

router.get("/:id", getPostById);

router.put("/:id", authMiddleware, updatePost);

router.delete("/:id", authMiddleware, deletePost);

router.post("/:id/like", authMiddleware, likePost);

router.delete("/:id/unlike", authMiddleware, unlikePost);
router.post("/:id/comments", authMiddleware, addComment);

router.delete("/:postId/comments/:commentId", authMiddleware, deleteComment);

export default router;
