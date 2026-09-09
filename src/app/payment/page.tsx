// app/payment/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import client from "./init";
import { PaymentMethod } from 'sepay-pg-node/dist/types';

// Game theme styles
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a0a0a 0%, #2a1515 30%, #1a0a0a 60%, #0f0f1a 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  wrapper: {
    width: '100%',
    maxWidth: 650,
    margin: '0 auto',
    animation: 'fadeIn 0.5s ease-in-out',
  },
  // Decorative border for game feel
  decorativeBorder: {
    border: '2px solid #D4AF37',
    borderRadius: '20px',
    padding: '4px',
    background: 'linear-gradient(135deg, #D4AF37, #B8860B)',
    boxShadow: '0 0 40px rgba(212, 175, 55, 0.2)',
  },
  card: {
    borderRadius: '18px',
    background: 'linear-gradient(180deg, #0a0a1a, #1a0a0a)',
    padding: '32px',
    border: '1px solid rgba(212, 175, 55, 0.3)',
  },
  title: {
    textAlign: 'center' as const,
    marginBottom: '24px',
  },
  titleIcon: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '8px',
  },
  titleMain: {
    color: '#FFD700',
    fontSize: '28px',
    fontWeight: 'bold',
    fontFamily: '"Cinzel", "Times New Roman", serif',
    letterSpacing: '4px',
    textShadow: '0 0 30px rgba(255, 215, 0, 0.15)',
  },
  titleSub: {
    color: '#B8860B',
    fontSize: '14px',
    fontFamily: '"Cinzel", "Times New Roman", serif',
    letterSpacing: '2px',
    marginTop: '4px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    color: '#D4AF37',
    fontSize: '14px',
    fontWeight: '600',
    fontFamily: '"Cinzel", "Times New Roman", serif',
    marginBottom: '6px',
    letterSpacing: '1px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '2px solid rgba(212, 175, 55, 0.3)',
    borderRadius: '12px',
    color: '#D4AF37',
    fontSize: '16px',
    fontFamily: '"Cinzel", "Times New Roman", serif',
    transition: 'all 0.3s ease',
    outline: 'none',
  },
  inputFocus: {
    borderColor: '#FFD700',
    boxShadow: '0 0 20px rgba(255, 215, 0, 0.1)',
    background: 'rgba(255, 255, 255, 0.08)',
  },
  amountPresets: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
    gap: '8px',
    marginBottom: '12px',
  },
  presetButton: {
    padding: '8px 12px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '2px solid rgba(212, 175, 55, 0.3)',
    borderRadius: '10px',
    color: '#D4AF37',
    fontSize: '13px',
    fontFamily: '"Cinzel", "Times New Roman", serif',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'center' as const,
    fontWeight: '600',
  },
  presetButtonActive: {
    background: 'rgba(212, 175, 55, 0.2)',
    borderColor: '#FFD700',
    boxShadow: '0 0 20px rgba(255, 215, 0, 0.1)',
    color: '#FFD700',
  },
  customToggle: {
    padding: '8px 16px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '2px dashed rgba(212, 175, 55, 0.3)',
    borderRadius: '10px',
    color: '#B8860B',
    fontSize: '13px',
    fontFamily: '"Cinzel", "Times New Roman", serif',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'center' as const,
  },
  customToggleActive: {
    borderColor: '#FFD700',
    color: '#FFD700',
    background: 'rgba(212, 175, 55, 0.1)',
  },
  amountDisplay: {
    padding: '12px 16px',
    background: 'rgba(212, 175, 55, 0.05)',
    border: '1px solid rgba(212, 175, 55, 0.2)',
    borderRadius: '12px',
    textAlign: 'center' as const,
    marginTop: '12px',
  },
  amountText: {
    color: '#B8860B',
    fontSize: '14px',
    fontFamily: '"Cinzel", "Times New Roman", serif',
  },
  amountValue: {
    color: '#FFD700',
    fontSize: '28px',
    fontWeight: 'bold',
    fontFamily: '"Cinzel", "Times New Roman", serif',
    textShadow: '0 0 30px rgba(255, 215, 0, 0.1)',
  },
  paymentMethods: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
  },
  methodButton: {
    padding: '12px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '2px solid rgba(212, 175, 55, 0.2)',
    borderRadius: '12px',
    color: '#D4AF37',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'center' as const,
    fontFamily: '"Cinzel", "Times New Roman", serif',
    fontSize: '13px',
  },
  methodButtonActive: {
    background: 'rgba(212, 175, 55, 0.15)',
    borderColor: '#FFD700',
    boxShadow: '0 0 20px rgba(255, 215, 0, 0.1)',
    color: '#FFD700',
  },
  methodIcon: {
    fontSize: '24px',
    display: 'block',
    marginBottom: '4px',
  },
  submitButton: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #8B0000, #660000)',
    border: '2px solid #D4AF37',
    borderRadius: '14px',
    color: '#FFD700',
    fontSize: '18px',
    fontWeight: 'bold',
    fontFamily: '"Cinzel", "Times New Roman", serif',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    letterSpacing: '2px',
    boxShadow: '0 4px 20px rgba(139, 0, 0, 0.3)',
    marginTop: '8px',
  },
  submitButtonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 30px rgba(139, 0, 0, 0.4)',
    background: 'linear-gradient(135deg, #A52A2A, #8B0000)',
  },
  cancelButton: {
    width: '100%',
    padding: '14px',
    background: 'transparent',
    border: '2px solid rgba(212, 175, 55, 0.3)',
    borderRadius: '14px',
    color: '#B8860B',
    fontSize: '14px',
    fontFamily: '"Cinzel", "Times New Roman", serif',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    letterSpacing: '1px',
    marginTop: '8px',
  },
  support: {
    textAlign: 'center' as const,
    marginTop: '20px',
    padding: '12px',
    borderTop: '1px solid rgba(212, 175, 55, 0.1)',
    color: '#B8860B',
    fontSize: '12px',
    fontFamily: '"Cinzel", "Times New Roman", serif',
  },
  errorMessage: {
    color: '#FF4444',
    fontSize: '13px',
    fontFamily: '"Cinzel", "Times New Roman", serif',
    marginTop: '4px',
    padding: '8px 12px',
    background: 'rgba(255, 68, 68, 0.1)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 68, 68, 0.2)',
  },
};


type PaymentMethodItem = {
  value: PaymentMethod;
  label: string;
  icon: string;
};

export default function PaymentPage() {
  const router = useRouter();
  const [orderId, setOrderId] = useState('DH123');
  const [amount, setAmount] = useState(10000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('BANK_TRANSFER');
  const [description, setDescription] = useState('Thanh toán đơn hàng');
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const amountPresets = [10000, 20000, 50000, 100000, 200000, 500000];

  const paymentMethods:PaymentMethodItem[] = [
    { value: 'BANK_TRANSFER', label: 'Chuyển khoản', icon: '🏦' },
    { value: 'CARD', label: 'Thẻ tín dụng', icon: '💳' },
    { value: 'NAPAS_BANK_TRANSFER', label: 'Mã QR', icon: '📱' },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleAmountPreset = (value: number) => {
    setAmount(value);
    setIsCustomAmount(false);
    setError('');
  };

  const handleCustomToggle = () => {
    setIsCustomAmount(!isCustomAmount);
    if (!isCustomAmount) {
      setAmount(0);
    } else {
      setAmount(10000);
    }
    setError('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value.replace(/,/g, ''));
    if (!isNaN(value) && value >= 0) {
      setAmount(value);
      setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!orderId.trim()) {
      setError('Vui lòng nhập mã đơn hàng');
      return;
    }
    if (!amount || amount < 1000) {
      setError('Số tiền tối thiểu là 1,000 VND');
      return;
    }
    if (amount > 100000000) {
      setError('Số tiền tối đa là 100,000,000 VND');
      return;
    }
    if (!description.trim()) {
      setError('Vui lòng nhập mô tả đơn hàng');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // Create checkout fields with updated data
      const checkoutFormfields = client.checkout.initOneTimePaymentFields({
        operation: 'PURCHASE',
        payment_method: paymentMethod,
        order_invoice_number: orderId,
        order_amount: amount,
        currency: 'VND',
        order_description: description,
        success_url: `http://localhost:3000/order/${orderId}?payment=success`,
        error_url: `http://localhost:3000/order/${orderId}?payment=error`,
        cancel_url: `http://localhost:3000/order/${orderId}?payment=cancel`,
      });

      const checkoutURL = client.checkout.initCheckoutUrl();

      // Create and submit form
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = checkoutURL;

      Object.entries(checkoutFormfields).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);

    } catch (error) {
      console.error('Payment error:', error);
      setError('Có lỗi xảy ra khi khởi tạo thanh toán. Vui lòng thử lại.');
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  // Add global styles for animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&display=swap');

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes glowPulse {
        0%, 100% {
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.1);
        }
        50% {
          box-shadow: 0 0 40px rgba(212, 175, 55, 0.2);
        }
      }

      .game-input:focus {
        border-color: #FFD700 !important;
        box-shadow: 0 0 20px rgba(255, 215, 0, 0.1) !important;
        background: rgba(255, 255, 255, 0.08) !important;
      }

      .game-input:hover {
        border-color: rgba(212, 175, 55, 0.6) !important;
      }

      .game-preset:hover {
        background: rgba(212, 175, 55, 0.1) !important;
        transform: translateY(-2px);
      }

      .game-method:hover {
        background: rgba(212, 175, 55, 0.08) !important;
        transform: translateY(-2px);
      }

      .game-submit:hover:not(:disabled) {
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 30px rgba(139, 0, 0, 0.4) !important;
        background: linear-gradient(135deg, #A52A2A, #8B0000) !important;
      }

      .game-submit:active:not(:disabled) {
        transform: translateY(0px) !important;
      }

      .game-submit:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .game-cancel:hover {
        border-color: rgba(212, 175, 55, 0.6) !important;
        color: #D4AF37 !important;
      }

      @media (max-width: 640px) {
        .game-methods {
          grid-template-columns: 1fr 1fr !important;
        }
        .game-presets {
          grid-template-columns: repeat(3, 1fr) !important;
        }
        .game-card {
          padding: 20px !important;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.decorativeBorder}>
          <div style={styles.card} className="game-card">
            {/* Title */}
            <div style={styles.title}>
              <span style={styles.titleIcon}>⚔️</span>
              <div style={styles.titleMain}>IMPERIAL PAY</div>
              <div style={styles.titleSub}>✦ 12 SỨ QUÂN HOÀNG GIA ✦</div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Order ID */}
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={{ marginRight: 8 }}>📜</span>
                  Mã đơn hàng
                </label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => {
                    setOrderId(e.target.value);
                    setError('');
                  }}
                  style={styles.input}
                  className="game-input"
                  placeholder="Nhập mã đơn hàng..."
                  required
                />
              </div>

              {/* Amount */}
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={{ marginRight: 8 }}>💰</span>
                  Số tiền thanh toán
                </label>

                <div className="game-presets" style={styles.amountPresets}>
                  {amountPresets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleAmountPreset(preset)}
                      style={{
                        ...styles.presetButton,
                        ...(amount === preset && !isCustomAmount ? styles.presetButtonActive : {}),
                      }}
                      className="game-preset"
                    >
                      {formatCurrency(preset)}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleCustomToggle}
                    style={{
                      ...styles.customToggle,
                      ...(isCustomAmount ? styles.customToggleActive : {}),
                    }}
                    className="game-preset"
                  >
                    ✏️ Tùy chỉnh
                  </button>
                </div>

                {isCustomAmount && (
                  <input
                    type="text"
                    value={amount ? amount.toLocaleString('vi-VN') : ''}
                    onChange={handleCustomAmountChange}
                    style={styles.input}
                    className="game-input"
                    placeholder="Nhập số tiền..."
                  />
                )}

                <div style={styles.amountDisplay}>
                  <div style={styles.amountText}>Số tiền thanh toán</div>
                  <div style={styles.amountValue}>{formatCurrency(amount || 0)}</div>
                </div>
              </div>

              {/* Payment Methods */}
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={{ marginRight: 8 }}>🏹</span>
                  Phương thức thanh toán
                </label>
                <div className="game-methods" style={styles.paymentMethods}>
                  {paymentMethods.map((method) => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => {
                        setPaymentMethod(method.value);
                        setError('');
                      }}
                      style={{
                        ...styles.methodButton,
                        ...(paymentMethod === method.value ? styles.methodButtonActive : {}),
                      }}
                      className="game-method"
                    >
                      <span style={styles.methodIcon}>{method.icon}</span>
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={{ marginRight: 8 }}>📝</span>
                  Mô tả đơn hàng
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setError('');
                  }}
                  style={styles.input}
                  className="game-input"
                  placeholder="Nhập mô tả đơn hàng..."
                  required
                />
              </div>

              {/* Error Message */}
              {error && <div style={styles.errorMessage}>⚠️ {error}</div>}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                style={styles.submitButton}
                className="game-submit"
              >
                {isLoading ? (
                  <span>⏳ Đang xử lý...</span>
                ) : (
                  <span>⚡ THANH TOÁN NGAY</span>
                )}
              </button>

              {/* Cancel Button */}
              <button
                type="button"
                onClick={handleCancel}
                style={styles.cancelButton}
                className="game-cancel"
              >
                🏰 Quay lại
              </button>

              {/* Support */}
              <div style={styles.support}>
                <div>🛡️ Giao dịch được bảo mật bởi SSL</div>
                <div style={{ marginTop: 4 }}>
                  📞 Hỗ trợ: 1900 1234 &nbsp;|&nbsp; 📧 support@imperialstore.com
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
