export default function Badge({ children, variant = 'blue', style = {} }) {
  const styles = {
    blue:    { background: '#E3F2FD', color: '#1565C0' },
    rose:    { background: 'rgba(233,30,140,0.1)', color: '#E91E8C' },
    green:   { background: '#E8F5E9', color: '#2E7D32' },
    yellow:  { background: '#FFF8E1', color: '#F57F17' },
    red:     { background: '#FFEBEE', color: '#C62828' },
    gray:    { background: '#F5F5F5', color: '#616161' },
  };

  const s = styles[variant] || styles.blue;

  return (
    <span style={{
      ...s,
      padding: '3px 10px',
      borderRadius: '50px',
      fontSize: '12px',
      fontWeight: 600,
      fontFamily: 'Inter, sans-serif',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      ...style,
    }}>
      {children}
    </span>
  );
}
