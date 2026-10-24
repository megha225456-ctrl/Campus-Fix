import React from 'react';
import { Clock, Wrench, CheckCircle2 } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  let badgeClass = 'badge-pending';
  let Icon = Clock;

  if (status === 'In Progress') {
    badgeClass = 'badge-progress';
    Icon = Wrench;
  } else if (status === 'Resolved') {
    badgeClass = 'badge-resolved';
    Icon = CheckCircle2;
  }

  return (
    <span className={`badge ${badgeClass}`}>
      <Icon size={14} className="badge-icon" />
      {status}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  const priorityClass = {
    Low: 'priority-low',
    Medium: 'priority-medium',
    High: 'priority-high',
    Urgent: 'priority-urgent',
  }[priority] || 'priority-medium';

  return <span className={`badge ${priorityClass}`}>{priority}</span>;
};
