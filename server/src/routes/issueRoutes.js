const express = require('express');
const router = express.Router();
const {
  createIssue,
  getIssues,
  getMyIssues,
  getIssueById,
  updateIssueStatus,
  toggleUpvote,
  deleteIssue,
} = require('../controllers/issueController');
const { protect, authorize } = require('../middleware/auth');

// All issue routes require authentication
router.use(protect);

router.route('/')
  .get(getIssues)
  .post(createIssue);

router.get('/my', getMyIssues);

router.route('/:id')
  .get(getIssueById)
  .delete(deleteIssue);

router.put('/:id/status', authorize('admin'), updateIssueStatus);
router.put('/:id/upvote', toggleUpvote);

module.exports = router;
