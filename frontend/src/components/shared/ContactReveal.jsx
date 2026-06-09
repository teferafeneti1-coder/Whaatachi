import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

function ContactRow({ icon, label, value, link }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success(`${label} copied!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        background: '#E3F2FD', borderRadius: 12,
        padding: '12px 16px', marginBottom: 10,
      }}
      whileHover={{ scale: 1.01, background: '#BBDEFB' }}
      transition={{ duration: 0.2 }}
    >
      <span style={{ fontSize: 20 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, color: '#1565C0', fontWeight: 600, fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: 1 }}>
          {label}
        </div>
        <div style={{ fontSize: 16, color: '#0D1B2A', fontWeight: 500, fontFamily: 'Inter, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {value}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {link && (
          <a href={link} target="_blank" rel="noopener noreferrer" style={{ color: '#1565C0' }}>
            <ExternalLink size={16} />
          </a>
        )}
        <button onClick={copy} style={{ color: copied ? '#2E7D32' : '#1565C0', background: 'none', border: 'none', cursor: 'pointer' }}>
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
    </motion.div>
  );
}

export default function ContactReveal({ contact }) {
  if (!contact) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ marginTop: 8 }}
    >
      {contact.phoneNumber && (
        <ContactRow icon="📞" label="Phone Number" value={contact.phoneNumber} />
      )}
      {contact.telegramUsername && (
        <ContactRow
          icon="✈️"
          label="Telegram"
          value={`@${contact.telegramUsername}`}
          link={`https://t.me/${contact.telegramUsername}`}
        />
      )}
      {contact.instagramUsername && (
        <ContactRow
          icon="📷"
          label="Instagram"
          value={`@${contact.instagramUsername}`}
          link={`https://instagram.com/${contact.instagramUsername}`}
        />
      )}
      {!contact.phoneNumber && !contact.telegramUsername && !contact.instagramUsername && (
        <p style={{ color: '#9E9E9E', fontSize: 14, fontFamily: 'Inter, sans-serif', textAlign: 'center' }}>
          No contact details provided.
        </p>
      )}
    </motion.div>
  );
}
