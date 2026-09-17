// ============================================================================
// LiveDataBadge - Background live data connection (visual indicator hidden as requested)
// The live Excel / SharePoint connection continues running seamlessly via hooks
// ============================================================================

import React from 'react';

interface LiveDataBadgeProps {
  dataSource?: 'sharepoint' | 'local' | 'static';
  lastUpdatedDisplay?: string;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  error?: string | null;
  className?: string;
}

export const LiveDataBadge: React.FC<LiveDataBadgeProps> = () => {
  // Return null to hide the badge from screen as requested across all pages,
  // while preserving all hook integrations and live SharePoint background syncing.
  return null;
};

export default LiveDataBadge;
