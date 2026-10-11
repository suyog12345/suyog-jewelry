import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  getProducts,
  getCategories,
  deleteProduct,
  bulkActionProducts,
} from '../../services/api';
import { formatPrice } from '../../utils';
import ConfirmModal from '../components/ConfirmModal';
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiStar,
  FiCheckSquare,
  FiSquare,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const ProductsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  // Filters state from URL
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [status, setStatus] = useState(searchParams.get('status') || ''); // 'active', 'draft', 'featured'
  const [stockStatus, setStockStatus] = useState(searchParams.get('stockStatus') || '');
  const page = parseInt(searchParams.get('page') || '1', 10);

  // Selection for bulk actions
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals state
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, product: null, isBulk: false });
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await getCategories();
        if (res.data?.success) setCategories(res.data.data);
      } catch (err) {
        // silent
      }
    };
    fetchCats();
  }, []);

  // Fetch products when query params change
  const fetchProductList = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 15,
        search: search || undefined,
        category: category || undefined,
        stockStatus: stockStatus || undefined,
      };

      if (status === 'active') params.active = 'true';
      if (status === 'draft') params.active = 'false';
      if (status === 'featured') params.featured = 'true';

      const res = await getProducts(params);
      if (res.data?.success) {
        setProducts(res.data.data || []);
        if (res.data.pagination) setPagination(res.data.pagination);
      }
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [page, search, category, status, stockStatus]);

  useEffect(() => {
    fetchProductList();
    setSelectedIds([]);
  }, [fetchProductList]);

  // Update URL params on filter submit
  const handleApplyFilters = (e) => {
    if (e) e.preventDefault();
    const newParams = new URLSearchParams();
    if (search) newParams.set('search', search);
    if (category) newParams.set('category', category);
    if (status) newParams.set('status', status);
    if (stockStatus) newParams.set('stockStatus', stockStatus);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('');
    setStatus('');
    setStockStatus('');
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Selection handlers
  const handleToggleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map((p) => p._id));
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Single delete trigger
  const confirmDeleteSingle = (product) => {
    setDeleteModal({
      isOpen: true,
      product,
      isBulk: false,
    });
  };

  // Bulk action handler
  const handleBulkAction = async (action) => {
    if (selectedIds.length === 0) return;

    if (action === 'delete') {
      setDeleteModal({
        isOpen: true,
        product: null,
        isBulk: true,
      });
      return;
    }

    setActionLoading(true);
    try {
      const res = await bulkActionProducts({ ids: selectedIds, action });
      if (res.data?.success) {
        toast.success(`Updated ${selectedIds.length} products`);
        setSelectedIds([]);
        fetchProductList();
      }
    } catch (err) {
      toast.error(err.message || 'Bulk action failed');
    } finally {
      setActionLoading(false);
    }
  };

  // Confirm delete execution (single or bulk)
  const executeDelete = async () => {
    setActionLoading(true);
    try {
      if (deleteModal.isBulk) {
        const res = await bulkActionProducts({ ids: selectedIds, action: 'delete' });
        if (res.data?.success) {
          toast.success(`Deleted ${selectedIds.length} products`);
          setSelectedIds([]);
        }
      } else if (deleteModal.product) {
        const res = await deleteProduct(deleteModal.product._id);
        if (res.data?.success) {
          toast.success('Product deleted successfully');
        }
      }
      setDeleteModal({ isOpen: false, product: null, isBulk: false });
      fetchProductList();
    } catch (err) {
      toast.error(err.message || 'Failed to delete product(s)');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Manage Products - Suyog Jewelry Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-100">Products Catalog</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your jewelry pieces, prices, visibility, and stock statuses.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 text-xs sm:text-sm transition-all"
        >
          <FiPlus size={18} />
          <span>New Product</span>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
        <form onSubmit={handleApplyFilters} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search input */}
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 pl-9 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="active">Active (Visible)</option>
              <option value="draft">Draft (Hidden)</option>
              <option value="featured">Featured Only</option>
            </select>
          </div>

          {/* Stock Status Filter */}
          <div>
            <select
              value={stockStatus}
              onChange={(e) => setStockStatus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="">All Stock Types</option>
              <option value="in-stock">In Stock</option>
              <option value="made-to-order">Made to Order</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2 px-3 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Filter
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              title="Reset Filters"
              className="p-2 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              <FiRefreshCw size={15} />
            </button>
          </div>
        </form>
      </div>

      {/* Bulk Actions Floating Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-slate-950 font-bold text-xs px-2.5 py-1 rounded-lg">
              {selectedIds.length} Selected
            </span>
            <span className="text-xs text-amber-300 hidden sm:inline">Choose a bulk action:</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkAction('feature')}
              disabled={actionLoading}
              className="bg-slate-900 border border-slate-700 hover:border-amber-500 text-slate-200 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
            >
              <FiStar size={13} className="text-amber-400" />
              <span>Feature</span>
            </button>
            <button
              onClick={() => handleBulkAction('show')}
              disabled={actionLoading}
              className="bg-slate-900 border border-slate-700 hover:border-emerald-500 text-slate-200 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
            >
              <FiEye size={13} className="text-emerald-400" />
              <span>Show</span>
            </button>
            <button
              onClick={() => handleBulkAction('hide')}
              disabled={actionLoading}
              className="bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-200 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
            >
              <FiEyeOff size={13} className="text-slate-400" />
              <span>Hide</span>
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              disabled={actionLoading}
              className="bg-red-500/20 border border-red-500/40 hover:bg-red-500/30 text-red-300 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
            >
              <FiTrash2 size={13} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}

      {/* Product List: Desktop Table & Mobile Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-slate-400 space-y-4">
            <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm">Loading products catalog...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <p className="text-base text-slate-300">No products found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search criteria or create a new piece for your collection.
            </p>
            <Link
              to="/admin/products/new"
              className="inline-block mt-2 text-xs font-semibold text-amber-400 hover:underline"
            >
              + Create Product
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="p-4 w-10 text-center">
                      <button
                        type="button"
                        onClick={handleToggleSelectAll}
                        className="text-slate-400 hover:text-amber-400 cursor-pointer"
                      >
                        {selectedIds.length === products.length && products.length > 0 ? (
                          <FiCheckSquare className="text-amber-400" size={17} />
                        ) : (
                          <FiSquare size={17} />
                        )}
                      </button>
                    </th>
                    <th className="p-4">Product</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Material / Purity</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {products.map((p) => {
                    const isSelected = selectedIds.includes(p._id);
                    return (
                      <tr
                        key={p._id}
                        className={`hover:bg-slate-800/40 transition-colors ${
                          isSelected ? 'bg-amber-500/5' : ''
                        }`}
                      >
                        <td className="p-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleSelect(p._id)}
                            className="text-slate-400 hover:text-amber-400 cursor-pointer"
                          >
                            {isSelected ? (
                              <FiCheckSquare className="text-amber-400" size={17} />
                            ) : (
                              <FiSquare size={17} />
                            )}
                          </button>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.images?.[0]?.url || '/placeholder.jpg'}
                              alt={p.name}
                              className="w-12 h-12 rounded-lg object-cover bg-slate-800 shrink-0 border border-slate-800"
                            />
                            <div>
                              <Link
                                to={`/admin/products/${p._id}/edit`}
                                className="font-medium text-slate-200 hover:text-amber-400 transition-colors block line-clamp-1"
                              >
                                {p.name}
                              </Link>
                              <div className="flex items-center gap-2 mt-1">
                                {p.isFeatured && (
                                  <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded font-medium">
                                    ★ Featured
                                  </span>
                                )}
                                {p.isNewArrival && (
                                  <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded font-medium">
                                    New
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-slate-400">{p.category?.name || '—'}</td>
                        <td className="p-4 font-medium text-slate-200">
                          {p.priceOnRequest ? (
                            <span className="text-xs text-amber-400 italic">Price on request</span>
                          ) : (
                            formatPrice(p.price)
                          )}
                        </td>
                        <td className="p-4 text-slate-400 capitalize">
                          {p.material} {p.purity ? `(${p.purity})` : ''}
                        </td>
                        <td className="p-4">
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                              p.stockStatus === 'in-stock'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : p.stockStatus === 'made-to-order'
                                ? 'bg-sky-500/10 text-sky-400'
                                : 'bg-red-500/10 text-red-400'
                            }`}
                          >
                            {p.stockStatus.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                              p.isActive
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {p.isActive ? 'Active' : 'Draft'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/admin/products/${p._id}/edit`}
                              title="Edit product"
                              className="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                            >
                              <FiEdit2 size={16} />
                            </Link>
                            <button
                              type="button"
                              onClick={() => confirmDeleteSingle(p)}
                              title="Delete product"
                              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View (Optimized for phone screens!) */}
            <div className="lg:hidden divide-y divide-slate-800/80">
              {products.map((p) => {
                const isSelected = selectedIds.includes(p._id);
                return (
                  <div
                    key={p._id}
                    className={`p-4 space-y-3 transition-colors ${
                      isSelected ? 'bg-amber-500/5' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => handleToggleSelect(p._id)}
                        className="mt-1 text-slate-400 hover:text-amber-400 cursor-pointer"
                      >
                        {isSelected ? (
                          <FiCheckSquare className="text-amber-400" size={18} />
                        ) : (
                          <FiSquare size={18} />
                        )}
                      </button>

                      <img
                        src={p.images?.[0]?.url || '/placeholder.jpg'}
                        alt={p.name}
                        className="w-16 h-16 rounded-xl object-cover bg-slate-800 shrink-0 border border-slate-800"
                      />

                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/admin/products/${p._id}/edit`}
                          className="font-medium text-slate-100 text-sm line-clamp-1 hover:text-amber-400"
                        >
                          {p.name}
                        </Link>
                        <p className="text-xs text-slate-400 mt-0.5">{p.category?.name || 'Uncategorized'}</p>
                        <p className="text-sm font-bold text-amber-400 mt-1">
                          {p.priceOnRequest ? 'Price on request' : formatPrice(p.price)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            p.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {p.isActive ? 'Active' : 'Draft'}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            p.stockStatus === 'in-stock'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-sky-500/10 text-sky-400'
                          }`}
                        >
                          {p.stockStatus.replace('-', ' ')}
                        </span>
                        {p.isFeatured && (
                          <span className="text-[10px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded">
                            ★
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/products/${p._id}/edit`}
                          className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-amber-400 text-xs font-medium"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => confirmDeleteSingle(p)}
                          className="p-1 text-slate-400 hover:text-red-400"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Pagination Strip */}
        {pagination.pages > 1 && (
          <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div>
              Showing {products.length} of {pagination.total} products
            </div>
            <div className="flex items-center gap-1">
              <button
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
                className="p-2 rounded-lg border border-slate-800 hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
              >
                <FiChevronLeft size={16} />
              </button>
              <span className="px-3 py-1 font-semibold text-slate-200">
                {page} / {pagination.pages}
              </span>
              <button
                disabled={page >= pagination.pages}
                onClick={() => handlePageChange(page + 1)}
                className="p-2 rounded-lg border border-slate-800 hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title={deleteModal.isBulk ? `Delete ${selectedIds.length} Products?` : 'Delete Product?'}
        message={
          deleteModal.isBulk
            ? `Are you sure you want to delete ${selectedIds.length} products? Their images will be permanently removed from Cloudinary.`
            : `Are you sure you want to delete "${deleteModal.product?.name}"? This action cannot be undone.`
        }
        confirmText="Delete Permanently"
        isLoading={actionLoading}
        onConfirm={executeDelete}
        onClose={() => setDeleteModal({ isOpen: false, product: null, isBulk: false })}
      />
    </div>
  );
};

export default ProductsList;
