import { motion } from 'framer-motion';

export default function Card({ children, className = '', style = {}, hoverable = false, ...props }) {
  const base = {
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(233,30,140,0.08)',
    padding: '24px',
    ...style,
  };

  if (hoverable) {
    return (
      <motion.div
        whileHover={{ scale: 1.02, boxShadow: '0 20px 60px rgba(13,27,42,0.15)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        style={base}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div style={base} className={className} {...props}>
      {children}
    </div>
  );
}
