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
    <div className="bg-white min-h-screen py-12 md:py-20 lg:py-24">
      <Helmet>
        <title>Our Collections - Suyog Jewelry</title>
        <meta name="description" content="Explore our extensive collection of fine jewelry including rings, necklaces, earrings, and bridal sets." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12">
        {/* Header Strip */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 pb-8 border-b border-[#E5E5E5] gap-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#6B6B6B] font-medium block mb-2">
              Catalog & Archive
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-[#111111] font-light">
              Collections
            </h1>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Search Input */}
            <form onSubmit={applyFilters} className="relative flex-grow md:w-72">
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search pieces..."
                className="w-full bg-[#F7F7F7] border border-[#E5E5E5] py-2.5 pl-10 pr-4 text-xs tracking-wider placeholder-[#9E9E9E] focus:outline-none focus:border-[#111111] focus:bg-white transition-colors"
              />
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B6B6B]" size={14} />
            </form>
            
            {/* Mobile Filter Toggle Button */}
            <button 
              className="md:hidden flex items-center gap-2 px-4 py-2.5 bg-[#111111] text-white text-xs uppercase tracking-wider font-medium"
              onClick={() => setShowFilters(true)}
            >
              <FiFilter size={14} />
              <span>Filters</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-10 lg:gap-14">
          {/* Filters Sidebar */}
          <aside 
            className={`
              fixed md:static inset-0 z-50 bg-white md:bg-transparent p-6 md:p-0 
              transition-transform duration-300 md:translate-x-0 w-full md:w-64 shrink-0 overflow-y-auto
              ${showFilters ? 'translate-x-0' : '-translate-x-full md:transform-none'}
            `}
          >
            <div className="flex justify-between items-center mb-8 md:hidden border-b border-[#E5E5E5] pb-4">
              <h2 className="font-heading text-2xl font-light">Filters</h2>
              <button onClick={() => setShowFilters(false)} className="p-1"><FiX size={24} /></button>
            </div>

            <form onSubmit={applyFilters} className="space-y-8">
              {/* Category */}
              <div>
                <h3 className="font-body text-xs font-medium uppercase tracking-[0.2em] text-[#111111] mb-4 pb-2 border-b border-[#E5E5E5]">
                  Category
                </h3>
                <div className="space-y-2.5">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs text-[#6B6B6B] hover:text-[#111111] transition-colors">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={filters.category === ''}
                      onChange={handleFilterChange}
                      className="accent-[#111111]"
                    />
                    <span>All Categories</span>
                  </label>
                  {categories.map((cat) => (
                    <label key={cat._id} className="flex items-center gap-2.5 cursor-pointer text-xs text-[#6B6B6B] hover:text-[#111111] transition-colors">
                      <input
                        type="radio"
                        name="category"
                        value={cat._id}
                        checked={filters.category === cat._id}
                        onChange={handleFilterChange}
                        className="accent-[#111111]"
                      />
                      <span>{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Material */}
              <div>
                <h3 className="font-body text-xs font-medium uppercase tracking-[0.2em] text-[#111111] mb-4 pb-2 border-b border-[#E5E5E5]">
                  Material
                </h3>
                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-2">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs text-[#6B6B6B] hover:text-[#111111] transition-colors">
                    <input
                      type="radio"
                      name="material"
                      value=""
                      checked={filters.material === ''}
                      onChange={handleFilterChange}
                      className="accent-[#111111]"
                    />
                    <span>All Materials</span>
                  </label>
                  {materials.map((mat) => (
                    <label key={mat} className="flex items-center gap-2.5 cursor-pointer text-xs text-[#6B6B6B] hover:text-[#111111] capitalize transition-colors">
                      <input
                        type="radio"
                        name="material"
                        value={mat}
                        checked={filters.material === mat}
                        onChange={handleFilterChange}
                        className="accent-[#111111]"
                      />
                      <span>{mat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-body text-xs font-medium uppercase tracking-[0.2em] text-[#111111] mb-4 pb-2 border-b border-[#E5E5E5]">
                  Price Range (₹)
                </h3>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    placeholder="Min"
                    className="w-full bg-[#F7F7F7] border border-[#E5E5E5] px-3 py-2 text-xs focus:outline-none focus:border-[#111111] focus:bg-white transition-colors"
                  />
                  <span className="text-[#9E9E9E]">&ndash;</span>
                  <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    placeholder="Max"
                    className="w-full bg-[#F7F7F7] border border-[#E5E5E5] px-3 py-2 text-xs focus:outline-none focus:border-[#111111] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Sort */}
              <div>
                <h3 className="font-body text-xs font-medium uppercase tracking-[0.2em] text-[#111111] mb-4 pb-2 border-b border-[#E5E5E5]">
                  Sort By
                </h3>
                <select
                  name="sort"
                  value={filters.sort}
                  onChange={handleFilterChange}
                  className="w-full bg-[#F7F7F7] border border-[#E5E5E5] px-3 py-2.5 text-xs text-[#111111] focus:outline-none focus:border-[#111111] focus:bg-white cursor-pointer"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="popular">Most Enquired</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name: A to Z</option>
                  <option value="name_desc">Name: Z to A</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-4 border-t border-[#E5E5E5]">
                <button
                  type="submit"
                  className="w-full bg-[#111111] text-white border border-[#111111] py-3 text-xs uppercase tracking-[0.2em] font-medium hover:bg-white hover:text-[#111111] transition-all duration-300"
                >
                  Apply Filters
                </button>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="w-full bg-white text-[#111111] border border-[#E5E5E5] py-3 text-xs uppercase tracking-[0.2em] font-medium hover:border-[#111111] transition-all duration-300"
                >
                  Clear All
                </button>
              </div>
            </form>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Results Counter */}
            <div className="mb-8 text-xs text-[#6B6B6B] uppercase tracking-wider flex justify-between items-center">
              <span>
                {loading ? 'Discovering pieces...' : `Showing ${products.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0}–${Math.min(pagination.page * pagination.limit, pagination.total)} of ${pagination.total} creations`}
              </span>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                  <AnimatePresence mode="popLayout">
                    {products.map((product) => (
                      <motion.div
                        key={product._id}
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Minimal Pagination */}
                {pagination.pages > 1 && (
                  <div className="mt-16 pt-10 border-t border-[#E5E5E5] flex justify-center items-center gap-2">
                    <button 
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="p-2.5 border border-[#E5E5E5] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#111111] transition-colors text-[#111111]"
                      aria-label="Previous page"
                    >
                      <FiChevronLeft size={16} />
                    </button>
                    
                    <div className="flex gap-1.5">
                      {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
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
                            className={`w-9 h-9 text-xs uppercase tracking-wider font-medium transition-all ${
                              pagination.page === pageNum 
                                ? 'bg-[#111111] text-white border border-[#111111]' 
                                : 'bg-white border border-[#E5E5E5] text-[#111111] hover:border-[#111111]'
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
                      className="p-2.5 border border-[#E5E5E5] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#111111] transition-colors text-[#111111]"
                      aria-label="Next page"
                    >
                      <FiChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center bg-[#F7F7F7] border border-[#E5E5E5] px-6">
                <div className="w-12 h-12 border border-[#CCCCCC] flex items-center justify-center text-[#6B6B6B] mb-5">
                  <FiSearch size={18} />
                </div>
                <h3 className="font-heading text-2xl font-light text-[#111111] mb-2">No Pieces Found</h3>
                <p className="text-[#6B6B6B] text-xs leading-relaxed mb-6 max-w-sm">
                  We could not find any creations matching your active filter selections.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-[#111111] text-white border border-[#111111] hover:bg-white hover:text-[#111111] px-7 py-3 text-xs uppercase tracking-[0.2em] font-medium transition-all"
                >
                  Reset All Filters
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
