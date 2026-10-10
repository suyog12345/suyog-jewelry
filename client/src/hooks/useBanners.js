import { useState, useEffect, useCallback } from 'react';
import { getBanners } from '../services/api';

export const useBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getBanners();
      if (res.data?.success) {
        setBanners(res.data.data || []);
      }
    } catch (err) {
      const msg = err.message || 'Failed to load banners';
      setError(msg);
      console.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  return { banners, loading, error, refetch: fetchBanners };
};

export default useBanners;
