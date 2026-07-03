import axios from "axios";

// Posts a tweet using the X API v2. Requires OAuth 2.0 user context token
// with "tweet.write" scope.
// Docs: https://developer.x.com/en/docs/x-api/tweets/manage-tweets/api-reference/post-tweets
const publish = async (post, account) => {
  const { data } = await axios.post(
    "https://api.x.com/2/tweets",
    { text: post.content },
    { headers: { Authorization: `Bearer ${account.accessToken}` } }
  );
  return { remoteId: data.data.id };
};

export default { publish };
