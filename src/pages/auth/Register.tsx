import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { registerAPI } from '@/lib/api';
import { Utensils, Building2, Heart, AlertCircle, CheckCircle } from 'lucide-react';

type Role = 'hotel' | 'ngo';

export default function Register() {
  const [role, setRole] = useState<Role>('hotel');
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phone: '', whatsappNumber: '', address: '', city: '', pincode: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (k !== 'confirmPassword') fd.append(k, v); });
      fd.append('role', role);
      if (file) fd.append('registrationDoc', file);

      const res = await registerAPI(fd);
      const { user, token, message } = res.data;
      setUser(user, token);
      setSuccess(message);
      setTimeout(() => navigate(`/${user.role}/dashboard`), 2000);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      console.log(axiosErr)
      setError(axiosErr.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-orange-500 rounded-2xl mb-3">
            <Utensils size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Join FoodBridge</h1>
          <p className="text-gray-500 text-sm mt-1">Create your account to get started</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-8">
          {/* Role Selector */}
          <div className="mb-6">
            <p className={labelCls}>I am a...</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'hotel' as Role, label: 'Hotel / Restaurant / Café', icon: Building2, color: 'orange' },
                { value: 'ngo' as Role, label: 'NGO / Organization', icon: Heart, color: 'green' },
              ].map(({ value, label, icon: Icon, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRole(value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    role === value
                      ? color === 'orange'
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-green-600 bg-green-50 text-green-700'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <Icon size={22} />
                  <span className="text-xs font-medium text-center leading-tight">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-5 text-sm">
              <AlertCircle size={16} /> {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-3 rounded-xl mb-5 text-sm">
              <CheckCircle size={16} /> {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={labelCls}>{role === 'hotel' ? 'Hotel/Restaurant Name' : 'NGO Name'}</label>
                <input name="name" value={form.name} onChange={handleChange} required className={inputCls} placeholder="Full name" />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required className={inputCls} placeholder="email@example.com" />
              </div>
              <div>
                <label className={labelCls}>Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} required className={inputCls} placeholder="+91 98765 43210" />
              </div>
              {role === 'ngo' && (
                <div className="col-span-2">
                  <label className={labelCls}>WhatsApp Number <span className="text-orange-500">(for food alerts)</span></label>
                  <input name="whatsappNumber" value={form.whatsappNumber} onChange={handleChange} className={inputCls} placeholder="+91 98765 43210" />
                </div>
              )}
              <div className="col-span-2">
                <label className={labelCls}>Address</label>
                <input name="address" value={form.address} onChange={handleChange} required className={inputCls} placeholder="Full address" />
              </div>
              <div>
                <label className={labelCls}>City</label>
                <input name="city" value={form.city} onChange={handleChange} required className={inputCls} placeholder="Mumbai" />
              </div>
              <div>
                <label className={labelCls}>Pincode</label>
                <input name="pincode" value={form.pincode} onChange={handleChange} required className={inputCls} placeholder="400001" />
              </div>
              <div>
                <label className={labelCls}>Password</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} required className={inputCls} placeholder="Min 6 chars" />
              </div>
              <div>
                <label className={labelCls}>Confirm Password</label>
                <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required className={inputCls} placeholder="Repeat password" />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>
                  {role === 'hotel' ? 'FSSAI / License Document' : 'NGO Registration Certificate'}{' '}
                  <span className="text-gray-400">(PDF/Image, Optional)</span>
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all disabled:opacity-60 shadow-md shadow-orange-100 mt-2"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already registered?{' '}
            <Link to="/login" className="text-orange-500 font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}