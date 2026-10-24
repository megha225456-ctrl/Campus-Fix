import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { StatusBadge, PriorityBadge } from '../components/Badges';
import { LoadingState, EmptyState, ErrorAlert } from '../components/StateFeedback';
import { MapPin, Trash2, PlusCircle, MessageSquare } from 'lucide-react';

export const MyTickets = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchMyTickets = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiRequest('/issues/my');
      if (data.success) {
        setIssues(data.issues);
      }
    } catch (err) {
      setError(err.message || 'Failed to load your tickets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTickets();
  }, []);

  const handleDelete = async (issueId) => {
    if (!window.confirm('Delete this ticket?')) return;
    try {
      await apiRequest(`/issues/${issueId}`, { method: 'DELETE' });
      setIssues((prev) => prev.filter((i) => i._id !== issueId));
    } catch (err) {
      alert(err.message || 'Failed to delete ticket.');
    }
  };

  return (
    <div className="page-container">
      <div className="dashboard-hero">
        <div className="hero-text">
          <h1>My Submitted Tickets</h1>
          <p>Track the progress and technician updates for issues you reported.</p>
        </div>

        <button className="btn btn-primary" onClick={() => navigate('/new-ticket')}>
          <PlusCircle size={18} />
          <span>Report Another Issue</span>
        </button>
      </div>

      {loading ? (
        <LoadingState message="Loading your tickets..." />
      ) : error ? (
        <ErrorAlert message={error} onRetry={fetchMyTickets} />
      ) : issues.length === 0 ? (
        <EmptyState
          title="You haven't reported any issues yet"
          message="Notice any broken benches, leaking pipes, or lab PC issues? Submit your first ticket!"
          actionLabel="Report Issue Now"
          onAction={() => navigate('/new-ticket')}
        />
      ) : (
        <div className="ticket-list">
          {issues.map((issue) => (
            <div key={issue._id} className="ticket-card">
              <div className="ticket-header">
                <div className="ticket-badges">
                  <span className="category-chip">{issue.category}</span>
                  <PriorityBadge priority={issue.priority} />
                  <StatusBadge status={issue.status} />
                </div>

                {issue.status === 'Pending' && (
                  <button
                    className="btn-icon danger"
                    onClick={() => handleDelete(issue._id)}
                    title="Cancel/Delete Ticket"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <h3 className="ticket-title">{issue.title}</h3>

              <div className="ticket-location">
                <MapPin size={15} />
                <span>{issue.location}</span>
              </div>

              <p className="ticket-desc">{issue.description}</p>

              {issue.adminRemarks && (
                <div className="remarks-box">
                  <div className="remarks-title">
                    <MessageSquare size={14} />
                    <span>Facility Team Response:</span>
                  </div>
                  <p className="remarks-text">{issue.adminRemarks}</p>
                </div>
              )}

              <div className="ticket-footer">
                <span className="reporter-dept">
                  Submitted on {new Date(issue.createdAt).toLocaleDateString()}
                </span>
                <span className="text-muted">
                  Upvotes from peers: {issue.upvotes?.length || 0}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
