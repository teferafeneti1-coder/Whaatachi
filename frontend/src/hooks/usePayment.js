import { useState } from 'react';
import api from '../services/api';
import { useApp } from '../context/AppContext';

export function usePayment() {
  const { payerId, unlockContact } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initiatePayment = async (viewedUserId, method) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/payments/initiate', {
        payerInfo: payerId,
        viewedUserId,
        method,
      });
      return { success: true, paymentId: data.payment?._id, alreadyPaid: data.alreadyPaid };
    } catch (err) {
      const msg = err.response?.data?.message || 'Payment failed';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // Simulate payment confirmation (demo mode — in production admin confirms)
  const confirmPayment = async (paymentId, viewedUserId) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post(`/payments/confirm/${paymentId}`);
      unlockContact(viewedUserId);
      return { success: true, contact: data.contact };
    } catch (err) {
      const msg = err.response?.data?.message || 'Confirmation failed';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const getContact = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/users/${userId}/contact`, {
        params: { payerInfo: payerId },
      });
      return { success: true, user: data.user };
    } catch (err) {
      if (err.response?.status === 402) {
        return { success: false, requiresPayment: true };
      }
      const msg = err.response?.data?.message || 'Failed to get contact';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  return { initiatePayment, confirmPayment, getContact, loading, error };
}
