import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
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
  FiArrowUp,
  FiArrowDown,
  FiImage,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const BannersList = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add / Edit Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    link: '',
    buttonText: 'Explore Collection',
    displayOrder: 0,
    isActive: true,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [saving, setSaving] = useState(false);

  // Delete State
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, banner: null });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchBannersList = async () => {
    setLoading(true);
    try {
      const res = await getBanners();
      if (res.data?.success) {
        setBanners(res.data.data || []);
      }
    } catch (err) {
      toast.error('Failed to load hero banners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBannersList();
  }, []);

  const openAddModal = () => {
    setEditingBanner(null);
    setFormData({
      title: '',
      subtitle: '',
      link: '/products',
      buttonText: 'Explore Collection',
      displayOrder: banners.length,
      isActive: true,
    });
    setSelectedFile(null);
    setPreviewUrl('');
    setModalOpen(true);
  };

  const openEditModal = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      link: banner.link || '',
      buttonText: banner.buttonText || 'Explore Collection',
      displayOrder: banner.displayOrder ?? 0,
      isActive: Boolean(banner.isActive),
    });
    setSelectedFile(null);
    setPreviewUrl(banner.image?.url || '');
    setModalOpen(true);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file, { maxWidth: 1920, maxHeight: 1080, quality: 0.85 });
      setSelectedFile(compressed);
      setPreviewUrl(URL.createObjectURL(compressed));
    } catch (err) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveBanner = async (e) => {
    e.preventDefault();

    if (!editingBanner && !selectedFile) {
      toast.error('Banner image is required');
      return;
    }

    setSaving(true);
    const toastId = toast.loading(editingBanner ? 'Updating banner...' : 'Creating banner...');

    try {
      const data = new FormData();
      data.append('title', formData.title.trim());
      data.append('subtitle', formData.subtitle.trim());
      data.append('link', formData.link.trim());
      data.append('buttonText', formData.buttonText.trim());
      data.append('displayOrder', formData.displayOrder);
      data.append('isActive', String(formData.isActive));

      if (selectedFile) {
        data.append('image', selectedFile);
      }

      let res;
      if (editingBanner) {
        res = await updateBanner(editingBanner._id, data);
      } else {
        res = await createBanner(data);
      }

      if (res.data?.success) {
        toast.success(editingBanner ? 'Banner updated!' : 'Banner created!', { id: toastId });
        setModalOpen(false);
        fetchBannersList();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save banner', { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  // Reorder banner by swapping order values
  const handleReorder = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= banners.length) return;

    const currentBanner = banners[index];
    const targetBanner = banners[targetIndex];

    const toastId = toast.loading('Reordering banners...');
    try {
      // Swap displayOrder values
      const currentOrder = currentBanner.displayOrder ?? index;
      const targetOrder = targetBanner.displayOrder ?? targetIndex;

      const fData1 = new FormData();
      fData1.append('displayOrder', targetOrder);
      const fData2 = new FormData();
      fData2.append('displayOrder', currentOrder);

      await Promise.all([
        updateBanner(currentBanner._id, fData1),
        updateBanner(targetBanner._id, fData2),
      ]);

      toast.success('Banners reordered!', { id: toastId });
      fetchBannersList();
    } catch (err) {
      toast.error('Failed to reorder banners', { id: toastId });
    }
  };

  const handleDeleteBanner = async () => {
    if (!deleteModal.banner) return;
    setDeleteLoading(true);

    try {
      const res = await deleteBanner(deleteModal.banner._id);
      if (res.data?.success) {
        toast.success('Banner deleted');
        setDeleteModal({ isOpen: false, banner: null });
        fetchBannersList();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete banner');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Hero Banners - Suyog Jewelry Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-100">Hero Banners</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage the full-screen hero sliders displayed on the homepage.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 text-xs sm:text-sm transition-all cursor-pointer"
        >
          <FiPlus size={18} />
          <span>Add Hero Banner</span>
        </button>
      </div>

      {/* Banners List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-slate-400 space-y-3 bg-slate-900 rounded-2xl border border-slate-800">
            <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm">Loading hero banners...</p>
          </div>
        ) : banners.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3 bg-slate-900 rounded-2xl border border-slate-800">
            <FiImage size={32} className="mx-auto text-slate-600" />
            <p className="text-sm text-slate-300">No hero banners created yet.</p>
            <button
              onClick={openAddModal}
              className="text-xs font-semibold text-amber-400 hover:underline cursor-pointer"
            >
              + Create your first banner
            </button>
          </div>
        ) : (
          banners.map((banner, idx) => (
            <div
              key={banner._id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row group"
            >
              {/* Banner Visual Preview */}
              <div className="relative md:w-80 h-44 md:h-auto bg-slate-950 shrink-0 overflow-hidden">
                <img
                  src={banner.image?.url || '/placeholder.jpg'}
                  alt={banner.title || 'Banner'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-950/40"></div>
                <div className="absolute top-2 left-2 flex gap-1">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold shadow ${
                      banner.isActive
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {banner.isActive ? 'Active' : 'Disabled'}
                  </span>
                  <span className="text-[10px] bg-slate-900/80 text-amber-400 px-2 py-0.5 rounded-full font-bold">
                    #{idx + 1}
                  </span>
                </div>
              </div>

              {/* Banner Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-100">
                    {banner.title || '(No title)'}
                  </h3>
                  {banner.subtitle && (
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{banner.subtitle}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-3">
                    <span>
                      Target: <strong className="text-slate-300">{banner.link || '—'}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Button: <strong className="text-amber-400">{banner.buttonText || '—'}</strong>
                    </span>
                  </div>
                </div>

                {/* Actions & Reordering */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800/80">
                  {/* Reorder Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleReorder(idx, -1)}
                      title="Move Up"
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-amber-400 disabled:opacity-30 cursor-pointer"
                    >
                      <FiArrowUp size={16} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === banners.length - 1}
                      onClick={() => handleReorder(idx, 1)}
                      title="Move Down"
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-amber-400 disabled:opacity-30 cursor-pointer"
                    >
                      <FiArrowDown size={16} />
                    </button>
                    <span className="text-[11px] text-slate-500 ml-2">Reorder position</span>
                  </div>

                  {/* Edit & Delete */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(banner)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-amber-400 text-xs flex items-center gap-1.5 font-medium cursor-pointer"
                    >
                      <FiEdit2 size={13} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setDeleteModal({ isOpen: true, banner })}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 text-xs flex items-center gap-1.5 font-medium cursor-pointer"
                    >
                      <FiTrash2 size={13} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Banner Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 z-10 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <h3 className="font-heading text-lg font-bold text-slate-100">
                {editingBanner ? 'Edit Hero Banner' : 'Create Hero Banner'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Main Headline / Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Handcrafted Royal Heirlooms"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Subtitle / Tagline
                </label>
                <textarea
                  rows={2}
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. Discover timeless 22K gold & certified diamond bridal jewelry..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Click Link / Route
                  </label>
                  <input
                    type="text"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="/products or /products?category=..."
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    placeholder="Explore Collection"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 items-center">
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

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="isActiveBanner"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="isActiveBanner" className="text-xs font-medium text-slate-200 cursor-pointer">
                    Active (Show in Slider)
                  </label>
                </div>
              </div>

              {/* Image upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  High-Resolution Banner Image {!editingBanner && '*'}
                </label>
                <div className="space-y-3">
                  {previewUrl && (
                    <div className="h-32 rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <label className="border-2 border-dashed border-slate-800 hover:border-amber-500/50 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-950/40 block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <FiUploadCloud size={20} className="mx-auto text-amber-400 mb-1" />
                    <span className="text-xs text-slate-300 block">
                      {selectedFile ? selectedFile.name : 'Select 1920x800 banner image'}
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
                  <span>{editingBanner ? 'Save Changes' : 'Create Banner'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Hero Banner?"
        message={`Are you sure you want to delete this banner? It will be permanently removed from the home hero slider and Cloudinary.`}
        confirmText="Confirm Delete"
        isLoading={deleteLoading}
        onConfirm={handleDeleteBanner}
        onClose={() => setDeleteModal({ isOpen: false, banner: null })}
      />
    </div>
  );
};

export default BannersList;
