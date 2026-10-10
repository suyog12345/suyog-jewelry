import { useState, useEffect, useCallback } from 'react';
import { getProduct } from '../services/api';
import toast from 'react-hot-toast';

export const useProduct = (idOrSlug) => {
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProduct = useCallback(async () => {
    if (!idOrSlug) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getProduct(idOrSlug);
      if (res.data?.success) {
        setProduct(res.data.data);
        setRelated(res.data.related || []);
      }
    } catch (err) {
      const msg = err.message || 'Failed to load product details';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [idOrSlug]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return { product, related, loading, error, refetch: fetchProduct };
};

export default useProduct;
