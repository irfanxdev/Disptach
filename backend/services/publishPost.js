import Post from "../models/Post.js";
import SocialAccount from "../models/SocialAccount.js";
import adapters from "./platforms/index.js";
import { decrypt } from "../utils/encrypt.js";

// Publishes a single post to every platform it targets, and records
// a per-platform result on the Post document. Used by both the
// "publish now" flow and the scheduler.
export const publishPost = async (postId) => {
  const post = await Post.findById(postId);
  if (!post) throw new Error("Post not found");

  post.status = "publishing";
  await post.save();

  const results = [];

  for (const platform of post.platforms) {
    try {
      const account = await SocialAccount.findOne({
        user: post.user,
        platform,
        connected: true,
      });

      if (!account) {
        results.push({ platform, status: "failed", error: "No connected account for this platform" });
        continue;
      }

      const adapter = adapters[platform];
      if (!adapter) {
        results.push({ platform, status: "failed", error: "Unsupported platform" });
        continue;
      }

      const decryptedAccount = { ...account.toObject(), accessToken: decrypt(account.accessToken) };
      const { remoteId } = await adapter.publish(post, decryptedAccount);

      results.push({ platform, status: "published", remoteId, publishedAt: new Date() });
    } catch (err) {
      results.push({ platform, status: "failed", error: err.message });
    }
  }

  post.results = results;
  post.status = results.every((r) => r.status === "published") ? "published" : "failed";
  await post.save();

  return post;
};
