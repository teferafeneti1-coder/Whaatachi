import { motion } from 'framer-motion';

const variants = {
  primary: {
    background: 'linear-gradient(135deg, #E91E8C 0%, #C2185B 50%, #1565C0 100%)',
    color: '#fff',
    border: 'none',
  },
  secondary: {
    background: 'transparent',
    color: '#E91E8C',
    border: '2px solid #E91E8C',
  },
  ghost: {
    background: 'transparent',
    color: '#1565C0',
    border: 'none',
  },
  danger: {
    background: 'linear-gradient(135deg, #e53935, #b71c1c)',
    color: '#fff',
    border: 'none',
  },
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  className = '',
  style = {},
  ...props
}) {
  const v = variants[variant] || variants.primary;

  const sizeStyles = {
    sm: { padding: '8px 20px', fontSize: '14px' },
    md: { padding: '12px 28px', fontSize: '16px' },
    lg: { padding: '16px 36px', fontSize: '18px' },
  }[size] || { padding: '12px 28px', fontSize: '16px' };

  return (
    <motion.button
      whileHover={{ scale: 1.03, translateY: -2 }}
      whileTap={{ scale: 0.97 }}
      style={{
        ...v,
        ...sizeStyles,
        borderRadius: '50px',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 600,
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.7 : 1,
        width: fullWidth ? '100%' : 'auto',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'box-shadow 0.3s',
        boxShadow: variant === 'primary' ? '0 8px 24px rgba(233,30,140,0.3)' : 'none',
        ...style,
      }}
      disabled={loading}
      className={className}
      {...props}
    >
      {loading ? (
        <span style={{
          width: 18, height: 18, border: '2px solid rgba(255,255,255,0.4)',
          borderTop: '2px solid #fff', borderRadius: '50%',
          display: 'inline-block', animation: 'spin 0.8s linear infinite',
        }} />
      ) : children}
    </motion.button>
  );
}
