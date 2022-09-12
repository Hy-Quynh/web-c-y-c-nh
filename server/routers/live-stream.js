const express =  require('express');
const liveStream = require('../controllers/live-stream');
const router = express.Router();

router.get('/', liveStream.getAllLiveStream);
router.post('/', liveStream.createNewLiveStream);
router.put('/:liveStreamId', liveStream.updateLiveStreamData);
router.delete('/:liveStreamId', liveStream.deleteLiveStreamData);

module.exports = router;
