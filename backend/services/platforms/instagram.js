import axios from "axios";

// Instagram publishing goes through the Instagram Graph API and is a two-step
// process: create a media container, then publish it. Requires a Business/Creator
// account linked to a Facebook Page.
// Docs: https://developers.facebook.com/docs/instagram-api/guides/content-publishing
const publish = async (post, account) => {
  const igUserId = account.meta?.igUserId;
  if (!post.mediaUrls?.length) {
    throw new Error("Instagram requires at least one image or video URL");
  }

  const containerRes = await axios.post(
    `https://graph.facebook.com/v19.0/${igUserId}/media`,
    {
      image_url: post.mediaUrls[0],
      caption: post.content,
      access_token: account.accessToken,
    }
  );

  const creationId = containerRes.data.id;

  const publishRes = await axios.post(
    `https://graph.facebook.com/v19.0/${igUserId}/media_publish`,
    {
      creation_id: creationId,
      access_token: account.accessToken,
    }
  );

  return { remoteId: publishRes.data.id };
};

export default { publish };
