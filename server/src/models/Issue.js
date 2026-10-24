const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an issue title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please select an issue category'],
      enum: ['IT & Lab', 'Electrical', 'Plumbing', 'Furniture', 'Cleanliness', 'Other'],
    },
    location: {
      type: String,
      required: [true, 'Please specify the campus location (e.g., CS Lab 2, Library 1st Floor)'],
      trim: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed description of the problem'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved'],
      default: 'Pending',
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    adminRemarks: {
      type: String,
      default: '',
      trim: true,
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Issue', issueSchema);
