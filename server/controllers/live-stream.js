const asyncHandler = require("express-async-handler");
const {
  getAllLiveStream,
  createLiveStreamData,
  updateLiveStreamData,
  deleteLiveStreamData,
} = require("../models/live-stream");

module.exports = {
  getAllLiveStream: asyncHandler(async (req, res) => {
    const liveStreamList = await getAllLiveStream();
    res.send({ success: true, payload: liveStreamList });
  }),

  createNewLiveStream: asyncHandler(async (req, res) => {
    const { liveStreamData } = req.body;
    const { videoTitle, videoDescription, videoLink } = liveStreamData;
    const createRes = await createLiveStreamData(
      videoTitle,
      videoDescription,
      videoLink
    );
    res.send({ success: createRes });
  }),

  updateLiveStreamData: asyncHandler(async (req, res) => {
    const { liveStreamData } = req.body;
    const { liveStreamId } = req.params;
    const { videoTitle, videoDescription, videoLink } = liveStreamData;

    const updateRes = await updateLiveStreamData(
      videoTitle,
      videoDescription,
      videoLink,
      liveStreamId
    );
    res.send({ success: updateRes });
  }),

  deleteLiveStreamData: asyncHandler(async (req, res) => {
    const { liveStreamId } = req.params;
    const deleteRes = await deleteLiveStreamData(liveStreamId);
    res.send({ success: deleteRes });
  }),
};
