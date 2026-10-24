import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { Wrench, MapPin, Tag, AlertCircle, ArrowLeft, Send } from 'lucide-react';

const CATEGORIES = ['IT & Lab', 'Electrical', 'Plumbing', 'Furniture', 'Cleanliness', 'Other'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

export const NewTicket = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'IT & Lab',
    location: '',
    priority: 'Medium',
    description: '',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.location.trim() || !formData.description.trim()) {
      setError('Please fill out all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await apiRequest('/issues', {
        method: 'POST',
        body: formData,
      });

      if (res.success) {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Failed to submit maintenance ticket.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container form-page-container">
      <div className="form-card">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <div className="form-header">
          <div className="form-icon">
            <Wrench size={24} />
          </div>
          <h2>Report Maintenance Issue</h2>
          <p>Provide accurate details so the campus facility team can address it promptly.</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-stack">
          <div className="form-group">
            <label htmlFor="title">Issue Summary *</label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g. Projector lamp flickering, broken water cooler tap"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="category">Category *</label>
              <div className="input-with-icon">
                <Tag size={18} className="input-icon" />
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group flex-1">
              <label htmlFor="priority">Urgency / Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p} Priority
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="location">Specific Campus Location *</label>
            <div className="input-with-icon">
              <MapPin size={18} className="input-icon" />
              <input
                id="location"
                name="location"
                type="text"
                placeholder="e.g. Science Block, 2nd Floor, Lab 4"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Detailed Description *</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Describe what is wrong, when it started, and any hazards or context..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={submitting}
          >
            {submitting ? 'Submitting Ticket...' : 'Submit Maintenance Ticket'}
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
