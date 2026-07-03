import SocialAccount from "../models/SocialAccount.js";
import { encrypt } from "../utils/encrypt.js";

// @route  GET /api/social
// Lists the platforms the current user has connected.
export const getSocialAccounts = async (req, res, next) => {
  try {
    const accounts = await SocialAccount.find({ user: req.user._id }).select(
      "-accessToken -refreshToken"
    );
    res.json(accounts);
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/social/connect
// In a real OAuth flow this is called by your callback route after the
// platform redirects back with a code you've exchanged for a token.
// This endpoint just persists the result of that exchange.
export const saveSocialAccount = async (req, res, next) => {
  try {
    const { platform, accountName, accountId, accessToken, refreshToken, tokenExpiresAt, meta } = req.body;

    const account = await SocialAccount.findOneAndUpdate(
      { user: req.user._id, platform, accountId },
      {
        accountName,
        accessToken: encrypt(accessToken),
        refreshToken: refreshToken ? encrypt(refreshToken) : undefined,
        tokenExpiresAt,
        meta,
        connected: true,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(account);
  } catch (err) {
    next(err);
  }
};

// @route  DELETE /api/social/:id
export const disconnectSocialAccount = async (req, res, next) => {
  try {
    const account = await SocialAccount.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!account) return res.status(404).json({ message: "Account not found" });
    res.json({ message: "Account disconnected" });
  } catch (err) {
    next(err);
  }
};
