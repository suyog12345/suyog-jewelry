import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  getProduct,
  createProduct,
  updateProduct,
  getCategories,
} from '../../services/api';
import { compressImage } from '../../utils/compressor';
import {
  FiArrowLeft,
  FiUploadCloud,
  FiX,
  FiCheck,
  FiTrash2,
  FiArrowUp,
  FiArrowDown,
  FiImage,
  FiInfo,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const MATERIALS = [
  { value: 'gold', label: 'Gold' },
  { value: 'silver', label: 'Silver' },
  { value: 'diamond', label: 'Diamond' },
  { value: 'platinum', label: 'Platinum' },
  { value: 'kundan', label: 'Kundan' },
  { value: 'polki', label: 'Polki' },
  { value: 'meenakari', label: 'Meenakari' },
  { value: 'imitation', label: 'Imitation' },
  { value: 'artificial', label: 'Artificial' },
  { value: 'other', label: 'Other' },
];

const OCCASIONS = ['wedding', 'engagement', 'daily-wear', 'festive', 'bridal', 'gifting'];

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const fileInputRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [compressing, setCompressing] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    priceOnRequest: false,
    category: '',
    material: 'gold',
    weight: '',
    purity: '22K',
    sizesText: '',
    tagsText: '',
    occasion: [],
    stockStatus: 'in-stock',
    isFeatured: false,
    isNewArrival: false,
    isActive: true,
    seoTitle: '',
    seoDescription: '',
  });

  // Image states:
  // existingImages: array of { _id, url, publicId, order }
  const [existingImages, setExistingImages] = useState([]);
  // deleteImages: array of publicId strings to delete from Cloudinary
  const [deleteImages, setDeleteImages] = useState([]);
  // newFiles: array of { file, previewUrl }
  const [newFiles, setNewFiles] = useState([]);

  // Load categories and product data if editing
  useEffect(() => {
    const init = async () => {
      try {
        const catRes = await getCategories();
        if (catRes.data?.success) {
          setCategories(catRes.data.data);
          if (!isEdit && catRes.data.data.length > 0) {
            setFormData((prev) => ({ ...prev, category: catRes.data.data[0]._id }));
          }
        }

        if (isEdit) {
          const prodRes = await getProduct(id);
          if (prodRes.data?.success && prodRes.data.data) {
            const p = prodRes.data.data;
            setFormData({
              name: p.name || '',
              description: p.description || '',
              price: p.price !== null && p.price !== undefined ? p.price.toString() : '',
              priceOnRequest: Boolean(p.priceOnRequest),
              category: p.category?._id || p.category || '',
              material: p.material || 'gold',
              weight: p.weight || '',
              purity: p.purity || '',
              sizesText: p.sizes?.join(', ') || '',
              tagsText: p.tags?.join(', ') || '',
              occasion: p.occasion || [],
              stockStatus: p.stockStatus || 'in-stock',
              isFeatured: Boolean(p.isFeatured),
              isNewArrival: Boolean(p.isNewArrival),
              isActive: Boolean(p.isActive),
              seoTitle: p.seoTitle || '',
              seoDescription: p.seoDescription || '',
            });
            setExistingImages(p.images || []);
          }
        }
      } catch (err) {
        toast.error('Failed to load product details');
        navigate('/admin/products');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleOccasionToggle = (occ) => {
    setFormData((prev) => ({
      ...prev,
      occasion: prev.occasion.includes(occ)
        ? prev.occasion.filter((item) => item !== occ)
        : [...prev.occasion, occ],
    }));
  };

  // Image Selection & Compression Handler
  const handleFilesSelected = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const totalAllowed = 10;
    const currentCount = existingImages.length + newFiles.length;
    if (currentCount + files.length > totalAllowed) {
      toast.error(`You can upload a maximum of ${totalAllowed} images total (currently ${currentCount}).`);
      return;
    }

    setCompressing(true);
    const toastId = toast.loading('Compressing images for faster mobile upload...');

    try {
      const compressedList = [];
      for (const file of files) {
        const compressed = await compressImage(file, { maxWidth: 1920, quality: 0.82 });
        compressedList.push({
          file: compressed,
          previewUrl: URL.createObjectURL(compressed),
        });
      }

      setNewFiles((prev) => [...prev, ...compressedList]);
      toast.success(`Prepared ${compressedList.length} image(s)`, { id: toastId });
    } catch (err) {
      toast.error('Error optimizing images', { id: toastId });
    } finally {
      setCompressing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Remove an existing image
  const handleRemoveExistingImage = (indexToRemove) => {
    const target = existingImages[indexToRemove];
    if (target.publicId) {
      setDeleteImages((prev) => [...prev, target.publicId]);
    }
    setExistingImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Remove a newly selected file
  const handleRemoveNewFile = (indexToRemove) => {
    setNewFiles((prev) => {
      const target = prev[indexToRemove];
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((_, idx) => idx !== indexToRemove);
    });
  };

  // Reorder existing images (move up/down)
  const handleMoveExisting = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= existingImages.length) return;

    setExistingImages((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  // Reorder new files
  const handleMoveNew = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newFiles.length) return;

    setNewFiles((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return;
    }
    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }
    if (!formData.priceOnRequest && (!formData.price || Number(formData.price) < 0)) {
      toast.error('Please provide a valid price or check "Price on request"');
      return;
    }

    const totalImagesCount = existingImages.length + newFiles.length;
    if (totalImagesCount === 0) {
      toast.error('Please upload at least one image of the jewelry piece');
      return;
    }

    setSaving(true);
    const toastId = toast.loading(isEdit ? 'Saving product changes...' : 'Creating product...');

    try {
      const data = new FormData();

      // Basic fields
      data.append('name', formData.name.trim());
      data.append('description', formData.description.trim());
      data.append('category', formData.category);
      data.append('material', formData.material);
      data.append('stockStatus', formData.stockStatus);
      data.append('priceOnRequest', String(formData.priceOnRequest));

      if (formData.priceOnRequest) {
        data.append('price', '');
      } else {
        data.append('price', formData.price);
      }

      if (formData.weight) data.append('weight', formData.weight.trim());
      if (formData.purity) data.append('purity', formData.purity.trim());
      if (formData.seoTitle) data.append('seoTitle', formData.seoTitle.trim());
      if (formData.seoDescription) data.append('seoDescription', formData.seoDescription.trim());

      // Booleans
      data.append('isFeatured', String(formData.isFeatured));
      data.append('isNewArrival', String(formData.isNewArrival));
      data.append('isActive', String(formData.isActive));

      // Arrays parsed as JSON strings
      const sizesArray = formData.sizesText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      data.append('sizes', JSON.stringify(sizesArray));

      const tagsArray = formData.tagsText
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      data.append('tags', JSON.stringify(tagsArray));

      data.append('occasion', JSON.stringify(formData.occasion));

      // Edit specific: deleteImages & imageOrder
      if (isEdit) {
        if (deleteImages.length > 0) {
          data.append('deleteImages', JSON.stringify(deleteImages));
        }

        // imageOrder: maps each remaining existing image to its new order index
        const imageOrderMap = existingImages.map((img, idx) => ({
          imageId: img._id,
          order: idx,
        }));
        data.append('imageOrder', JSON.stringify(imageOrderMap));
      }

      // Append new compressed image files
      newFiles.forEach((item) => {
        data.append('images', item.file);
      });

      let res;
      if (isEdit) {
        res = await updateProduct(id, data);
      } else {
        res = await createProduct(data);
      }

      if (res.data?.success) {
        toast.success(isEdit ? 'Product updated successfully!' : 'Product created successfully!', {
          id: toastId,
        });
        navigate('/admin/products');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save product', { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 space-y-4">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Helmet>
        <title>{isEdit ? 'Edit Product' : 'Add New Product'} - Suyog Jewelry Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
            title="Back to Products"
          >
            <FiArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="font-heading text-xl sm:text-2xl font-bold text-slate-100">
              {isEdit ? 'Edit Jewelry Piece' : 'Add New Jewelry Piece'}
            </h1>
            <p className="text-xs text-slate-400">
              {isEdit ? 'Update product information, images, and pricing.' : 'Add a new piece to your boutique catalog.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving || compressing}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 text-xs sm:text-sm flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <FiCheck size={16} />
          )}
          <span>{isEdit ? 'Save Changes' : 'Publish Piece'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Information */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-400 border-b border-slate-800 pb-2">
            Basic Information
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Product Title *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Royal Kundan Bridal Choker Necklace"
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Category *
              </label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="">Select a Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Primary Material *
              </label>
              <select
                name="material"
                required
                value={formData.material}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none cursor-pointer"
              >
                {MATERIALS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the craftsmanship, metal purity, gemstone setting, and styling notes..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none resize-y"
            />
          </div>
        </div>

        {/* Section 2: Pricing & Inventory */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-400 border-b border-slate-800 pb-2">
            Pricing & Inventory
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Price (INR ₹)
              </label>
              <input
                type="number"
                name="price"
                min="0"
                disabled={formData.priceOnRequest}
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g. 75000"
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none disabled:opacity-40 disabled:bg-slate-900"
              />

              <div className="mt-2.5 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="priceOnRequest"
                  name="priceOnRequest"
                  checked={formData.priceOnRequest}
                  onChange={handleChange}
                  className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-0 cursor-pointer"
                />
                <label
                  htmlFor="priceOnRequest"
                  className="text-xs text-slate-300 cursor-pointer select-none font-medium"
                >
                  Price on Request (fluctuating bullion rate or bespoke)
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Stock Status
              </label>
              <select
                name="stockStatus"
                value={formData.stockStatus}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="in-stock">In Stock (Ready to dispatch)</option>
                <option value="made-to-order">Made to Order (7-15 days)</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Jewelry Specifications */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-400 border-b border-slate-800 pb-2">
            Specifications & Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Weight (Net / Gross)
              </label>
              <input
                type="text"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="e.g. 18.5g or 2.5 Tola"
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Purity / Hallmark
              </label>
              <input
                type="text"
                name="purity"
                value={formData.purity}
                onChange={handleChange}
                placeholder="e.g. 22K (916 BIS Hallmark)"
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Available Sizes (comma-separated)
              </label>
              <input
                type="text"
                name="sizesText"
                value={formData.sizesText}
                onChange={handleChange}
                placeholder="e.g. 16 inch, 18 inch, 2.4, 2.6"
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Search Tags (comma-separated)
              </label>
              <input
                type="text"
                name="tagsText"
                value={formData.tagsText}
                onChange={handleChange}
                placeholder="e.g. choker, bridal, wedding, heirloom"
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Occasions */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Occasions
            </label>
            <div className="flex flex-wrap gap-2">
              {OCCASIONS.map((occ) => {
                const isSelected = formData.occasion.includes(occ);
                return (
                  <button
                    key={occ}
                    type="button"
                    onClick={() => handleOccasionToggle(occ)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 font-bold shadow'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {occ.replace('-', ' ')}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 4: Multi-Image Upload (with Drag & Drop, Preview, Reorder, Remove) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-400">
              Product Images ({existingImages.length + newFiles.length}/10)
            </h2>
            <span className="text-[11px] text-slate-400">First image is the primary catalog photo</span>
          </div>

          {/* Upload Drop Zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-800 hover:border-amber-500/50 rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-colors bg-slate-950/40 hover:bg-slate-950/70"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFilesSelected}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-3">
              <FiUploadCloud size={24} />
            </div>
            <p className="text-sm font-medium text-slate-200">
              Tap or drag photos here to upload
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Supports JPEG, PNG, WEBP. Automatically compressed on phone/desktop before uploading.
            </p>
          </div>

          {/* Image Previews Grid */}
          {(existingImages.length > 0 || newFiles.length > 0) && (
            <div className="space-y-3 pt-2">
              <span className="text-xs font-semibold text-slate-300 block">Uploaded & Queued Images</span>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {/* Existing Images */}
                {existingImages.map((img, idx) => (
                  <div
                    key={img._id || idx}
                    className="relative aspect-square rounded-xl overflow-hidden bg-slate-950 border border-slate-800 group shadow-sm"
                  >
                    <img src={img.url} alt="Product" className="w-full h-full object-cover" />

                    {/* Primary Badge */}
                    {idx === 0 && (
                      <span className="absolute top-2 left-2 bg-amber-500 text-slate-950 font-bold text-[9px] uppercase px-1.5 py-0.5 rounded shadow">
                        Main
                      </span>
                    )}

                    {/* Actions Overlay */}
                    <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveExisting(idx, -1)}
                        title="Move Earlier"
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-amber-400 disabled:opacity-30 cursor-pointer"
                      >
                        <FiArrowUp size={14} className="rotate-[-90deg] sm:rotate-0" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === existingImages.length - 1}
                        onClick={() => handleMoveExisting(idx, 1)}
                        title="Move Later"
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-amber-400 disabled:opacity-30 cursor-pointer"
                      >
                        <FiArrowDown size={14} className="rotate-[-90deg] sm:rotate-0" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(idx)}
                        title="Delete Image"
                        className="p-1.5 rounded-lg bg-red-600/80 text-white hover:bg-red-500 cursor-pointer"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}

                {/* New Compressed Files */}
                {newFiles.map((item, idx) => {
                  const globalIdx = existingImages.length + idx;
                  return (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-xl overflow-hidden bg-slate-950 border-2 border-dashed border-amber-500/50 group shadow-sm"
                    >
                      <img src={item.previewUrl} alt="New upload" className="w-full h-full object-cover" />

                      <span className="absolute top-2 left-2 bg-emerald-500 text-slate-950 font-bold text-[9px] uppercase px-1.5 py-0.5 rounded shadow">
                        New
                      </span>

                      {/* Actions Overlay */}
                      <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveNew(idx, -1)}
                          title="Move Earlier"
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-amber-400 disabled:opacity-30 cursor-pointer"
                        >
                          <FiArrowUp size={14} className="rotate-[-90deg] sm:rotate-0" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === newFiles.length - 1}
                          onClick={() => handleMoveNew(idx, 1)}
                          title="Move Later"
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-amber-400 disabled:opacity-30 cursor-pointer"
                        >
                          <FiArrowDown size={14} className="rotate-[-90deg] sm:rotate-0" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveNewFile(idx)}
                          title="Cancel Upload"
                          className="p-1.5 rounded-lg bg-red-600/80 text-white hover:bg-red-500 cursor-pointer"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Section 5: Visibility & Marketing Toggles */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-400 border-b border-slate-800 pb-2">
            Visibility & Badges
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Active / Draft */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-200 block">Active Status</span>
                <span className="text-[11px] text-slate-400 block">
                  {formData.isActive ? 'Visible in catalog' : 'Hidden as draft'}
                </span>
              </div>
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-5 h-5 rounded text-emerald-500 bg-slate-900 border-slate-700 cursor-pointer"
              />
            </div>

            {/* Featured */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-200 block">Featured Piece</span>
                <span className="text-[11px] text-slate-400 block">Show on Homepage</span>
              </div>
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-5 h-5 rounded text-amber-500 bg-slate-900 border-slate-700 cursor-pointer"
              />
            </div>

            {/* New Arrival */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-200 block">New Arrival</span>
                <span className="text-[11px] text-slate-400 block">Show 'New' ribbon</span>
              </div>
              <input
                type="checkbox"
                name="isNewArrival"
                checked={formData.isNewArrival}
                onChange={handleChange}
                className="w-5 h-5 rounded text-red-500 bg-slate-900 border-slate-700 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Section 6: Optional SEO */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-400 border-b border-slate-800 pb-2">
            Search Engine Optimization (SEO)
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Custom SEO Title (max 70 chars)
            </label>
            <input
              type="text"
              name="seoTitle"
              maxLength={70}
              value={formData.seoTitle}
              onChange={handleChange}
              placeholder="e.g. 22K Gold Antique Choker - Buy Online | Suyog Jewelry"
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Custom SEO Meta Description (max 160 chars)
            </label>
            <textarea
              name="seoDescription"
              maxLength={160}
              rows={2}
              value={formData.seoDescription}
              onChange={handleChange}
              placeholder="e.g. Handcrafted 22K hallmarked bridal choker necklace with antique finish..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Link
            to="/admin/products"
            className="px-5 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900 text-sm font-medium transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving || compressing}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 text-sm flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <FiCheck size={18} />
            )}
            <span>{isEdit ? 'Update Product' : 'Create Product'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductEdit;
