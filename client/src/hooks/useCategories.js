import { useState, useEffect, useCallback } from 'react';
import { getCategories } from '../services/api';
import toast from 'react-hot-toast';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCategories();
      if (res.data?.success) {
        setCategories(res.data.data || []);
      }
    } catch (err) {
      const msg = err.message || 'Failed to load categories';
      setError(msg);
      // Suppress noisy error toast on initial silent load if needed, or keep toast
      console.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetch: fetchCategories };
};

export default useCategories;
