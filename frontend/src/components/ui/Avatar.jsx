export default function Avatar({ src, name = '', size = 48, style = {} }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (src) {
    return (
      <img
        src={src.startsWith('/') ? `http://localhost:5000${src}` : src}
        alt={name}
        style={{
          width: size, height: size, borderRadius: '50%',
          objectFit: 'cover', display: 'block', ...style,
        }}
      />
    );
  }

  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'linear-gradient(135deg, #E91E8C, #1565C0)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontFamily: 'Inter, sans-serif',
      fontSize: size * 0.35, fontWeight: 700, flexShrink: 0,
      ...style,
    }}>
      {initials || '?'}
    </div>
  );
}
