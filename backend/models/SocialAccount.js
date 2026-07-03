import mongoose from "mongoose";

// One document per connected platform account per user.
const socialAccountSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    platform: {
      type: String,
      enum: ["instagram", "facebook", "x", "linkedin", "pinterest"],
      required: true,
    },
    accountName: { type: String, required: true },
    accountId: { type: String, required: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String },
    tokenExpiresAt: { type: Date },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
    connected: { type: Boolean, default: true },
  },
  { timestamps: true }
);

socialAccountSchema.index({ user: 1, platform: 1, accountId: 1 }, { unique: true });

export default mongoose.model("SocialAccount", socialAccountSchema);
