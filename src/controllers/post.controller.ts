import { Request, Response } from "express";
import Post from "../models/Post";

export const createPost = async (req: Request, res: Response) => {
  try {
    const { description, image } = req.body;

    if (!description && !image) {
      return res.status(400).json({
        message: "Post must contain description or image",
      });
    }

    const post = await Post.create({
      userId: (req as any).user.id,
      description,
      image,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find()
      .populate("userId", "firstName lastName email profilePicture")
      .sort({
        createdAt: -1,
      });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "userId",
      "firstName lastName email",
    );

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const updatePost = async (req: Request, res: Response) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  if (post.userId.toString() !== (req as any).user.id) {
    return res.status(403).json({
      message: "Unauthorized",
    });
  }

  post.description = req.body.description || post.description;

  await post.save();

  res.json(post);
};

export const getUserPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find({
      userId: req.params.userId,
    });

    res.json(posts);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deletePost = async (req: Request, res: Response) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  if (post.userId.toString() !== (req as any).user.id) {
    return res.status(403).json({
      message: "Unauthorized",
    });
  }

  await post.deleteOne();

  res.json({
    message: "Post deleted",
  });
};

export const likePost = async (req: Request, res: Response) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const userId = (req as any).user.id;

  const alreadyLiked = post.likes.some((id: any) => id.toString() === userId);

  if (alreadyLiked) {
    return res.status(400).json({
      message: "Already liked",
    });
  }

  post.likes.push(userId);
  await post.save();

  res.json(post);
};

export const unlikePost = async (req: Request, res: Response) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const userId = (req as any).user.id;

  post.likes = post.likes.filter((id) => id.toString() !== userId);

  await post.save();

  res.json(post);
};

export const addComment = async (req: Request, res: Response) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  post.comments.push({
    userId: (req as any).user.id,
    content: req.body.content,
  });

  await post.save();

  res.json(post);
};

export const deleteComment = async (req: Request, res: Response) => {
  const post = await Post.findById(req.params.postId);

  if (!post) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  const filteredComments = post.comments.filter(
    (comment: any) => comment._id.toString() !== req.params.commentId,
  );

  (post as any).comments = filteredComments;
};
