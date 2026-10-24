import React from 'react';
import { AlertCircle, Inbox, Loader2 } from 'lucide-react';

export const LoadingState = ({ message = 'Loading campus records...' }) => (
  <div className="feedback-container loading-state">
    <Loader2 className="spinner" size={36} />
    <p>{message}</p>
  </div>
);

export const EmptyState = ({
  title = 'No tickets found',
  message = 'There are no maintenance issues matching your criteria.',
  actionLabel,
  onAction,
}) => (
  <div className="feedback-container empty-state">
    <div className="feedback-icon empty-icon">
      <Inbox size={48} />
    </div>
    <h3>{title}</h3>
    <p>{message}</p>
    {actionLabel && onAction && (
      <button className="btn btn-primary" onClick={onAction}>
        {actionLabel}
      </button>
    )}
  </div>
);

export const ErrorAlert = ({ message = 'Something went wrong', onRetry }) => (
  <div className="feedback-container error-state">
    <div className="feedback-icon error-icon">
      <AlertCircle size={40} />
    </div>
    <h3>Error Encountered</h3>
    <p>{message}</p>
    {onRetry && (
      <button className="btn btn-secondary" onClick={onRetry}>
        Try Again
      </button>
    )}
  </div>
);
