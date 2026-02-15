import React, { useState } from 'react';
import { X, Upload, Check } from 'lucide-react';
import { Category, TravelCard } from '../types';
import { TAB_LABELS } from '../constants';

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (card: TravelCard) => void;
}

const AddCardModal: React.FC<AddCardModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [link, setLink] = useState('');
  const [category, setCategory] = useState<Category>(Category.SIGHTS);
  const [imagePreview, setImagePreview] = useState<string>('');

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCard: TravelCard = {
      id: Date.now().toString(),
      title,
      description: desc,
      link,
      category,
      imageUrl: imagePreview || 'https://picsum.photos/800/600', // Fallback
      dateAdded: Date.now(),
    };
    onAdd(newCard);
    
    // Reset form
    setTitle('');
    setDesc('');
    setLink('');
    setImagePreview('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
        <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
          <h3 className="text-white font-bold text-lg">Dodaj novu informaciju</h3>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Category Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategorija</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {Object.entries(TAB_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slika</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-xs text-gray-500">Klikni da otpremiš sliku</p>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} required />
              </label>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Naslov</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="npr. Sagrada Familia"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kratak opis (2-3 linije)</label>
            <textarea 
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              required
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="Opis mesta ili događaja..."
            />
          </div>

          {/* Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Link ka više informacija</label>
            <input 
              type="url" 
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="https://..."
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95"
            >
              <Check size={20} />
              Sačuvaj
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddCardModal;