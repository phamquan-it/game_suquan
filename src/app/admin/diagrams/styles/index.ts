
const styles = {
  // Layout
  layout: {
    minHeight: '100vh',
    background: '#F5F5DC',
  },
  header: {
    background: '#8B0000',
    padding: '0 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  } as React.CSSProperties,
  controlPanel: {
    padding: '16px 24px',
    background: '#FFFFFF',
    borderBottom: '2px solid #D4AF37',
    display: 'flex',
    flexWrap: 'wrap',
    gap: 16,
    alignItems: 'center',
  } as React.CSSProperties,
  content: {
    position: 'relative' as const,
    height: 'calc(100vh - 180px)',
    overflow: 'hidden',
    background: `
      radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 80% 50%, rgba(212, 175, 55, 0.05) 0%, transparent 50%),
      #F5F5DC
    `,
  } as React.CSSProperties,
  footer: {
    background: '#FFFFFF',
    borderTop: '2px solid #D4AF37',
    textAlign: 'center' as const,
    padding: '8px 16px',
  },

  // Draggable Box
  draggableBox: (color: string, borderColor: string) => ({
    border: `3px solid ${borderColor}`,
    padding: 0,
    background: color,
    borderRadius: '12px',
    cursor: 'grab',
    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
    minWidth: '200px',
    maxWidth: '320px',
    textAlign: 'center' as const,
    transition: 'box-shadow 0.3s, transform 0.2s',
    userSelect: 'none' as const,
    touchAction: 'none' as const,
    position: 'absolute' as const,
    left: 0,
    top: 0,
    zIndex: 10,
    overflow: 'hidden',
  }),
  draggableBoxHover: {
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    transform: 'scale(1.02)',
  },

  // Card hiển thị cấu trúc 1 bảng (ERD-style)
  tableCardContent: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left' as const,
    minWidth: 0,
  },
  tableCardHeader: (borderColor: string) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 12px',
    background: borderColor,
    color: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
  }),
  tableColumnsList: {
    maxHeight: 260,
    overflowY: 'auto' as const,
  },
  tableColumnRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    padding: '5px 12px',
    borderBottom: '1px solid rgba(0,0,0,0.06)',
  },
  tableCardFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    padding: '6px 12px',
    background: 'rgba(0,0,0,0.04)',
  },

  // Relationship Card
  relationshipCard: (isRelated: boolean) => ({
    position: 'absolute' as const,
    bottom: 30,
    right: 30,
    width: 340,
    zIndex: 20,
    boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
    borderRadius: 12,
    border: `2px solid ${isRelated ? '#2E8B57' : '#DC143C'}`,
  }),

  // Empty state
  emptyState: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center' as const,
    opacity: 0.5,
    pointerEvents: 'none' as const,
  },
  loadingState: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
};
export default styles;
