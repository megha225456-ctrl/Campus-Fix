import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge, PriorityBadge } from '../components/Badges';
import { LoadingState, EmptyState, ErrorAlert } from '../components/StateFeedback';
import {
  Search,
  Filter,
  MapPin,
  ThumbsUp,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  PlusCircle,
  MessageSquare,
  Building,
} from 'lucide-react';

const CATEGORIES = ['All', 'IT & Lab', 'Electrical', 'Plumbing', 'Furniture', 'Cleanliness', 'Other'];
const STATUSES = ['All', 'Pending', 'In Progress', 'Resolved'];

export const Dashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Admin edit state tracking per issue
  const [editingIssueId, setEditingIssueId] = useState(null);
  const [adminStatus, setAdminStatus] = useState('');
  const [adminRemarks, setAdminRemarks] = useState('');
  const [updating, setUpdating] = useState(false);

  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const fetchIssues = async () => {
    try {
      setLoading(true);
      setError('');

      const queryParams = new URLSearchParams();
      if (selectedCategory !== 'All') queryParams.append('category', selectedCategory);
      if (selectedStatus !== 'All') queryParams.append('status', selectedStatus);
      if (search.trim()) queryParams.append('search', search.trim());

      const url = `/issues?${queryParams.toString()}`;
      const data = await apiRequest(url);

      if (data.success) {
        setIssues(data.issues);
      }
    } catch (err) {
      setError(err.message || 'Unable to load campus tickets. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [selectedCategory, selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchIssues();
  };

  const handleUpvote = async (issueId) => {
    try {
      const data = await apiRequest(`/issues/${issueId}/upvote`, { method: 'PUT' });
      if (data.success) {
        setIssues((prev) =>
          prev.map((iss) => {
            if (iss._id === issueId) {
              const userIdStr = user?._id?.toString();
              const alreadyUpvoted = iss.upvotes?.some((id) => (id._id || id).toString() === userIdStr);
              const updatedUpvotes = alreadyUpvoted
                ? iss.upvotes.filter((id) => (id._id || id).toString() !== userIdStr)
                : [...(iss.upvotes || []), user._id];
              return { ...iss, upvotes: updatedUpvotes };
            }
            return iss;
          })
        );
      }
    } catch (err) {
      alert(err.message || 'Failed to update upvote');
    }
  };

  const handleDelete = async (issueId) => {
    if (!window.confirm('Are you sure you want to delete this maintenance ticket?')) return;
    try {
      await apiRequest(`/issues/${issueId}`, { method: 'DELETE' });
      setIssues((prev) => prev.filter((iss) => iss._id !== issueId));
    } catch (err) {
      alert(err.message || 'Failed to delete issue');
    }
  };

  const handleStartStatusEdit = (issue) => {
    setEditingIssueId(issue._id);
    setAdminStatus(issue.status);
    setAdminRemarks(issue.adminRemarks || '');
  };

  const handleSaveStatus = async (issueId) => {
    try {
      setUpdating(true);
      const data = await apiRequest(`/issues/${issueId}/status`, {
        method: 'PUT',
        body: { status: adminStatus, adminRemarks },
      });

      if (data.success) {
        setIssues((prev) =>
          prev.map((iss) => (iss._id === issueId ? data.issue : iss))
        );
        setEditingIssueId(null);
      }
    } catch (err) {
      alert(err.message || 'Failed to update ticket status');
    } finally {
      setUpdating(false);
    }
  };

  // Metrics summary
  const totalCount = issues.length;
  const pendingCount = issues.filter((i) => i.status === 'Pending').length;
  const progressCount = issues.filter((i) => i.status === 'In Progress').length;
  const resolvedCount = issues.filter((i) => i.status === 'Resolved').length;

  return (
    <div className="page-container">
      {/* Top Header & Metrics */}
      <div className="dashboard-hero">
        <div className="hero-text">
          <h1>Campus Maintenance Feed</h1>
          <p>Real-time campus infrastructure monitoring & maintenance ticket resolution.</p>
        </div>

        <button className="btn btn-primary" onClick={() => navigate('/new-ticket')}>
          <PlusCircle size={18} />
          <span>Report New Issue</span>
        </button>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon metric-total"><Building size={24} /></div>
          <div className="metric-data">
            <span className="metric-value">{totalCount}</span>
            <span className="metric-label">Total Filtered</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon metric-pending"><Clock size={24} /></div>
          <div className="metric-data">
            <span className="metric-value">{pendingCount}</span>
            <span className="metric-label">Pending</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon metric-progress"><AlertTriangle size={24} /></div>
          <div className="metric-data">
            <span className="metric-value">{progressCount}</span>
            <span className="metric-label">In Progress</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon metric-resolved"><CheckCircle size={24} /></div>
          <div className="metric-data">
            <span className="metric-value">{resolvedCount}</span>
            <span className="metric-label">Resolved</span>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="filter-panel">
        <form onSubmit={handleSearchSubmit} className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by keywords, location or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-secondary btn-sm">
            Search
          </button>
        </form>

        <div className="filter-dropdowns">
          <div className="select-wrapper">
            <Filter size={14} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter by category"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  Category: {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="select-wrapper">
            <Filter size={14} />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              aria-label="Filter by status"
            >
              {STATUSES.map((st) => (
                <option key={st} value={st}>
                  Status: {st}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* State Rendering: Loading, Error, Empty, Success */}
      {loading ? (
        <LoadingState message="Fetching campus tickets from server..." />
      ) : error ? (
        <ErrorAlert message={error} onRetry={fetchIssues} />
      ) : issues.length === 0 ? (
        <EmptyState
          title="No campus maintenance issues found"
          message="No reports match your current filters. If you notice any fault on campus, submit a new ticket!"
          actionLabel="Report New Issue"
          onAction={() => navigate('/new-ticket')}
        />
      ) : (
        <div className="ticket-list">
          {issues.map((issue) => {
            const isReporter =
              user?._id?.toString() === (issue.reportedBy?._id || issue.reportedBy)?.toString();
            const hasUpvoted = issue.upvotes?.some(
              (id) => (id._id || id).toString() === user?._id?.toString()
            );

            return (
              <div key={issue._id} className="ticket-card">
                <div className="ticket-header">
                  <div className="ticket-badges">
                    <span className="category-chip">{issue.category}</span>
                    <PriorityBadge priority={issue.priority} />
                    <StatusBadge status={issue.status} />
                  </div>

                  <div className="ticket-actions-top">
                    {(isReporter || isAdmin) && (
                      <button
                        className="btn-icon danger"
                        onClick={() => handleDelete(issue._id)}
                        title="Delete Ticket"
                        aria-label="Delete Ticket"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="ticket-title">{issue.title}</h3>

                <div className="ticket-location">
                  <MapPin size={15} />
                  <span>{issue.location}</span>
                </div>

                <p className="ticket-desc">{issue.description}</p>

                {/* Admin Remarks Section (if provided) */}
                {issue.adminRemarks && (
                  <div className="remarks-box">
                    <div className="remarks-title">
                      <MessageSquare size={14} />
                      <span>Facility Team Update:</span>
                    </div>
                    <p className="remarks-text">{issue.adminRemarks}</p>
                  </div>
                )}

                {/* Ticket Footer: Reporter meta & Upvoting */}
                <div className="ticket-footer">
                  <div className="reporter-info">
                    <div className="reporter-avatar">
                      {issue.reportedBy?.name ? issue.reportedBy.name[0].toUpperCase() : 'U'}
                    </div>
                    <div>
                      <span className="reporter-name">
                        {issue.reportedBy?.name || 'Anonymous Student'}
                      </span>
                      <span className="reporter-dept">
                        {issue.reportedBy?.department || 'Campus Member'} •{' '}
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="footer-controls">
                    <button
                      className={`btn-upvote ${hasUpvoted ? 'upvoted' : ''}`}
                      onClick={() => handleUpvote(issue._id)}
                      title="Upvote if this affects you too"
                    >
                      <ThumbsUp size={15} />
                      <span>{issue.upvotes?.length || 0}</span>
                    </button>

                    {isAdmin && (
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => handleStartStatusEdit(issue)}
                      >
                        Manage Status
                      </button>
                    )}
                  </div>
                </div>

                {/* Admin Status Management Drawer */}
                {isAdmin && editingIssueId === issue._id && (
                  <div className="admin-status-drawer">
                    <h4>Admin Resolution Panel</h4>
                    <div className="form-group">
                      <label>Update Status:</label>
                      <select
                        value={adminStatus}
                        onChange={(e) => setAdminStatus(e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Maintenance Remarks / ETA:</label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Electrician assigned. Replaced blown capacitor."
                        value={adminRemarks}
                        onChange={(e) => setAdminRemarks(e.target.value)}
                      />
                    </div>

                    <div className="drawer-actions">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleSaveStatus(issue._id)}
                        disabled={updating}
                      >
                        {updating ? 'Saving...' : 'Confirm Update'}
                      </button>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => setEditingIssueId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
