import { useState } from 'react';
import { uploadFoodAPI } from '@/lib/api';
import { Plus, Trash2, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FoodItem { name: string; quantity: string; unit: string; description: string; }

export default function HotelUploadFood() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([{ name: '', quantity: '', unit: 'servings', description: '' }]);
  const [totalServings, setTotalServings] = useState('');
  const [preparedAt, setPreparedAt] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [notes, setNotes] = useState('');
  const [images, setImages] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const addItem = () => setFoodItems([...foodItems, { name: '', quantity: '', unit: 'servings', description: '' }]);
  const removeItem = (i: number) => setFoodItems(foodItems.filter((_, idx) => idx !== i));
  const updateItem = (i: number, key: keyof FoodItem, val: string) => {
    const updated = [...foodItems];
    updated[i][key] = val;
    setFoodItems(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('foodItems', JSON.stringify(foodItems));
      fd.append('totalServings', totalServings);
      fd.append('preparedAt', preparedAt);
      fd.append('expiresAt', expiresAt);
      fd.append('notes', notes);
      if (images) Array.from(images).forEach((f) => fd.append('images', f));

      const res = await uploadFoodAPI(fd);
      setSuccess(res.data.message);
      setTimeout(() => navigate('/hotel/my-listings'), 2500);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || 'Failed to upload food');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all";

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="page-title">Upload Leftover Food</h1>
        <p className="text-gray-500 mt-1">NGOs in your city will be notified via WhatsApp</p>
      </div>

      {success && (
        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-4 rounded-xl border border-green-200">
          <CheckCircle size={18} /> {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-200 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-orange-100 p-6 shadow-sm space-y-6">
        {/* Food Items */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">Food Items</h3>
            <button type="button" onClick={addItem} className="flex items-center gap-1.5 text-orange-500 text-sm font-medium hover:text-orange-600 transition-colors">
              <Plus size={16} /> Add Item
            </button>
          </div>
          <div className="space-y-3">
            {foodItems.map((item, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-start bg-gray-50 rounded-xl p-3">
                <div className="col-span-4">
                  <input value={item.name} onChange={(e) => updateItem(i, 'name', e.target.value)}
                    required placeholder="Food name" className={inputCls} />
                </div>
                <div className="col-span-2">
                  <input type="number" value={item.quantity} onChange={(e) => updateItem(i, 'quantity', e.target.value)}
                    required placeholder="Qty" className={inputCls} />
                </div>
                <div className="col-span-2">
                  <select value={item.unit} onChange={(e) => updateItem(i, 'unit', e.target.value)} className={inputCls}>
                    <option value="servings">servings</option>
                    <option value="kg">kg</option>
                    <option value="liters">liters</option>
                    <option value="plates">plates</option>
                    <option value="boxes">boxes</option>
                    <option value="packets">packets</option>
                  </select>
                </div>
                <div className="col-span-3">
                  <input value={item.description} onChange={(e) => updateItem(i, 'description', e.target.value)}
                    placeholder="Description (opt)" className={inputCls} />
                </div>
                <div className="col-span-1 flex items-center justify-center pt-1">
                  {foodItems.length > 1 && (
                    <button type="button" onClick={() => removeItem(i)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Total Servings <span className="text-red-500">*</span></label>
            <input type="number" value={totalServings} onChange={(e) => setTotalServings(e.target.value)}
              required min="1" placeholder="e.g. 50" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Prepared At <span className="text-red-500">*</span></label>
            <input type="datetime-local" value={preparedAt} onChange={(e) => setPreparedAt(e.target.value)}
              required className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Expires At <span className="text-red-500">*</span></label>
            <input type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)}
              required className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Food Images (max 5)</label>
            <input type="file" multiple accept="image/*" onChange={(e) => setImages(e.target.files)}
              className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Additional Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
              placeholder="Any special handling instructions, dietary info, etc."
              className={`${inputCls} resize-none`} />
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all disabled:opacity-60 shadow-md shadow-orange-100">
          {loading ? 'Uploading & Notifying NGOs...' : '🍽️ Upload Food & Notify NGOs'}
        </button>
      </form>
    </div>
  );
}