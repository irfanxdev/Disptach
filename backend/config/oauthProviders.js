// One config block per platform: where to send the user, where to exchange
// the code for a token, and what permissions to request. Fill in the client
// id/secret once you've registered a developer app with each platform.
const providers = {
  facebook: {
    authUrl: "https://www.facebook.com/v19.0/dialog/oauth",
    tokenUrl: "https://graph.facebook.com/v19.0/oauth/access_token",
    clientId: process.env.META_APP_ID,
    clientSecret: process.env.META_APP_SECRET,
    redirectUri: process.env.META_REDIRECT_URI,
    // pages_manage_posts + instagram scopes let one login cover both
    // the Facebook Page and its linked Instagram Business account.
    scope: "pages_show_list,pages_manage_posts,pages_read_engagement,instagram_basic,instagram_content_publish",
  },
  linkedin: {
    authUrl: "https://www.linkedin.com/oauth/v2/authorization",
    tokenUrl: "https://www.linkedin.com/oauth/v2/accessToken",
    clientId: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    redirectUri: process.env.LINKEDIN_REDIRECT_URI,
    scope: "openid profile w_member_social",
  },
  pinterest: {
    authUrl: "https://www.pinterest.com/oauth/",
    tokenUrl: "https://api.pinterest.com/v5/oauth/token",
    clientId: process.env.PINTEREST_CLIENT_ID,
    clientSecret: process.env.PINTEREST_CLIENT_SECRET,
    redirectUri: process.env.PINTEREST_REDIRECT_URI,
    scope: "boards:read,pins:write,user_accounts:read",
  },
  x: {
    authUrl: "https://twitter.com/i/oauth2/authorize",
    tokenUrl: "https://api.twitter.com/2/oauth2/token",
    clientId: process.env.X_CLIENT_ID,
    clientSecret: process.env.X_CLIENT_SECRET,
    redirectUri: process.env.X_REDIRECT_URI,
    scope: "tweet.read tweet.write users.read offline.access",
    pkce: true, // X requires PKCE on top of the standard authorization code flow
  },
};

export default providers;
