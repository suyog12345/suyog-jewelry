import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  getContacts,
  markContactAsRead,
  archiveContact,
} from '../../services/api';
import ConfirmModal from '../components/ConfirmModal';
import {
  FiMessageSquare,
  FiMail,
  FiPhone,
  FiCheck,
  FiArchive,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ContactsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [contacts, setContacts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  // Filters
  const readFilter = searchParams.get('read') || ''; // 'false', 'true', or ''
  const typeFilter = searchParams.get('type') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  // Delete modal state
  const [archiveModal, setArchiveModal] = useState({ isOpen: false, contact: null });
  const [archiveLoading, setArchiveLoading] = useState(false);

  const fetchContactList = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 15,
        read: readFilter || undefined,
        type: typeFilter || undefined,
      };

      const res = await getContacts(params);
      if (res.data?.success) {
        setContacts(res.data.data || []);
        setUnreadCount(res.data.unreadCount || 0);
        if (res.data.pagination) setPagination(res.data.pagination);
      }
    } catch (err) {
      toast.error('Failed to load contact messages');
    } finally {
      setLoading(false);
    }
  }, [page, readFilter, typeFilter]);

  useEffect(() => {
    fetchContactList();
  }, [fetchContactList]);

  const handleTabChange = (statusVal) => {
    const newParams = new URLSearchParams(searchParams);
    if (statusVal) {
      newParams.set('read', statusVal);
    } else {
      newParams.delete('read');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleTypeChange = (typeVal) => {
    const newParams = new URLSearchParams(searchParams);
    if (typeVal) {
      newParams.set('type', typeVal);
    } else {
      newParams.delete('type');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Mark as Read
  const handleMarkRead = async (id) => {
    try {
      const res = await markContactAsRead(id);
      if (res.data?.success) {
        toast.success('Marked as read');
        setContacts((prev) =>
          prev.map((c) => (c._id === id ? { ...c, isRead: true } : c))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  // Archive
  const handleArchiveConfirm = async () => {
    if (!archiveModal.contact) return;
    setArchiveLoading(true);

    try {
      const res = await archiveContact(archiveModal.contact._id);
      if (res.data?.success) {
        toast.success('Message archived');
        setArchiveModal({ isOpen: false, contact: null });
        fetchContactList();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to archive message');
    } finally {
      setArchiveLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Enquiries & Messages - Suyog Jewelry Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-100">
              Customer Enquiries
            </h1>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white font-bold text-xs px-2.5 py-0.5 rounded-full shadow">
                {unreadCount} New
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Incoming customer inquiries, custom order requests, and feedback messages.
          </p>
        </div>

        <button
          onClick={fetchContactList}
          disabled={loading}
          className="self-start sm:self-auto p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-2 text-xs sm:text-sm"
        >
          <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Read / Unread Tabs */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800/80">
          <button
            type="button"
            onClick={() => handleTabChange('')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              readFilter === '' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Messages
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('false')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              readFilter === 'false' ? 'bg-red-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span className="bg-red-950 text-red-200 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('true')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              readFilter === 'true' ? 'bg-slate-800 text-amber-400 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Read
          </button>
        </div>

        {/* Type Filter */}
        <div className="w-full sm:w-56">
          <select
            value={typeFilter}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="">All Enquiry Types</option>
            <option value="general">General Enquiry</option>
            <option value="custom-order">Custom Order</option>
            <option value="enquiry">Product Enquiry</option>
            <option value="complaint">Feedback / Complaint</option>
          </select>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-3 bg-slate-900 rounded-2xl border border-slate-800">
            <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm">Loading enquiries...</p>
          </div>
        ) : contacts.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3 bg-slate-900 rounded-2xl border border-slate-800">
            <FiMessageSquare size={32} className="mx-auto text-slate-600" />
            <p className="text-sm text-slate-300">No messages match this filter.</p>
          </div>
        ) : (
          contacts.map((msg) => {
            const cleanPhone = msg.phone ? msg.phone.replace(/\D/g, '') : '';
            return (
              <div
                key={msg._id}
                className={`bg-slate-900 border rounded-2xl p-5 transition-all shadow-sm ${
                  !msg.isRead
                    ? 'border-amber-500/40 bg-slate-900/95 ring-1 ring-amber-500/20'
                    : 'border-slate-800 opacity-90'
                }`}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    {!msg.isRead && (
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0"></span>
                    )}
                    <h3 className="font-heading font-bold text-base text-slate-100">
                      {msg.name}
                    </h3>
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        msg.type === 'custom-order'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : msg.type === 'complaint'
                          ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {msg.type?.replace('-', ' ') || 'General'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <FiCalendar size={13} />
                    <span>{new Date(msg.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                {/* Subject if any */}
                {msg.subject && (
                  <h4 className="text-sm font-semibold text-slate-200 mb-2">
                    Subject: {msg.subject}
                  </h4>
                )}

                {/* Message body */}
                <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/70 text-slate-300 text-sm leading-relaxed mb-4 whitespace-pre-line">
                  {msg.message}
                </div>

                {/* Contact metadata & action buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-800/60">
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    {msg.email && (
                      <a
                        href={`mailto:${msg.email}`}
                        className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
                      >
                        <FiMail size={14} className="text-slate-500" />
                        <span>{msg.email}</span>
                      </a>
                    )}
                    {msg.phone && (
                      <a
                        href={`tel:${msg.phone}`}
                        className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
                      >
                        <FiPhone size={14} className="text-slate-500" />
                        <span>{msg.phone}</span>
                      </a>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {/* Reply on WhatsApp if phone exists */}
                    {cleanPhone && (
                      <a
                        href={`https://wa.me/${cleanPhone}?text=Hi%20${encodeURIComponent(
                          msg.name
                        )},%20thank%20you%20for%20contacting%20Suyog%20Jewelry.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <FaWhatsapp size={14} />
                        <span>Reply on WhatsApp</span>
                      </a>
                    )}

                    {/* Mark as read */}
                    {!msg.isRead && (
                      <button
                        type="button"
                        onClick={() => handleMarkRead(msg._id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 hover:text-amber-400 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <FiCheck size={14} />
                        <span>Mark Read</span>
                      </button>
                    )}

                    {/* Archive button */}
                    <button
                      type="button"
                      onClick={() => setArchiveModal({ isOpen: true, contact: msg })}
                      className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Archive Enquiry"
                    >
                      <FiArchive size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing {contacts.length} of {pagination.total} enquiries
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

      {/* Archive Modal */}
      <ConfirmModal
        isOpen={archiveModal.isOpen}
        title="Archive Enquiry?"
        message={`Archive this message from "${archiveModal.contact?.name}"? It will be removed from your active inbox.`}
        confirmText="Archive Message"
        isDanger={false}
        isLoading={archiveLoading}
        onConfirm={handleArchiveConfirm}
        onClose={() => setArchiveModal({ isOpen: false, contact: null })}
      />
    </div>
  );
};

export default ContactsList;
