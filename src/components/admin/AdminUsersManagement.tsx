import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminUser } from '../../types';
import {
  ShieldCheck,
  ShieldAlert,
  Shield,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  UserCheck,
  UserX,
  Lock,
  Mail,
  Clock,
  KeyRound,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Copy,
  Users,
  User,
  Upload,
  Activity,
  Check,
  X,
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
  Eye,
  RefreshCw,
} from 'lucide-react';

const AVAILABLE_PERMISSIONS = [
  { id: 'ALL_PERMISSIONS', label: 'Full System Access (Super Admin Master Key)', category: 'System' },
  { id: 'USER_MANAGEMENT', label: 'Manage Administrators & Permissions', category: 'Security' },
  { id: 'STUDENT_REGISTRATIONS', label: 'Manage Student Registrations & Leads', category: 'Admissions' },
  { id: 'CONVERTED_STUDENTS', label: 'Manage Enrolled Students & Batches', category: 'Admissions' },
  { id: 'PROGRAMS_COURSES', label: 'Create, Edit & Publish Programs/Courses', category: 'Academics' },
  { id: 'HERO_BANNERS', label: 'Manage Homepage Banners & News Ticker', category: 'Marketing' },
  { id: 'SUCCESS_STORIES', label: 'Manage Testimonials & Success Stories', category: 'Marketing' },
  { id: 'FORM_OPTIONS', label: 'Manage Dropdowns, Branches & Colleges', category: 'Settings' },
  { id: 'CERTIFICATES', label: 'Verify & Issue Certificates', category: 'Academics' },
  { id: 'AUDIT_LOGS', label: 'View Security Audit Logs', category: 'Security' },
];

export const AdminUsersManagement: React.FC = () => {
  const {
    currentRole,
    currentUser,
    adminUsers,
    addAdminUser,
    updateAdminUser,
    deleteAdminUser,
    toggleAdminStatus,
    auditLogs,
    showToast,
  } = useApp();

  // Active sub-tab
  const [subTab, setSubTab] = useState<'directory' | 'permissions' | 'audit'>('directory');

  // Directory Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'super_admin' | 'admin'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Inactive'>('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [deletingAdmin, setDeletingAdmin] = useState<AdminUser | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Email format regex pattern (standard RFC-compliant email address)
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Form State for Add / Edit Admin
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    role: 'admin' | 'super_admin';
    status: 'Active' | 'Inactive';
    permissions: string[];
    avatar?: string;
  }>({
    name: '',
    email: '',
    role: 'admin',
    status: 'Active',
    permissions: ['STUDENT_REGISTRATIONS', 'PROGRAMS_COURSES'],
    avatar: '',
  });

  // Handle Direct Photo File Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WebP)', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image file size should be less than 5MB', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormData((prev) => ({ ...prev, avatar: reader.result as string }));
        showToast('Administrator photo attached successfully!', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  // Copy email helper
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied ${text} to clipboard`, 'info');
  };

  // Filtered admin users list
  const filteredAdmins = useMemo(() => {
    return adminUsers.filter((admin) => {
      const matchesSearch =
        admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || admin.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || admin.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [adminUsers, searchTerm, roleFilter, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = adminUsers.length;
    const superAdmins = adminUsers.filter((a) => a.role === 'super_admin').length;
    const active = adminUsers.filter((a) => a.status === 'Active').length;
    const inactive = adminUsers.filter((a) => a.status === 'Inactive').length;
    return { total, superAdmins, active, inactive };
  }, [adminUsers]);

  // Handle open modal for editing
  const handleStartEdit = (admin: AdminUser) => {
    setEditingAdmin(admin);
    setEmailError(null);
    setFormData({
      name: admin.name,
      email: admin.email,
      role: admin.role,
      status: admin.status,
      permissions: [...admin.permissions],
      avatar: admin.avatar || '',
    });
  };

  // Open Add modal
  const handleStartAdd = () => {
    setEditingAdmin(null);
    setEmailError(null);
    setFormData({
      name: '',
      email: '',
      role: 'admin',
      status: 'Active',
      permissions: ['STUDENT_REGISTRATIONS', 'PROGRAMS_COURSES'],
      avatar: '',
    });
    setIsAddModalOpen(true);
  };

  // Save Add or Edit with email format validation
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim().toLowerCase();

    if (!trimmedName) {
      showToast('Please enter administrator full name', 'error');
      return;
    }

    if (!trimmedEmail) {
      setEmailError('Email address is required.');
      showToast('Please enter an email address', 'error');
      return;
    }

    // Strict Email Format Check
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setEmailError('Invalid email format. Please enter a valid email address (e.g. name@domain.com).');
      showToast('Invalid email address format', 'error');
      return;
    }

    // Duplicate Email Check
    const isDuplicate = adminUsers.some(
      (a) => a.email.toLowerCase() === trimmedEmail && a.id !== editingAdmin?.id
    );

    if (isDuplicate) {
      setEmailError('An administrator with this email address already exists.');
      showToast('An administrator with this email address already exists', 'error');
      return;
    }

    setEmailError(null);

    if (editingAdmin) {
      updateAdminUser(editingAdmin.id, {
        name: trimmedName,
        email: trimmedEmail,
        role: formData.role,
        status: formData.status,
        permissions: formData.permissions,
        avatar: formData.avatar,
      });
      setEditingAdmin(null);
    } else {
      addAdminUser({
        name: trimmedName,
        email: trimmedEmail,
        role: formData.role,
        status: formData.status,
        permissions: formData.permissions,
        avatar: formData.avatar,
      });
      setIsAddModalOpen(false);
    }
  };

  // Toggle permission selection in form
  const handleTogglePermission = (permId: string) => {
    if (permId === 'ALL_PERMISSIONS') {
      if (formData.permissions.includes('ALL_PERMISSIONS')) {
        setFormData({ ...formData, permissions: [] });
      } else {
        setFormData({
          ...formData,
          permissions: AVAILABLE_PERMISSIONS.map((p) => p.id),
        });
      }
      return;
    }

    setFormData((prev) => {
      const exists = prev.permissions.includes(permId);
      const updated = exists
        ? prev.permissions.filter((p) => p !== permId && p !== 'ALL_PERMISSIONS')
        : [...prev.permissions, permId];
      return { ...prev, permissions: updated };
    });
  };

  // Apply Quick Template
  const applyPermissionTemplate = (type: 'super' | 'admissions' | 'academic' | 'marketing') => {
    if (type === 'super') {
      setFormData({
        ...formData,
        role: 'super_admin',
        permissions: AVAILABLE_PERMISSIONS.map((p) => p.id),
      });
    } else if (type === 'admissions') {
      setFormData({
        ...formData,
        role: 'admin',
        permissions: ['STUDENT_REGISTRATIONS', 'CONVERTED_STUDENTS', 'FORM_OPTIONS'],
      });
    } else if (type === 'academic') {
      setFormData({
        ...formData,
        role: 'admin',
        permissions: ['PROGRAMS_COURSES', 'CERTIFICATES', 'FORM_OPTIONS'],
      });
    } else if (type === 'marketing') {
      setFormData({
        ...formData,
        role: 'admin',
        permissions: ['HERO_BANNERS', 'SUCCESS_STORIES', 'PROGRAMS_COURSES'],
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Super Admin Top Welcome Header Banner */}
      <div className="bg-gradient-to-r from-[#071B49] via-[#0E2864] to-[#146EF5] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-blue-400/20">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/30 text-amber-300 text-xs font-black tracking-wide">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>SUPER ADMIN PRIVILEGES ACTIVE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Administrator Access & Team Management
            </h1>
          </div>

          {/* Current Logged-in Super Admin Identity Badge */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 flex items-center gap-3 shrink-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-11 h-11 rounded-xl object-cover ring-2 ring-amber-400/60 shadow-md"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-white truncate max-w-[150px]">
                  {currentUser.name}
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 uppercase shadow-xs">
                  Super Admin
                </span>
              </div>
              <span className="text-[11px] text-blue-200 block truncate max-w-[180px]">
                {currentUser.email}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block mb-0.5">Total Administrators</span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{stats.total}</span>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block mb-0.5">Super Admins</span>
            <span className="text-2xl sm:text-3xl font-black text-amber-600">{stats.superAdmins}</span>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block mb-0.5">Active Status</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-600">{stats.active}</span>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-bold">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block mb-0.5">Audit Events</span>
            <span className="text-2xl sm:text-3xl font-black text-indigo-600">{auditLogs.length}</span>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold">
            <Activity className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Tab Navigation Bar */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSubTab('directory')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              subTab === 'directory'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Administrator Directory ({adminUsers.length})</span>
          </button>

          <button
            onClick={() => setSubTab('permissions')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              subTab === 'permissions'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Permissions Matrix</span>
          </button>

          <button
            onClick={() => setSubTab('audit')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              subTab === 'audit'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Security Audit Logs</span>
          </button>
        </div>

        {subTab === 'directory' && (
          <button
            onClick={handleStartAdd}
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Administrator</span>
          </button>
        )}
      </div>

      {/* =====================================================================
          TAB 1: ADMINISTRATOR DIRECTORY
          ===================================================================== */}
      {subTab === 'directory' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 shrink-0">Role:</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-blue-600 cursor-pointer"
                >
                  <option value="all">All Roles</option>
                  <option value="super_admin">Super Admins</option>
                  <option value="admin">Administrators</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 shrink-0">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-blue-600 cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="Active">Active Only</option>
                  <option value="Inactive">Inactive Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Administrators Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4 sm:px-6">Administrator</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Permissions</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Last Active</th>
                    <th className="py-3.5 px-4 text-right sm:px-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredAdmins.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
                        <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <p className="font-bold text-slate-700">No Administrators Found</p>
                        <p className="text-xs mt-1">Try resetting search keywords or role filters.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredAdmins.map((admin) => {
                      const isSuperAdmin = admin.role === 'super_admin';
                      const isPrimarySuperAdmin = admin.email === 'anils9172@gmail.com';

                      return (
                        <tr key={admin.id} className="hover:bg-slate-50/60 transition-colors">
                          {/* Name & Email */}
                          <td className="py-4 px-4 sm:px-6">
                            <div className="flex items-center gap-3">
                              <div className="relative shrink-0">
                                {admin.avatar ? (
                                  <img
                                    src={admin.avatar}
                                    alt={admin.name}
                                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-500/20 shadow-xs"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-xs uppercase">
                                    {admin.name.charAt(0)}
                                  </div>
                                )}
                                {admin.status === 'Active' && (
                                  <span className="w-3 h-3 bg-emerald-500 border-2 border-white rounded-full absolute -bottom-0.5 -right-0.5" />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-slate-900 text-xs sm:text-sm">
                                    {admin.name}
                                  </span>
                                  {isPrimarySuperAdmin && (
                                    <span className="text-[10px] bg-amber-100 text-amber-800 font-black px-2 py-0.5 rounded-full">
                                      Owner
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1 mt-0.5 text-slate-500">
                                  <Mail className="w-3 h-3" />
                                  <span className="text-[11px] font-mono">{admin.email}</span>
                                  <button
                                    onClick={() => handleCopy(admin.email)}
                                    className="p-0.5 hover:text-slate-800 transition-colors cursor-pointer ml-1"
                                    title="Copy Email"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Role Badge */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            {isSuperAdmin ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[11px] font-black shadow-xs">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>Super Admin</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold border border-blue-200">
                                <Shield className="w-3.5 h-3.5" />
                                <span>Administrator</span>
                              </span>
                            )}
                          </td>

                          {/* Permissions Pill Tags */}
                          <td className="py-4 px-4 max-w-xs">
                            <div className="flex flex-wrap gap-1">
                              {admin.permissions.includes('ALL_PERMISSIONS') ? (
                                <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-md text-[10px] font-extrabold">
                                  ⚡ Full System Master Key
                                </span>
                              ) : (
                                admin.permissions.slice(0, 3).map((perm) => (
                                  <span
                                    key={perm}
                                    className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[10px] font-semibold border border-slate-200"
                                  >
                                    {perm}
                                  </span>
                                ))
                              )}
                              {!admin.permissions.includes('ALL_PERMISSIONS') &&
                                admin.permissions.length > 3 && (
                                  <span className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-md text-[10px] font-bold">
                                    +{admin.permissions.length - 3} more
                                  </span>
                                )}
                            </div>
                          </td>

                          {/* Live Status Toggle */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <button
                              onClick={() => toggleAdminStatus(admin.id)}
                              disabled={isPrimarySuperAdmin}
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                                isPrimarySuperAdmin
                                  ? 'bg-emerald-100 text-emerald-800 cursor-not-allowed opacity-90'
                                  : admin.status === 'Active'
                                  ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 cursor-pointer'
                                  : 'bg-rose-100 hover:bg-rose-200 text-rose-800 cursor-pointer'
                              }`}
                              title={isPrimarySuperAdmin ? 'Primary super admin status locked' : 'Click to toggle status'}
                            >
                              {admin.status === 'Active' ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Active</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                  <span>Inactive</span>
                                </>
                              )}
                            </button>
                          </td>

                          {/* Last Active Timestamp */}
                          <td className="py-4 px-4 whitespace-nowrap text-slate-500">
                            <div className="flex items-center gap-1 text-[11px]">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span>{admin.lastActive}</span>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleStartEdit(admin)}
                                className="p-2 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-xl transition-colors cursor-pointer"
                                title="Edit Role & Permissions"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>

                              {!isPrimarySuperAdmin && (
                                <button
                                  onClick={() => setDeletingAdmin(admin)}
                                  className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-colors cursor-pointer"
                                  title="Remove Administrator"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: PERMISSIONS MATRIX REFERENCE
          ===================================================================== */}
      {subTab === 'permissions' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900">System Permissions & RBAC Matrix</h2>
            <p className="text-xs text-slate-500 mt-1">
              Detailed list of permission tokens configurable for platform administrators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AVAILABLE_PERMISSIONS.map((perm) => (
              <div
                key={perm.id}
                className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-blue-300 transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200/60">
                    {perm.id}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase px-2 py-0.5 rounded bg-slate-200/70">
                    {perm.category}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-800">{perm.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: SECURITY AUDIT LOGS
          ===================================================================== */}
      {subTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Security & Administrative Audit Logs</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time security events, administrator updates, and policy modifications.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {auditLogs.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">No audit events recorded.</div>
            ) : (
              auditLogs.map((log) => (
                <div key={log.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{log.action}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md">
                        {log.module}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{log.description}</p>
                    <div className="text-[11px] text-slate-400 flex items-center gap-3 pt-0.5">
                      <span>By: {log.adminName} ({log.adminEmail})</span>
                      <span>IP: {log.ipAddress}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 shrink-0">{log.timestamp}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          ADD / EDIT ADMINISTRATOR MODAL
          ===================================================================== */}
      {(isAddModalOpen || editingAdmin) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {editingAdmin ? 'Edit Administrator Credentials' : 'Provision New Administrator'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Set role level and select specific modules to grant access.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingAdmin(null);
                }}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Template Selector */}
            <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100 space-y-2">
              <span className="text-xs font-bold text-blue-900 block">Quick Permission Templates:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => applyPermissionTemplate('super')}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  ⚡ Full Super Admin
                </button>
                <button
                  type="button"
                  onClick={() => applyPermissionTemplate('admissions')}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  🎓 Admissions & Leads Manager
                </button>
                <button
                  type="button"
                  onClick={() => applyPermissionTemplate('academic')}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  📚 Programs & Course Manager
                </button>
                <button
                  type="button"
                  onClick={() => applyPermissionTemplate('marketing')}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  🖼️ Public Portal Editor
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveForm} className="space-y-4">
              {/* Direct Photo Upload Section */}
              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                <div className="relative shrink-0">
                  {formData.avatar ? (
                    <img
                      src={formData.avatar}
                      alt="Administrator Avatar"
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500/30 shadow-xs"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black flex items-center justify-center text-xl shadow-xs uppercase">
                      {formData.name.trim() ? formData.name.trim().charAt(0) : <User className="w-8 h-8" />}
                    </div>
                  )}
                  {formData.avatar && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, avatar: '' })}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-600 text-white rounded-full flex items-center justify-center text-xs shadow-md hover:bg-rose-700 transition-colors cursor-pointer"
                      title="Remove Photo"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="space-y-1.5 text-center sm:text-left flex-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <label className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5 shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Admin Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>

                    {formData.avatar && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, avatar: '' })}
                        className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Directly attach a photo file (PNG, JPG, WebP - max 5MB).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Priya Sharma"
                    className="w-full text-xs sm:text-sm px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Work Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => {
                      const newVal = e.target.value;
                      setFormData({ ...formData, email: newVal });
                      if (emailError) {
                        if (EMAIL_REGEX.test(newVal.trim().toLowerCase())) {
                          setEmailError(null);
                        }
                      }
                    }}
                    onBlur={() => {
                      const trimmed = formData.email.trim().toLowerCase();
                      if (trimmed && !EMAIL_REGEX.test(trimmed)) {
                        setEmailError('Invalid email format (e.g. name@domain.com)');
                      } else if (trimmed && adminUsers.some(a => a.email.toLowerCase() === trimmed && a.id !== editingAdmin?.id)) {
                        setEmailError('An administrator with this email already exists.');
                      } else {
                        setEmailError(null);
                      }
                    }}
                    placeholder="priya.admin@a2z.edu.in"
                    className={`w-full text-xs sm:text-sm px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none font-mono text-slate-900 transition-colors ${
                      emailError
                        ? 'border-rose-500 focus:border-rose-600 bg-rose-50/20'
                        : 'border-slate-200 focus:border-blue-600'
                    }`}
                  />
                  {emailError && (
                    <p className="text-[11px] font-bold text-rose-600 mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{emailError}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Role Tier
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full text-xs sm:text-sm px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 font-bold cursor-pointer"
                  >
                    <option value="admin">Administrator (Standard Access)</option>
                    <option value="super_admin">Super Administrator (Full System Power)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Account Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full text-xs sm:text-sm px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 font-bold cursor-pointer"
                  >
                    <option value="Active">Active & Enabled</option>
                    <option value="Inactive">Inactive / Suspended</option>
                  </select>
                </div>
              </div>

              {/* Permissions Checklist */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-slate-800">
                  Assigned Module Permissions ({formData.permissions.length} selected):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  {AVAILABLE_PERMISSIONS.map((perm) => {
                    const isChecked = formData.permissions.includes(perm.id);
                    return (
                      <label
                        key={perm.id}
                        className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleTogglePermission(perm.id)}
                          className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <div>
                          <span className="block font-semibold">{perm.label}</span>
                          <span className="text-[10px] text-slate-400 font-mono block uppercase">
                            {perm.id}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingAdmin(null);
                  }}
                  className="px-5 py-2.5 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {editingAdmin ? 'Save Changes' : 'Create Administrator'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          DELETE ADMIN CONFIRMATION MODAL
          ===================================================================== */}
      {deletingAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Remove Administrator?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to remove <strong className="text-slate-700">{deletingAdmin.name}</strong> ({deletingAdmin.email})?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setDeletingAdmin(null)}
                className="w-full py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteAdminUser(deletingAdmin.id);
                  setDeletingAdmin(null);
                }}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Yes, Delete Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
