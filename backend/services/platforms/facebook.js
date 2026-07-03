import axios from "axios";

// Publishes a text+media post to a Facebook Page using the Graph API.
// Requires: SocialAccount.accessToken = Page Access Token, meta.pageId = the Page's id.
// Docs: https://developers.facebook.com/docs/pages/publishing
const publish = async (post, account) => {
  const pageId = account.meta?.pageId;
  const url = `https://graph.facebook.com/v19.0/${pageId}/feed`;

  const params = {
    message: post.content,
    access_token: account.accessToken,
  };

  if (post.mediaUrls?.length) {
    // For a single photo, Facebook prefers /photos with a "url" pointing at a public image.
    const photoUrl = `https://graph.facebook.com/v19.0/${pageId}/photos`;
    const { data } = await axios.post(photoUrl, {
      url: post.mediaUrls[0],
      caption: post.content,
      access_token: account.accessToken,
    });
    return { remoteId: data.post_id || data.id };
  }

  const { data } = await axios.post(url, params);
  return { remoteId: data.id };
};

export default { publish };
