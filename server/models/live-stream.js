const { postgresql } = require("../config/connect");

module.exports = {
  getAllLiveStream: async () => {
    try {
      const liveData = await postgresql.query(`SELECT * FROM live_stream ORDER BY video_id DESC`);
      if (liveData?.rows) {
        return liveData?.rows;
      }
      return [];
    } catch (error) {
      console.log("getAllLiveStream error >>>> ", error);
      return [];
    }
  },

  createLiveStreamData: async (videoTitle, videoDescription, videoLink) => {
    try {
      const createRes = await postgresql.query(
        `INSERT INTO live_stream(video_title, video_description, video_link, created_day) VALUES('${videoTitle}', '${videoDescription}', '${videoLink}', Now())`
      );
      if (createRes?.rows) {
        return true;
      }
      return false;
    } catch (error) {
      console.log("createLiveStreamData error >>>> ", error);
      return false;
    }
  },

  updateLiveStreamData: async (videoTitle, videoDescription, videoLink, liveStreamId) => {
    try {
      const updateRes = await postgresql.query(
        `UPDATE live_stream SET video_title='${videoTitle}', video_description='${videoDescription}', video_link='${videoLink}' WHERE video_id=${Number(
          liveStreamId
        )}`
      );
      if (updateRes?.rows) {
        return true;
      }
      return false;
    } catch (error) {
      console.log("updateLiveStreamData error >>>> ", error);
      return false;
    }
  },

  deleteLiveStreamData: async (liveStreamId) => {
    try {
      const deleteRes = await postgresql.query(
        `DELETE FROM live_stream WHERE video_id=${Number(liveStreamId)}`
      );
      if (deleteRes?.rows) {
        return true;
      }
      return false;
    } catch (error) {
      console.log("deleteLiveStreamData error >>>> ", error);
      return false;
    }
  },
};
