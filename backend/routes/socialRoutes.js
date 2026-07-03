import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getSocialAccounts,
  saveSocialAccount,
  disconnectSocialAccount,
} from "../controllers/socialAccountController.js";
import { startOAuth, oauthCallback } from "../controllers/oauthController.js";

const router = express.Router();

// Public: these are hit via full browser redirects (not fetch/axios calls),
// so they can't carry an Authorization header. startOAuth reads the JWT
// from a query param instead; oauthCallback identifies the user from the
// signed "state" param it receives back from the platform.
router.get("/connect/:platform", startOAuth);
router.get("/callback/:platform", oauthCallback);

router.use(protect);
router.get("/", getSocialAccounts);
router.post("/connect", saveSocialAccount); // manual/legacy path, kept for testing without real OAuth
router.delete("/:id", disconnectSocialAccount);

export default router;
