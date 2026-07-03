import mongoose from "mongoose";

const platformResultSchema = new mongoose.Schema(
  {
    platform: { type: String, required: true },
    status: { type: String, enum: ["pending", "published", "failed"], default: "pending" },
    remoteId: { type: String },
    error: { type: String },
    publishedAt: { type: Date },
  },
  { _id: false }
);

const postSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, trim: true },
    mediaUrls: [{ type: String }],
    platforms: [{ type: String, enum: ["instagram", "facebook", "x", "linkedin", "pinterest"] }],
    status: {
      type: String,
      enum: ["draft", "scheduled", "publishing", "published", "failed"],
      default: "draft",
    },
    scheduledFor: { type: Date },
    results: [platformResultSchema],
  },
  { timestamps: true }
);

postSchema.index({ status: 1, scheduledFor: 1 });

export default mongoose.model("Post", postSchema);
