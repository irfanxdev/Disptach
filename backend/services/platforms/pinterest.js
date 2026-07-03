import axios from "axios";

// Creates a Pin on a given board.
// Docs: https://developers.pinterest.com/docs/api/v5/#operation/pins/create
const publish = async (post, account) => {
  const boardId = account.meta?.boardId;
  if (!post.mediaUrls?.length) {
    throw new Error("Pinterest requires an image URL");
  }

  const { data } = await axios.post(
    "https://api.pinterest.com/v5/pins",
    {
      board_id: boardId,
      description: post.content,
      media_source: { source_type: "image_url", url: post.mediaUrls[0] },
    },
    { headers: { Authorization: `Bearer ${account.accessToken}` } }
  );

  return { remoteId: data.id };
};

export default { publish };
