import { useState } from 'react';

export default function Input({
  label,
  error,
  hint,
  type = 'text',
  className = '',
  style = {},
  ...props
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = props.value !== undefined ? String(props.value).length > 0 : false;
  const floatLabel = focused || hasValue;

  return (
    <div style={{ position: 'relative', marginBottom: '4px', ...style }}>
      {label && (
        <label
          style={{
            position: 'absolute',
            left: '16px',
            top: floatLabel ? '6px' : '50%',
            transform: floatLabel ? 'none' : 'translateY(-50%)',
            fontSize: floatLabel ? '11px' : '15px',
            color: focused ? '#E91E8C' : '#9E9E9E',
            transition: 'all 0.2s',
            pointerEvents: 'none',
            zIndex: 1,
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
          }}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          padding: label ? '22px 16px 8px' : '14px 16px',
          border: `2px solid ${error ? '#e53935' : focused ? '#E91E8C' : '#E0E0E0'}`,
          borderRadius: '12px',
          fontSize: '15px',
          fontFamily: 'Inter, sans-serif',
          color: '#0D1B2A',
          background: '#fff',
          outline: 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          boxShadow: focused ? '0 0 0 3px rgba(233,30,140,0.12)' : 'none',
        }}
        {...props}
      />
      {hint && !error && (
        <p style={{ fontSize: '12px', color: '#9E9E9E', marginTop: '4px', paddingLeft: '4px' }}>{hint}</p>
      )}
      {error && (
        <p style={{ fontSize: '12px', color: '#e53935', marginTop: '4px', paddingLeft: '4px' }}>{error}</p>
      )}
    </div>
  );
}
