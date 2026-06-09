import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export function useProfiles(filters = {}) {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchProfiles = useCallback(async (p = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = { page: p, limit: 20, ...filters };
      // Remove falsy values
      Object.keys(params).forEach((k) => !params[k] && delete params[k]);
      const { data } = await api.get('/users', { params });
      setProfiles(data.users);
      setTotal(data.total);
      setPage(data.page);
      setPages(data.pages);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profiles');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchProfiles(1);
  }, [fetchProfiles]);

  return { profiles, loading, error, total, page, pages, fetchProfiles };
}
