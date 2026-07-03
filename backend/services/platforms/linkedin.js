import axios from "axios";

// Publishes a text post to LinkedIn using the UGC Posts API.
// Docs: https://learn.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/ugc-post-api
const publish = async (post, account) => {
  const authorUrn = account.meta?.urn; // e.g. urn:li:person:xxxx or urn:li:organization:xxxx

  const body = {
    author: authorUrn,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: { text: post.content },
        shareMediaCategory: post.mediaUrls?.length ? "IMAGE" : "NONE",
      },
    },
    visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
  };

  const { data, headers } = await axios.post(
    "https://api.linkedin.com/v2/ugcPosts",
    body,
    {
      headers: {
        Authorization: `Bearer ${account.accessToken}`,
        "X-Restli-Protocol-Version": "2.0.0",
      },
    }
  );

  return { remoteId: headers["x-restli-id"] || data.id };
};

export default { publish };
