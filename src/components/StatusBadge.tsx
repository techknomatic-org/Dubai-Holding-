import React from 'react';

interface StatusBadgeProps {
  status: 'Closed' | 'On going' | 'Ongoing' | 'In Progress' | 'Open' | 'On-hold' | 'On hold' | 'Information' | 'Action' | 'Attention' | 'Delayed' | string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalized = status.toLowerCase().trim();

  // Default neutral badge
  let style: React.CSSProperties = {
    color: '#4D4D4F',
    backgroundColor: '#E5DFD3',
    borderColor: '#4D4D4F'
  };
  let dotColor = '#4D4D4F';
  let label = status;

  if (normalized === 'closed' || normalized === 'complete' || normalized === 'completed') {
    // Closed → Font #2E5F13, Fill #D1EED0
    style = { color: '#2E5F13', backgroundColor: '#D1EED0', borderColor: '#2E5F13' };
    dotColor = '#2E5F13';
    label = 'Closed';
  } else if (normalized === 'on going' || normalized === 'ongoing' || normalized === 'in progress') {
    // Ongoing / In Progress → Font #8D5C1A, Fill #F8EDA4
    style = { color: '#8D5C1A', backgroundColor: '#F8EDA4', borderColor: '#8D5C1A' };
    dotColor = '#8D5C1A';
    label = 'Ongoing';
  } else if (normalized === 'open') {
    // Open → Font #3A59A4, Fill #E1EAF6
    style = { color: '#3A59A4', backgroundColor: '#E1EAF6', borderColor: '#3A59A4' };
    dotColor = '#3A59A4';
    label = 'Open';
  } else if (normalized === 'on-hold' || normalized === 'on hold' || normalized === 'onhold') {
    // On-hold → Font #A5A940, Fill #FDFFD0
    style = { color: '#A5A940', backgroundColor: '#FDFFD0', borderColor: '#A5A940' };
    dotColor = '#A5A940';
    label = 'On-hold';
  } else if (normalized === 'attention' || normalized === 'requires attention') {
    // Attention → Font #C47135, Fill #F5E5D7
    style = { color: '#C47135', backgroundColor: '#F5E5D7', borderColor: '#C47135' };
    dotColor = '#C47135';
    label = 'Attention';
  } else if (normalized === 'delayed') {
    // Delayed → Font #872213, Fill #F2CACE
    style = { color: '#872213', backgroundColor: '#F2CACE', borderColor: '#872213' };
    dotColor = '#872213';
    label = 'Delayed';
  } else if (normalized === 'information' || normalized === 'i' || normalized === 'info') {
    style = { color: '#0A0838', backgroundColor: '#DADAE1', borderColor: '#545274' };
    dotColor = '#0A0838';
    label = 'Info';
  } else if (normalized === 'action' || normalized === 'a') {
    style = { color: '#E31837', backgroundColor: '#FBDCE1', borderColor: '#EB5D73' };
    dotColor = '#E31837';
    label = 'Action';
  }

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-0.5 font-medium',
    lg: 'text-xs px-3 py-1 font-medium'
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border select-none ${sizeClasses}`}
      style={style}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: dotColor }} />
      <span>{label}</span>
    </span>
  );
};
