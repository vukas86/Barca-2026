import React, { useState, useEffect } from 'react';
import { X, Upload, Check } from 'lucide-react';
import { Category, TravelCard } from '../types';
import { TAB_LABELS } from '../constants';

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (card: TravelCard) => void;
  onEdit: (card: TravelCard) => void;
  editingCard?: TravelCard | null;
}

const AddCardModal: React.FC<AddCardModalProps> = ({ isOpen, onClose, onAdd, onEdit, editingCard }) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [link, setLink] = useState('');
  const [category, setCategory] = useState<Category>(Category.SIGHTS);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  // New fields
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState('');

  // Reset or populate form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (editingCard) {
        // Edit mode
        setTitle(editingCard.title);
        setDesc(editingCard.description);
        setLink(editingCard.link);
        setCategory(editingCard.category);
        setImagePreview(editingCard.imageUrl);
        setLocation(editingCard.location || '');
        setDate(editingCard.date || '');
        setTime(editingCard.time || '');
        setAddress(editingCard.address || '');
        setPrice(editingCard.price || '');
      } else {
        // Add mode - reset
        setTitle('');
        setDesc('');
        setLink('');
        setCategory(Category.SIGHTS);
        setImagePreview('');
        setLocation('');
        setDate('');
        setTime('');
        setAddress('');
        setPrice('');
      }
    }
  }, [isOpen, editingCard]);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Create canvas for resizing
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Max dimensions (e.g. 800x600 is enough for a card)
          const MAX_WIDTH = 600;
          const MAX_HEIGHT = 600;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Compress to JPEG with 0.7 quality to save space
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          
          setImagePreview(dataUrl);
          setIsProcessing(false);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;

    // For INFO category, we don't need a real image if one wasn't provided
    let finalImage = imagePreview;
    
    if (category === Category.INFO && !finalImage) {
        finalImage = 'NO_IMAGE_NEEDED'; // Placeholder for INFO cards
    } else if (!finalImage) {
        if (category === Category.EVENTS) {
            // Default concert image
            finalImage = 'https://images.unsplash.com/photo-1459749411177-71299d1acc3e?q=80&w=2069&auto=format&fit=crop';
        } else {
            finalImage = 'https://picsum.photos/800/600'; // Fallback for other categories
        }
    }

    const cardData: TravelCard = {
        id: editingCard ? editingCard.id : Date.now().toString(),
        title,
        description: desc,
        link,
        category,
        imageUrl: finalImage,
        dateAdded: editingCard ? editingCard.dateAdded : Date.now(),
        location,
        date,
        time,
        address,
        price
    };

    if (editingCard) {
      onEdit(cardData);
    } else {
      onAdd(cardData);
    }
    
    onClose();
  };

  const isInfoCategory = category === Category.INFO;
  const isEventCategory = category === Category.EVENTS;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
        <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
          <h3 className="text-white font-bold text-lg">
            {editingCard ? 'Izmeni informaciju' : 'Dodaj novu informaciju'}
          </h3>
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

          {/* Image Upload - HIDDEN FOR INFO CATEGORY */}
          {!isInfoCategory && (
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slika</label>
                <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors relative overflow-hidden">
                    {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-xs text-gray-500">
                        {isProcessing ? 'Obrada slike...' : 'Klikni da otpremiš sliku'}
                        </p>
                    </div>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} required={!imagePreview && !editingCard} />
                </label>
                </div>
                <p className="text-xs text-gray-400 mt-1">*Slika će biti automatski smanjena radi uštede memorije.</p>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Naslov</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder={isInfoCategory ? "npr. Važan telefon" : "npr. Sagrada Familia"}
            />
          </div>

          {/* Event Specific Fields */}
          {isEventCategory && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Lokacija (Mesto)</label>
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="npr. Palau Sant Jordi"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresa</label>
                <input 
                  type="text" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="npr. Passeig Olímpic, 5-7"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Datum</label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vreme</label>
                <input 
                  type="time" 
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cena (€)</label>
                <input 
                  type="text" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="npr. 50"
                />
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {isInfoCategory ? 'Detaljan opis' : 'Kratak opis (2-3 linije)'}
            </label>
            <textarea 
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              required
              rows={isInfoCategory ? 8 : 3}
              maxLength={1000}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder={isInfoCategory ? "Unesite detaljne informacije (do 1000 karaktera)..." : "Opis..."}
            />
            <div className="text-right text-xs text-gray-400 mt-1">
                {desc.length} / 1000
            </div>
          </div>

          {/* Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {isInfoCategory ? 'Link (Opciono)' : 'Link ka više informacija'}
            </label>
            <input 
              type="url" 
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required={!isInfoCategory}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="https://..."
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isProcessing}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Check size={20} />
              {isProcessing ? 'Obrada...' : (editingCard ? 'Ažuriraj' : 'Sačuvaj')}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddCardModal;