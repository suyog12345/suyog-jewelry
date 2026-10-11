import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../services/api';
import { compressImage } from '../../utils/compressor';
import ConfirmModal from '../components/ConfirmModal';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiUploadCloud,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiLayers,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add/Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    displayOrder: 0,
    isActive: true,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [saving, setSaving] = useState(false);

  // Delete State
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, category: null });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [safeDeleteError, setSafeDeleteError] = useState('');

  const fetchCategoriesList = async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      if (res.data?.success) {
        setCategories(res.data.data || []);
      }
    } catch (err) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoriesList();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      displayOrder: categories.length,
      isActive: true,
    });
    setSelectedFile(null);
    setPreviewUrl('');
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name || '',
      description: cat.description || '',
      displayOrder: cat.displayOrder ?? 0,
      isActive: Boolean(cat.isActive),
    });
    setSelectedFile(null);
    setPreviewUrl(cat.image?.url || '');
    setModalOpen(true);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file, { maxWidth: 1000, quality: 0.85 });
      setSelectedFile(compressed);
      setPreviewUrl(URL.createObjectURL(compressed));
    } catch (err) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    setSaving(true);
    const toastId = toast.loading(editingCategory ? 'Updating category...' : 'Creating category...');

    try {
      const data = new FormData();
      data.append('name', formData.name.trim());
      data.append('description', formData.description.trim());
      data.append('displayOrder', formData.displayOrder);
      data.append('isActive', String(formData.isActive));

      if (selectedFile) {
        data.append('image', selectedFile);
      }

      let res;
      if (editingCategory) {
        res = await updateCategory(editingCategory._id, data);
      } else {
        res = await createCategory(data);
      }

      if (res.data?.success) {
        toast.success(editingCategory ? 'Category updated!' : 'Category created!', { id: toastId });
        setModalOpen(false);
        fetchCategoriesList();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save category', { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteModal.category) return;
    setDeleteLoading(true);
    setSafeDeleteError('');

    try {
      const res = await deleteCategory(deleteModal.category._id);
      if (res.data?.success) {
        toast.success('Category deleted successfully');
        setDeleteModal({ isOpen: false, category: null });
        fetchCategoriesList();
      }
    } catch (err) {
      // Show API safe-delete error clearly
      const errorMsg = err.message || 'Cannot delete category';
      setSafeDeleteError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Manage Categories - Suyog Jewelry Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-100">Product Categories</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Organize and classify collections shown in the storefront navigation and filters.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 text-xs sm:text-sm transition-all cursor-pointer"
        >
          <FiPlus size={18} />
          <span>Add Category</span>
        </button>
      </div>

      {/* Safe-delete alert notice if active */}
      {safeDeleteError && (
        <div className="bg-red-950/40 border border-red-700 text-red-200 p-4 rounded-xl flex items-start justify-between gap-3 animate-fadeIn">
          <div className="flex items-start gap-3">
            <FiAlertCircle className="text-red-400 shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-bold text-sm text-red-300">Action Prevented: Safe Delete</h4>
              <p className="text-xs text-red-200 mt-0.5">{safeDeleteError}</p>
            </div>
          </div>
          <button
            onClick={() => setSafeDeleteError('')}
            className="text-red-400 hover:text-red-200 p-1"
          >
            <FiX size={18} />
          </button>
        </div>
      )}

      {/* Category List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-slate-400 space-y-3">
            <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <FiLayers size={32} className="mx-auto text-slate-600" />
            <p className="text-sm text-slate-300">No categories created yet.</p>
            <button
              onClick={openAddModal}
              className="text-xs font-semibold text-amber-400 hover:underline cursor-pointer"
            >
              + Create your first category
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                    {cat.image?.url ? (
                      <img src={cat.image.url} alt={cat.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600">
                        <FiLayers size={20} />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-bold text-base text-slate-100">{cat.name}</h3>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          cat.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {cat.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{cat.description || 'No description'}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1.5">
                      <span>Order: #{cat.displayOrder ?? 0}</span>
                      <span>•</span>
                      <span className="text-amber-400 font-medium">
                        {cat.productCount ?? 0} product(s) linked
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-amber-400 hover:bg-slate-700 transition-colors cursor-pointer text-xs flex items-center gap-1.5 px-3"
                  >
                    <FiEdit2 size={14} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      setSafeDeleteError('');
                      setDeleteModal({ isOpen: true, category: cat });
                    }}
                    className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer text-xs flex items-center gap-1.5 px-3"
                  >
                    <FiTrash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 z-10 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <h3 className="font-heading text-lg font-bold text-slate-100">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Bridal Necklaces, Solitaire Rings"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description for category banner and SEO..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none"
                  />
                </div>

                <div className="flex items-end pb-1.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-0 w-4 h-4"
                    />
                    <span className="text-xs font-medium text-slate-200">Active (Visible)</span>
                  </label>
                </div>
              </div>

              {/* Image upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Category Image
                </label>
                <div className="flex items-center gap-4">
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-16 h-16 rounded-xl object-cover bg-slate-950 border border-slate-800 shrink-0"
                    />
                  )}
                  <label className="flex-1 border-2 border-dashed border-slate-800 hover:border-amber-500/50 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-950/40">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <FiUploadCloud size={20} className="mx-auto text-amber-400 mb-1" />
                    <span className="text-xs text-slate-300 block">
                      {selectedFile ? selectedFile.name : 'Choose category photo'}
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-slate-200 text-xs sm:text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {saving && <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>}
                  <span>{editingCategory ? 'Save Changes' : 'Create Category'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Category?"
        message={`Are you sure you want to delete "${deleteModal.category?.name}"? If any products still belong to this category, deletion will be blocked by safe-delete.`}
        confirmText="Confirm Delete"
        isLoading={deleteLoading}
        onConfirm={handleDeleteCategory}
        onClose={() => setDeleteModal({ isOpen: false, category: null })}
      />
    </div>
  );
};

export default CategoriesList;
