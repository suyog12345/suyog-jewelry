import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getProductStats, getContacts } from '../../services/api';
import { formatPrice } from '../../utils';
import {
  FiBox,
  FiEye,
  FiMessageSquare,
  FiPlus,
  FiTrendingUp,
  FiRefreshCw,
  FiCheckCircle,
  FiEyeOff,
  FiStar,
  FiArrowRight,
  FiClock,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, contactsRes] = await Promise.all([
        getProductStats(),
        getContacts({ read: 'false', limit: 1 }),
      ]);

      if (statsRes.data?.success) {
        setStats(statsRes.data.data);
      }
      if (contactsRes.data?.success) {
        setUnreadMessages(contactsRes.data.unreadCount || 0);
      }
    } catch (err) {
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8">
      <Helmet>
        <title>Dashboard - Suyog Jewelry Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Top Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-100">Store Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time catalog performance, enquiries, and inventory health.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            title="Refresh statistics"
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <FiRefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <Link
            to="/admin/products/new"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 text-xs sm:text-sm transition-all"
          >
            <FiPlus size={18} />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-5">
        {/* Total Products */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Total Products</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <FiBox size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-heading text-slate-100">
            {loading ? <div className="h-8 w-12 bg-slate-800 animate-pulse rounded"></div> : stats?.totalProducts || 0}
          </div>
          <Link to="/admin/products" className="text-[11px] text-amber-400 hover:underline mt-2 inline-block">
            View catalog →
          </Link>
        </div>

        {/* Active Products */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Active (Live)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <FiCheckCircle size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-heading text-emerald-400">
            {loading ? <div className="h-8 w-12 bg-slate-800 animate-pulse rounded"></div> : stats?.activeProducts || 0}
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">Visible in store</span>
        </div>

        {/* Draft Products */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Draft / Hidden</span>
            <div className="w-8 h-8 rounded-lg bg-slate-700/30 text-slate-400 flex items-center justify-center">
              <FiEyeOff size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-heading text-slate-300">
            {loading ? <div className="h-8 w-12 bg-slate-800 animate-pulse rounded"></div> : stats?.draftProducts || 0}
          </div>
          <Link to="/admin/products?status=draft" className="text-[11px] text-amber-400 hover:underline mt-2 inline-block">
            Filter drafts →
          </Link>
        </div>

        {/* Featured Products */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Featured</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <FiStar size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-heading text-amber-400">
            {loading ? <div className="h-8 w-12 bg-slate-800 animate-pulse rounded"></div> : stats?.featuredProducts || 0}
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">Highlighted on home</span>
        </div>

        {/* Unread Messages */}
        <div className="col-span-2 lg:col-span-1 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Enquiries</span>
            <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
              <FiMessageSquare size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl sm:text-3xl font-bold font-heading text-red-400">
              {loading ? <div className="h-8 w-12 bg-slate-800 animate-pulse rounded"></div> : unreadMessages}
            </div>
            <span className="text-xs text-slate-400">unread</span>
          </div>
          <Link to="/admin/contacts?read=false" className="text-[11px] text-red-400 hover:underline mt-2 inline-block font-medium">
            Review enquiries →
          </Link>
        </div>
      </div>

      {/* Top Enquiries & Top Views Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Most Enquired (WhatsApp Clicks) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <FaWhatsapp size={18} />
              </div>
              <div>
                <h2 className="font-heading font-bold text-base sm:text-lg text-slate-100">
                  Most Enquired Products
                </h2>
                <p className="text-xs text-slate-400">Products generating WhatsApp leads</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
              WhatsApp
            </span>
          </div>

          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 bg-slate-800/60 rounded-xl animate-pulse"></div>
              ))
            ) : stats?.topEnquired?.length > 0 ? (
              stats.topEnquired.map((p, idx) => (
                <Link
                  key={p._id}
                  to={`/admin/products/${p._id}/edit`}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-bold text-slate-500 w-4">{idx + 1}</span>
                    <img
                      src={p.images?.[0]?.url || '/placeholder.jpg'}
                      alt={p.name}
                      className="w-12 h-12 rounded-lg object-cover bg-slate-800 shrink-0 border border-slate-800"
                    />
                    <div className="truncate">
                      <h3 className="text-sm font-medium text-slate-200 group-hover:text-amber-400 transition-colors truncate">
                        {p.name}
                      </h3>
                      <p className="text-xs text-slate-400">{formatPrice(p.price)}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                      <FaWhatsapp size={12} />
                      {p.whatsappClicks || 0} clicks
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-slate-500 py-6 text-center">No WhatsApp enquiry clicks tracked yet.</p>
            )}
          </div>
        </div>

        {/* Top 5 Most Viewed */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <FiEye size={18} />
              </div>
              <div>
                <h2 className="font-heading font-bold text-base sm:text-lg text-slate-100">
                  Most Viewed Products
                </h2>
                <p className="text-xs text-slate-400">Highest catalog shopper interest</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-full">
              Pageviews
            </span>
          </div>

          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 bg-slate-800/60 rounded-xl animate-pulse"></div>
              ))
            ) : stats?.topViewed?.length > 0 ? (
              stats.topViewed.map((p, idx) => (
                <Link
                  key={p._id}
                  to={`/admin/products/${p._id}/edit`}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-bold text-slate-500 w-4">{idx + 1}</span>
                    <img
                      src={p.images?.[0]?.url || '/placeholder.jpg'}
                      alt={p.name}
                      className="w-12 h-12 rounded-lg object-cover bg-slate-800 shrink-0 border border-slate-800"
                    />
                    <div className="truncate">
                      <h3 className="text-sm font-medium text-slate-200 group-hover:text-amber-400 transition-colors truncate">
                        {p.name}
                      </h3>
                      <p className="text-xs text-slate-400">{formatPrice(p.price)}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-lg">
                      <FiEye size={12} />
                      {p.viewCount || 0} views
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-slate-500 py-6 text-center">No product views recorded yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Products Strip */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FiClock className="text-amber-400" />
            <h2 className="font-heading font-bold text-base sm:text-lg text-slate-100">
              Recently Added Products
            </h2>
          </div>
          <Link
            to="/admin/products"
            className="text-xs font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>View All</span>
            <FiArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-28 bg-slate-800/60 rounded-xl animate-pulse"></div>
            ))
          ) : stats?.recentProducts?.length > 0 ? (
            stats.recentProducts.map((p) => (
              <Link
                key={p._id}
                to={`/admin/products/${p._id}/edit`}
                className="bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 rounded-xl p-3 flex flex-col justify-between transition-all group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={p.images?.[0]?.url || '/placeholder.jpg'}
                    alt={p.name}
                    className="w-12 h-12 rounded-lg object-cover bg-slate-800 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-medium text-slate-200 group-hover:text-amber-400 transition-colors truncate">
                      {p.name}
                    </h3>
                    <span
                      className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-medium mt-1 ${
                        p.isActive
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {p.isActive ? 'Active' : 'Draft'}
                    </span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 mt-2 text-right">
                  {new Date(p.createdAt).toLocaleDateString()}
                </div>
              </Link>
            ))
          ) : (
            <p className="col-span-full text-sm text-slate-500 py-4 text-center">No products added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
