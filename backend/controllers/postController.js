import Post from "../models/Post.js";
import { publishPost } from "../services/publishPost.js";

// @route  GET /api/posts
export const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/posts
// body: { content, mediaUrls, platforms, scheduledFor (optional) }
export const createPost = async (req, res, next) => {
  try {
    const { content, mediaUrls = [], platforms = [], scheduledFor } = req.body;

    if (!content || !platforms.length) {
      return res.status(400).json({ message: "Content and at least one platform are required" });
    }

    const post = await Post.create({
      user: req.user._id,
      content,
      mediaUrls,
      platforms,
      scheduledFor: scheduledFor || null,
      status: scheduledFor ? "scheduled" : "draft",
    });

    // "Publish now" — no scheduledFor provided means send immediately.
    if (!scheduledFor) {
      const published = await publishPost(post._id);
      return res.status(201).json(published);
    }

    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

// @route  PATCH /api/posts/:id
export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, user: req.user._id });
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.status === "published") {
      return res.status(400).json({ message: "Published posts can't be edited" });
    }

    const { content, mediaUrls, platforms, scheduledFor } = req.body;
    if (content !== undefined) post.content = content;
    if (mediaUrls !== undefined) post.mediaUrls = mediaUrls;
    if (platforms !== undefined) post.platforms = platforms;
    if (scheduledFor !== undefined) {
      post.scheduledFor = scheduledFor;
      post.status = scheduledFor ? "scheduled" : "draft";
    }

    await post.save();
    res.json(post);
  } catch (err) {
    next(err);
  }
};

// @route  DELETE /api/posts/:id
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json({ message: "Post deleted" });
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/posts/:id/publish-now
export const publishNow = async (req, res, next) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, user: req.user._id });
    if (!post) return res.status(404).json({ message: "Post not found" });

    const published = await publishPost(post._id);
    res.json(published);
  } catch (err) {
    next(err);
  }
};
