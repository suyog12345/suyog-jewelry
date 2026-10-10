import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiFilter, FiX, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { getProducts } from '../services/api';
import { useCategories } from '../hooks';
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { categories } = useCategories();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Form states based on URL params
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    material: searchParams.get('material') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest',
  });

  const materials = ['gold', 'silver', 'diamond', 'platinum', 'kundan', 'polki', 'meenakari', 'imitation'];

  useEffect(() => {
    // Update local filters when URL changes
    setFilters({
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      material: searchParams.get('material') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      sort: searchParams.get('sort') || 'newest',
    });
    fetchProducts();
  }, [location.search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Build API params from URL
      const params = Object.fromEntries([...searchParams]);
      const res = await getProducts(params);
      
      if (res.data.success) {
        setProducts(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = (e) => {
    if (e) e.preventDefault();
    
    // Update URL with non-empty filters and reset to page 1
    const newParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
    });
    newParams.set('page', '1');
    
    setSearchParams(newParams);
    if (window.innerWidth < 768) setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      material: '',
      minPrice: '',
      maxPrice: '',
      sort: 'newest',
    });
    setSearchParams(new URLSearchParams());
    if (window.innerWidth < 768) setShowFilters(false);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-cream-50 min-h-screen py-8">
      <Helmet>
        <title>Our Collections - Suyog Jewelry</title>
        <meta name="description" content="Explore our extensive collection of fine jewelry including rings, necklaces, earrings, and bridal sets." />
      </Helmet>

      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-cream-200 pb-6">
          <h1 className="font-heading text-3xl md:text-4xl text-dark mb-4 md:mb-0">Collections</h1>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Search Input */}
            <form onSubmit={applyFilters} className="relative flex-grow md:w-64">
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search..."
                className="w-full bg-white border border-cream-200 rounded py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-gold-500 transition-colors"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-warm" />
            </form>
            
            {/* Mobile Filter Toggle */}
            <button 
              className="md:hidden flex items-center justify-center p-2 bg-dark text-white rounded"
              onClick={() => setShowFilters(true)}
            >
              <FiFilter />
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside 
            className={`
              fixed md:static inset-0 z-50 bg-white md:bg-transparent p-6 md:p-0 
              transition-transform duration-300 md:translate-x-0 w-full md:w-64 shrink-0 overflow-y-auto
              ${showFilters ? 'translate-x-0' : '-translate-x-full md:transform-none'}
            `}
          >
            <div className="flex justify-between items-center mb-6 md:hidden">
              <h2 className="font-heading text-xl">Filters</h2>
              <button onClick={() => setShowFilters(false)} className="p-2"><FiX size={24} /></button>
            </div>

            <form onSubmit={applyFilters} className="space-y-6">
              {/* Category */}
              <div>
                <h3 className="font-medium mb-3 border-b border-cream-200 pb-2">Category</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-sm hover:text-gold-700">
                    <input type="radio" name="category" value="" checked={filters.category === ''} onChange={handleFilterChange} className="accent-gold-500" />
                    All Categories
                  </label>
                  {categories.map((cat) => (
                    <label key={cat._id} className="flex items-center gap-2 cursor-pointer text-sm hover:text-gold-700">
                      <input type="radio" name="category" value={cat._id} checked={filters.category === cat._id} onChange={handleFilterChange} className="accent-gold-500" />
                      {cat.name}
                    </label>
                  ))}
                </div>
              </div>

              {/* Material */}
              <div>
                <h3 className="font-medium mb-3 border-b border-cream-200 pb-2">Material</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  <label className="flex items-center gap-2 cursor-pointer text-sm hover:text-gold-700">
                    <input type="radio" name="material" value="" checked={filters.material === ''} onChange={handleFilterChange} className="accent-gold-500" />
                    All Materials
                  </label>
                  {materials.map((mat) => (
                    <label key={mat} className="flex items-center gap-2 cursor-pointer text-sm hover:text-gold-700 capitalize">
                      <input type="radio" name="material" value={mat} checked={filters.material === mat} onChange={handleFilterChange} className="accent-gold-500" />
                      {mat}
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-medium mb-3 border-b border-cream-200 pb-2">Price (₹)</h3>
                <div className="flex items-center gap-2">
                  <input type="number" name="minPrice" value={filters.minPrice} onChange={handleFilterChange} placeholder="Min" className="w-full border border-cream-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-gold-500" />
                  <span>-</span>
                  <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} placeholder="Max" className="w-full border border-cream-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-gold-500" />
                </div>
              </div>

              {/* Sort */}
              <div>
                <h3 className="font-medium mb-3 border-b border-cream-200 pb-2">Sort By</h3>
                <select name="sort" value={filters.sort} onChange={handleFilterChange} className="w-full border border-cream-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold-500 bg-white cursor-pointer">
                  <option value="newest">Newest Arrivals</option>
                  <option value="popular">Most Popular</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name: A to Z</option>
                  <option value="name_desc">Name: Z to A</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 pt-4 border-t border-cream-200">
                <button type="submit" className="w-full bg-dark text-white py-2 rounded text-sm uppercase tracking-wider font-medium hover:bg-gold-600 transition-colors">
                  Apply Filters
                </button>
                <button type="button" onClick={clearFilters} className="w-full border border-dark text-dark py-2 rounded text-sm uppercase tracking-wider font-medium hover:bg-cream-100 transition-colors">
                  Clear All
                </button>
              </div>
            </form>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Results summary */}
            <div className="mb-6 text-sm text-gray-warm">
              {loading ? 'Loading...' : `Showing ${products.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0}-${Math.min(pagination.page * pagination.limit, pagination.total)} of ${pagination.total} products`}
            </div>

            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  <AnimatePresence mode="popLayout">
                    {products.map((product) => (
                      <motion.div
                        key={product._id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="mt-12 flex justify-center items-center gap-2">
                    <button 
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="p-2 rounded border border-cream-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gold-100 transition-colors text-dark"
                      aria-label="Previous page"
                    >
                      <FiChevronLeft size={20} />
                    </button>
                    
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                        // Complex logic for showing pages properly... keeping it simple for now
                        let pageNum = i + 1;
                        if (pagination.pages > 5) {
                          if (pagination.page > 3 && pagination.page < pagination.pages - 1) {
                            pageNum = pagination.page - 2 + i;
                          } else if (pagination.page >= pagination.pages - 1) {
                            pageNum = pagination.pages - 4 + i;
                          }
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-10 h-10 rounded transition-colors text-sm font-medium ${
                              pagination.page === pageNum 
                                ? 'bg-gold-500 text-dark' 
                                : 'border border-cream-200 hover:bg-gold-100 text-dark'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button 
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                      className="p-2 rounded border border-cream-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gold-100 transition-colors text-dark"
                      aria-label="Next page"
                    >
                      <FiChevronRight size={20} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-lg border border-cream-200 px-4">
                <div className="w-16 h-16 bg-cream-100 rounded-full flex items-center justify-center text-gray-warm mb-4">
                  <FiSearch size={24} />
                </div>
                <h3 className="font-heading text-xl mb-2">No products found</h3>
                <p className="text-gray-warm mb-6 max-w-md">We couldn't find any products matching your current filters. Try adjusting your search or clearing some filters.</p>
                <button onClick={clearFilters} className="bg-dark text-white px-6 py-2 rounded text-sm uppercase tracking-wider font-medium hover:bg-gold-600 transition-colors">
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
