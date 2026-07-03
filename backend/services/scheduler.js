import cron from "node-cron";
import Post from "../models/Post.js";
import { publishPost } from "./publishPost.js";

// Runs every minute, looks for scheduled posts whose time has come, and publishes them.
export const startScheduler = () => {
  cron.schedule("* * * * *", async () => {
    const due = await Post.find({
      status: "scheduled",
      scheduledFor: { $lte: new Date() },
    });

    for (const post of due) {
      publishPost(post._id).catch((err) =>
        console.error(`Failed to publish scheduled post ${post._id}:`, err.message)
      );
    }
  });

  console.log("Scheduler started — checking for due posts every minute");
};
