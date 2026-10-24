const Issue = require('../models/Issue');

// @desc    Create a new issue ticket
// @route   POST /api/issues
// @access  Private
const createIssue = async (req, res, next) => {
  try {
    const { title, category, location, priority, description } = req.body;

    if (!title || !category || !location || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, category, location, and description',
      });
    }

    const issue = await Issue.create({
      title,
      category,
      location,
      priority: priority || 'Medium',
      description,
      reportedBy: req.user._id,
    });

    const populatedIssue = await Issue.findById(issue._id).populate(
      'reportedBy',
      'name email department role'
    );

    res.status(201).json({
      success: true,
      message: 'Maintenance ticket submitted successfully',
      issue: populatedIssue,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all issues (supports search, category and status filtering)
// @route   GET /api/issues
// @access  Private
const getIssues = async (req, res, next) => {
  try {
    const { category, status, search } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const issues = await Issue.find(filter)
      .populate('reportedBy', 'name email department role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: issues.length,
      issues,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get issues submitted by the logged-in user
// @route   GET /api/issues/my
// @access  Private
const getMyIssues = async (req, res, next) => {
  try {
    const issues = await Issue.find({ reportedBy: req.user._id })
      .populate('reportedBy', 'name email department')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: issues.length,
      issues,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single issue by ID
// @route   GET /api/issues/:id
// @access  Private
const getIssueById = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id).populate(
      'reportedBy',
      'name email department role'
    );

    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    res.status(200).json({
      success: true,
      issue,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update issue status & admin remarks
// @route   PUT /api/issues/:id/status
// @access  Private (Admin only)
const updateIssueStatus = async (req, res, next) => {
  try {
    const { status, adminRemarks } = req.body;

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    if (status) {
      issue.status = status;
    }
    if (adminRemarks !== undefined) {
      issue.adminRemarks = adminRemarks;
    }

    await issue.save();

    const updatedIssue = await Issue.findById(issue._id).populate(
      'reportedBy',
      'name email department role'
    );

    res.status(200).json({
      success: true,
      message: 'Issue status updated successfully',
      issue: updatedIssue,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upvote / Remove upvote on an issue
// @route   PUT /api/issues/:id/upvote
// @access  Private
const toggleUpvote = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    const userIdStr = req.user._id.toString();
    const alreadyUpvoted = issue.upvotes.some(
      (id) => id.toString() === userIdStr
    );

    if (alreadyUpvoted) {
      // Remove upvote
      issue.upvotes = issue.upvotes.filter((id) => id.toString() !== userIdStr);
    } else {
      // Add upvote
      issue.upvotes.push(req.user._id);
    }

    await issue.save();

    res.status(200).json({
      success: true,
      upvoted: !alreadyUpvoted,
      upvoteCount: issue.upvotes.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an issue
// @route   DELETE /api/issues/:id
// @access  Private
const deleteIssue = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    // Check ownership: only admin or original reporter can delete
    const isOwner = issue.reportedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this issue',
      });
    }

    await Issue.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Maintenance ticket removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createIssue,
  getIssues,
  getMyIssues,
  getIssueById,
  updateIssueStatus,
  toggleUpvote,
  deleteIssue,
};
