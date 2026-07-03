import axios from "axios";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import providers from "../config/oauthProviders.js";
import { createState, verifyState } from "../utils/oauthState.js";
import { encrypt } from "../utils/encrypt.js";
import SocialAccount from "../models/SocialAccount.js";

const base64url = (buf) =>
  buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

// @route  GET /api/social/connect/:platform?token=<jwt>
// The frontend does a full page redirect here (window.location.href), so the
// user's JWT is passed as a query param instead of an Authorization header.
// We verify it, then send the user to the platform's consent screen.
export const startOAuth = (req, res) => {
  const { platform } = req.params;
  const { token } = req.query;
  const provider = providers[platform];

  if (!provider) return res.status(400).send("Unsupported platform");
  if (!provider.clientId) {
    return res
      .status(500)
      .send(`${platform} isn't configured yet — add its client id/secret to the backend .env file.`);
  }

  let userId;
  try {
    userId = jwt.verify(token, process.env.JWT_SECRET).id;
  } catch {
    return res.status(401).send("Your session expired — please log in again and retry.");
  }

  const statePayload = { userId, platform };

  let codeVerifier;
  if (provider.pkce) {
    codeVerifier = base64url(crypto.randomBytes(32));
    statePayload.codeVerifier = codeVerifier;
  }

  const state = createState(statePayload);

  const params = new URLSearchParams({
    client_id: provider.clientId,
    redirect_uri: provider.redirectUri,
    response_type: "code",
    scope: provider.scope,
    state,
  });

  if (provider.pkce) {
    const codeChallenge = base64url(crypto.createHash("sha256").update(codeVerifier).digest());
    params.set("code_challenge", codeChallenge);
    params.set("code_challenge_method", "S256");
  }

  res.redirect(`${provider.authUrl}?${params.toString()}`);
};

// Exchanges the authorization code for an access token.
const exchangeCode = async (platform, code, codeVerifier) => {
  const provider = providers[platform];

  const body = {
    grant_type: "authorization_code",
    code,
    redirect_uri: provider.redirectUri,
    client_id: provider.clientId,
    client_secret: provider.clientSecret,
  };
  if (codeVerifier) body.code_verifier = codeVerifier;

  const { data } = await axios.post(provider.tokenUrl, new URLSearchParams(body).toString(), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return data; // { access_token, refresh_token?, expires_in, ... }
};

const saveAccount = async ({ userId, platform, accountId, accountName, accessToken, refreshToken, expiresIn, meta }) => {
  return SocialAccount.findOneAndUpdate(
    { user: userId, platform, accountId },
    {
      accountName,
      accessToken: encrypt(accessToken),
      refreshToken: refreshToken ? encrypt(refreshToken) : undefined,
      tokenExpiresAt: expiresIn ? new Date(Date.now() + expiresIn * 1000) : undefined,
      meta: meta || {},
      connected: true,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

// @route  GET /api/social/callback/:platform
export const oauthCallback = async (req, res) => {
  const { platform } = req.params;
  const { code, state, error, error_description } = req.query;
  const frontend = process.env.CLIENT_URL;

  if (error) {
    return res.redirect(`${frontend}/accounts?error=${encodeURIComponent(error_description || error)}`);
  }

  let decoded;
  try {
    decoded = verifyState(state);
  } catch {
    return res.redirect(`${frontend}/accounts?error=Invalid or expired connection attempt`);
  }
  const { userId, codeVerifier } = decoded;

  try {
    const tokenData = await exchangeCode(platform, code, codeVerifier);
    const accessToken = tokenData.access_token;

    if (platform === "facebook") {
      // Pull the user's Pages; each Page has its own long-lived-ish access token
      // used to publish. We also check for a linked Instagram Business account.
      const { data: pages } = await axios.get("https://graph.facebook.com/v19.0/me/accounts", {
        params: { access_token: accessToken },
      });

      for (const page of pages.data || []) {
        await saveAccount({
          userId,
          platform: "facebook",
          accountId: page.id,
          accountName: page.name,
          accessToken: page.access_token,
          meta: { pageId: page.id },
        });

        try {
          const { data: igData } = await axios.get(`https://graph.facebook.com/v19.0/${page.id}`, {
            params: { fields: "instagram_business_account", access_token: page.access_token },
          });
          const igUserId = igData.instagram_business_account?.id;
          if (igUserId) {
            const { data: igProfile } = await axios.get(`https://graph.facebook.com/v19.0/${igUserId}`, {
              params: { fields: "username", access_token: page.access_token },
            });
            await saveAccount({
              userId,
              platform: "instagram",
              accountId: igUserId,
              accountName: `@${igProfile.username}`,
              accessToken: page.access_token,
              meta: { igUserId, pageId: page.id },
            });
          }
        } catch {
          // No linked Instagram account on this Page — fine, just skip it.
        }
      }
    } else if (platform === "linkedin") {
      const { data: profile } = await axios.get("https://api.linkedin.com/v2/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      await saveAccount({
        userId,
        platform: "linkedin",
        accountId: profile.sub,
        accountName: profile.name,
        accessToken,
        refreshToken: tokenData.refresh_token,
        expiresIn: tokenData.expires_in,
        meta: { urn: `urn:li:person:${profile.sub}` },
      });
    } else if (platform === "pinterest") {
      const { data: profile } = await axios.get("https://api.pinterest.com/v5/user_account", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { data: boards } = await axios.get("https://api.pinterest.com/v5/boards", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      await saveAccount({
        userId,
        platform: "pinterest",
        accountId: profile.username,
        accountName: profile.username,
        accessToken,
        refreshToken: tokenData.refresh_token,
        expiresIn: tokenData.expires_in,
        meta: { boardId: boards.items?.[0]?.id },
      });
    } else if (platform === "x") {
      const { data: profile } = await axios.get("https://api.twitter.com/2/users/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      await saveAccount({
        userId,
        platform: "x",
        accountId: profile.data.id,
        accountName: `@${profile.data.username}`,
        accessToken,
        refreshToken: tokenData.refresh_token,
        expiresIn: tokenData.expires_in,
      });
    }

    res.redirect(`${frontend}/accounts?connected=${platform}`);
  } catch (err) {
    console.error(`OAuth callback failed for ${platform}:`, err.response?.data || err.message);
    res.redirect(`${frontend}/accounts?error=${encodeURIComponent("Connection failed — please try again")}`);
  }
};
