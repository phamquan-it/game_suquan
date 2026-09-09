import React from 'react';

export const styles = {
  fullLayout: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a0a0a 0%, #2a1515 30%, #1a0a0a 60%, #0f0f1a 100%)',
  },
  fullContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: 0,
  },
  backgroundPattern: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      radial-gradient(circle at 10% 30%, rgba(212, 175, 55, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 90% 70%, rgba(139, 0, 0, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.02) 0%, transparent 70%)
    `,
    pointerEvents: 'none' as const,
    zIndex: 0,
  },
  wrapper: {
    width: '100%',
    maxWidth: 1100,
    margin: '20px auto',
    padding: '0 20px',
    position: 'relative' as const,
    zIndex: 1,
  },
  loadingWrapper: {
    width: '100%',
    maxWidth: 900,
    margin: '0 auto',
    padding: '0 20px',
    position: 'relative' as const,
    zIndex: 1,
  },
  loadingCard: {
    borderRadius: 24,
    boxShadow: '0 8px 40px rgba(212, 175, 55, 0.15)',
    border: '2px solid #D4AF37',
    background: 'linear-gradient(135deg, #0a0a1a, #1a0a0a)',
  },
  card: {
    borderRadius: 24,
    boxShadow: '0 8px 40px rgba(212, 175, 55, 0.15)',
    border: '2px solid #D4AF37',
    background: 'linear-gradient(135deg, #0a0a1a, #1a0a0a)',
  },
  header: {
    background: 'linear-gradient(135deg, #0a0505 0%, #1a0a0a 40%, #2a1515 100%)',
    border: '2px solid #D4AF37',
    borderBottom: 'none',
    borderRadius: '20px 20px 0 0',
    padding: '20px 32px',
    position: 'relative' as const,
    boxShadow: '0 -4px 30px rgba(212, 175, 55, 0.1)',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: '12px',
  },
  headerLeft: {
    flex: '0 0 auto',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  headerRight: {
    flex: '0 0 auto',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  headerCenter: {
    flex: '1',
    textAlign: 'center' as const,
  },
  headerTitle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap' as const,
  },
  headerTitleMain: {
    color: '#FFD700',
    fontSize: 32,
    fontWeight: 900,
    fontFamily: '"Cinzel", "Times New Roman", serif',
    letterSpacing: 8,
    textShadow: '0 0 40px rgba(255, 215, 0, 0.15)',
  },
  headerTitleStore: {
    color: '#D4AF37',
    fontSize: 32,
    fontWeight: 700,
    fontFamily: '"Cinzel", "Times New Roman", serif',
    letterSpacing: 4,
    textShadow: '0 0 40px rgba(212, 175, 55, 0.1)',
  },
  headerSubtitle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    marginTop: '4px',
    color: '#B8860B',
    fontSize: 14,
    fontFamily: '"Cinzel", "Times New Roman", serif',
    letterSpacing: 3,
  },
  headerSubtitleLine: {
    color: '#D4AF37',
    fontSize: 16,
    opacity: 0.5,
  },
  footer: {
    background: 'linear-gradient(135deg, #0a0505 0%, #1a0a0a 40%, #2a1515 100%)',
    border: '2px solid #D4AF37',
    borderTop: 'none',
    borderRadius: '0 0 20px 20px',
    padding: '20px 32px 16px',
    textAlign: 'center' as const,
    boxShadow: '0 4px 30px rgba(212, 175, 55, 0.1)',
  },
  footerContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap' as const,
  },
  footerText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 700,
    fontFamily: '"Cinzel", "Times New Roman", serif',
    letterSpacing: 4,
  },
  footerDivider: {
    color: '#D4AF37',
    fontSize: 14,
    opacity: 0.4,
  },
  footerSubText: {
    color: '#B8860B',
    fontSize: 14,
    fontFamily: '"Cinzel", "Times New Roman", serif',
    letterSpacing: 3,
  },
  footerBottom: {
    marginTop: '8px',
    borderTop: '1px solid rgba(212, 175, 55, 0.1)',
    paddingTop: '8px',
  },
  footerBottomText: {
    color: 'rgba(184, 134, 11, 0.4)',
    fontSize: 11,
    letterSpacing: 2,
  },
  fullCard: {
    borderRadius: 0,
    boxShadow: '0 8px 40px rgba(212, 175, 55, 0.15)',
    border: '2px solid #D4AF37',
    borderTop: 'none',
    borderBottom: 'none',
    background: '#FFFFFF',
  },
  decorativeBorder: {
    textAlign: 'center' as const,
    padding: '4px 0',
    background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
  },
  decorativeBorderText: {
    color: '#D4AF37',
    fontSize: 14,
    letterSpacing: 12,
    opacity: 0.4,
  },
  fullStatusHeader: {
    padding: '3rem 3rem 2rem',
  },
  statusIconWrapper: {
    fontSize: 72,
    marginBottom: '8px',
  },
  fullSection: {
    padding: '2rem 3rem',
  },
  summaryCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px 24px',
    background: 'rgba(245, 245, 220, 0.3)',
    borderRadius: 16,
    border: '1px solid #F1E8D6',
    transition: 'all 0.3s ease',
  },
  summaryIcon: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    background: 'rgba(139, 0, 0, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullDivider: {
    margin: 0,
    borderColor: '#F1E8D6',
    borderWidth: 2,
  },
  fullOrderItems: {
    maxHeight: 450,
    overflowY: 'auto' as const,
    scrollbarWidth: 'thin' as const,
  },
  fullOrderItem: {
    padding: '16px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.3s ease',
    borderRadius: 12,
    marginBottom: 4,
  },
  fullOrderItemLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  fullItemIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
  fullTotals: {
    marginTop: '2rem',
    padding: '24px',
    background: 'rgba(245, 245, 220, 0.3)',
    borderRadius: 16,
    border: '1px solid #F1E8D6',
  },
  totalAmount: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '12px 16px',
    background: 'rgba(245, 245, 220, 0.2)',
    borderRadius: 12,
    border: '1px solid #F1E8D6',
  },
  fullActions: {
    padding: '2rem 3rem 2.5rem',
  },
  fullSupport: {
    padding: '1.25rem 3rem',
    backgroundColor: '#F5F5DC',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderTop: '2px solid #F1E8D6',
  },
  supportContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap' as const,
    gap: '8px',
  },
};

export const statusHeaderStyles = {
  container: (bgColor: string) => ({
    padding: '3rem 3rem 2rem',
    backgroundColor: bgColor,
  }),
  iconWrapper: {
    fontSize: 72,
    marginBottom: '8px',
  },
  title: (color: string) => ({
    color: color,
    margin: 0,
    fontFamily: '"Cinzel", "Times New Roman", serif',
    fontSize: 36,
    fontWeight: 'bold'
  } as React.CSSProperties),
  subTitleText: {
    fontSize: 18,
    color: '#8B4513'
  },
  tag: {
    fontSize: 15,
    padding: '6px 20px',
    borderRadius: 20
  },
  alert: (color: string) => ({
    marginTop: 16,
    textAlign: 'left' as const,
    borderRadius: 12,
    fontSize: 15,
    padding: '16px 24px',
    border: `2px solid ${color}`,
    backgroundColor: 'rgba(255,255,255,0.9)'
  })
};

export const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&display=swap');

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      background: #0a0a1a;
      margin: 0;
      padding: 0;
    }

    .ant-result-icon {
      margin-bottom: 16px !important;
    }

    .ant-result-title {
      font-family: 'Cinzel', 'Times New Roman', serif !important;
    }

    .ant-result-subtitle {
      font-size: 16px !important;
    }

    .ant-statistic-content {
      font-family: 'Cinzel', 'Times New Roman', serif !important;
    }

    /* Scrollbar Styles */
    div[style*="max-height: 450px"]::-webkit-scrollbar {
      width: 8px;
    }

    div[style*="max-height: 450px"]::-webkit-scrollbar-track {
      background: #F5F5DC;
      border-radius: 10px;
    }

    div[style*="max-height: 450px"]::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, #D4AF37, #B8860B);
      border-radius: 10px;
      border: 2px solid #F5F5DC;
    }

    div[style*="max-height: 450px"]::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(180deg, #E5BF37, #C8960B);
    }

    /* Hover Effects */
    .ant-card-body div[style*="padding: 16px 20px"]:hover {
      transform: translateX(4px);
      background: rgba(245, 245, 220, 0.5) !important;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .ant-result-title {
        font-size: 24px !important;
      }

      .ant-statistic-content {
        font-size: 24px !important;
      }

      .ant-result {
        padding: 0 !important;
      }

      div[style*="padding: 3rem 3rem 2rem"] {
        padding: 2rem 1.5rem !important;
      }

      div[style*="padding: 2rem 3rem"] {
        padding: 1.5rem !important;
      }

      div[style*="padding: 2rem 3rem 2.5rem"] {
        padding: 1.5rem !important;
      }

      div[style*="padding: 1.25rem 3rem"] {
        padding: 1rem 1.5rem !important;
      }

      .ant-result-title {
        font-size: 20px !important;
      }

      .ant-statistic-content {
        font-size: 20px !important;
      }

      .summary-card {
        flex-direction: column !important;
        text-align: center !important;
      }

      div[style*="padding: 20px 32px"] {
        padding: 16px !important;
      }

      div[style*="font-size: 32px"] {
        font-size: 24px !important;
      }
    }

    @media print {
      .ant-card {
        box-shadow: none !important;
        border: 1px solid #ddd !important;
      }
    }
`;
