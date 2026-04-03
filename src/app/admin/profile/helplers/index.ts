
// Helper function for severity color
export const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high': return 'red';
    case 'medium': return 'orange';
    case 'low': return 'green';
    default: return 'default';
  }
};
