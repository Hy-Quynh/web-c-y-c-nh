const asyncHandler = require("express-async-handler");
const {
  getAllPost,
  getPostInfo,
  createNewPost,
  deletePostInfo,
  updatePostData,
  getReviewByPost,
  createBlogReview,
  getUserBlogFavourite,
  changeUserFavouriteBlog,
  getTotalPost,
  getAllRelativePost,
  changeBlogView,
} = require("../models/post");

module.exports = {
  getAllPost: asyncHandler(async (req, res) => {
    const { limit, offset, search } = req.query;
    const postList = await getAllPost(limit, offset, search);
    const totalPost = await getTotalPost(search);
    res.send({ success: true, payload: { post: postList, total: totalPost } });
  }),

  getPostById: asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const postInfo = await getPostInfo(postId);
    res.send({ success: true, payload: postInfo });
  }),

  createNewPost: asyncHandler(async (req, res) => {
    const { title, desc, image } = req.body;
    const createRes = await createNewPost(title, desc, image);
    res.send({ success: createRes });
  }),

  deletePostInfo: asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const deleteRes = await deletePostInfo(postId);
    res.send({ success: deleteRes });
  }),

  updatePostData: asyncHandler(async (req, res) => {
    const { title, desc, image } = req.body;
    const { postId } = req.params;
    const updateRes = await updatePostData(title, desc, image, postId);
    res.send({ success: updateRes });
  }),

  getReviewByPost: asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { limit, offset } = req.query;
    const postList = await getReviewByPost(postId, limit, offset);
    res.send({ success: true, payload: postList });
  }),

  getAllReview: asyncHandler(async (req, res) => {}),

  createNewPostReview: asyncHandler(async (req, res) => {
    const { user_id, review, blog_id } = req.body;
    const createRes = await createBlogReview(user_id, review, blog_id, 1);
    res.send({ success: createRes });
  }),

  getUserBlogFavourite: asyncHandler(async (req, res) => {
    const { userId, blogId } = req.query;
    const favouriteRes = await getUserBlogFavourite(userId, blogId);
    res.send({ success: true, payload: favouriteRes });
  }),

  changeUserFavouriteBlog: asyncHandler(async (req, res) => {
    const { userId, blogId } = req.query;
    const { status } = req.body;
    const changeRes = await changeUserFavouriteBlog(userId, blogId, status);
    res.send({ success: changeRes });
  }),

  getAllRelativePost: asyncHandler(async (req, res) => {
    const {limit, offset, existPost} = req?.query;
    const response = await getAllRelativePost(limit, offset, existPost)
    res.send({ success: true, payload: response});
  }),

  changeBlogView: asyncHandler(async (req, res) => {
    const {view} = req?.body
    const {postId} = req?.params
    const response = await changeBlogView(postId, view)
    res.send({success: response})
  })
};
