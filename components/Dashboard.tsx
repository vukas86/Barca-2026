import React, { useState, useEffect } from 'react';
import { Plus, ExternalLink, MapPin, AlertCircle, Search, Trash2 } from 'lucide-react';
import Timeline from './Timeline';
import AddCardModal from './AddCardModal';
import { Category, TravelCard } from '../types';
import { INITIAL_CARDS, TAB_LABELS } from '../constants';

const Dashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<Category>(Category.SIGHTS);
  
  // Inicijalizacija stanja kartica: Prvo proveravamo LocalStorage
  const [cards, setCards] = useState<TravelCard[]>(() => {
    const savedCards = localStorage.getItem('barcelona_cards');
    if (savedCards) {
      try {
        return JSON.parse(savedCards);
      } catch (error) {
        console.error("Greška pri učitavanju kartica:", error);
        return INITIAL_CARDS;
      }
    }
    return INITIAL_CARDS;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Svaki put kada se 'cards' promeni, čuvamo novo stanje u LocalStorage
  useEffect(() => {
    localStorage.setItem('barcelona_cards', JSON.stringify(cards));
  }, [cards]);

  const handleAddCard = (newCard: TravelCard) => {
    setCards([newCard, ...cards]);
  };

  const handleDeleteCard = (id: string) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovu informaciju?')) {
      setCards(cards.filter(card => card.id !== id));
    }
  };

  const filteredCards = cards.filter(
    (card) => 
      card.category === activeTab && 
      (card.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
       card.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Red Reminder Banner */}
      <div className="bg-red-600 text-white text-center py-3 px-4 font-bold flex items-center justify-center gap-2 animate-pulse sticky top-0 z-50 shadow-md">
        <AlertCircle size={20} />
        UPLATITI NA RAČUN DO 12.04 NOVAC!
      </div>

      {/* Hero Section */}
      <div className="relative h-96 w-full overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1558642084-fd07fae5282e?q=80&w=2072&auto=format&fit=crop" 
          alt="Hostel Urbany BCN GO" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-12">
          <div className="container mx-auto max-w-6xl">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold tracking-wide mb-2 inline-block">
              16 – 20.04.2026
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-2 shadow-sm">
              Hostel Urbany BCN GO
            </h1>
            <p className="text-gray-200 text-lg md:text-xl flex items-center gap-2">
              <MapPin size={20} />
              Avinguda de la Granvia de l'Hospitalet, 12, Barselona
            </p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-white/30"
        >
          Odjavi se
        </button>
      </div>

      <div className="container mx-auto max-w-6xl px-4 mt-8">
        
        {/* Timeline */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-10 border border-gray-200/60">
          <Timeline />
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
              placeholder="Pretraži..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 transform active:scale-95"
          >
            <Plus size={20} />
            DODAJ INFORMACIJU
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 sticky top-14 bg-gray-100 py-2 z-40 transition-all">
          {Object.entries(TAB_LABELS).map(([key, label]) => {
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key as Category)}
                className={`
                  flex-1 md:flex-none px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 border
                  ${isActive 
                    ? 'bg-white text-blue-600 border-blue-200 shadow-md transform -translate-y-1' 
                    : 'bg-white text-gray-600 border-transparent hover:bg-gray-50 hover:border-gray-200'}
                `}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCards.length > 0 ? (
            filteredCards.map((card) => (
              <div 
                key={card.id} 
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 flex flex-col h-full relative"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={card.imageUrl} 
                    alt={card.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Category Badge */}
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                    {TAB_LABELS[card.category].split(' ')[1]}
                  </div>
                  
                  {/* Delete Button - Top Left */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteCard(card.id);
                    }}
                    className="absolute top-2 left-2 bg-red-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-700 hover:scale-110 z-20"
                    title="Obriši"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{card.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                    {card.description}
                  </p>
                  
                  <a 
                    href={card.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border-2 border-blue-600 text-blue-600 font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    Pročitaj više <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-2xl border border-dashed border-gray-300">
              <p className="text-lg">Nema informacija u ovoj kategoriji.</p>
              <button onClick={() => setIsModalOpen(true)} className="mt-4 text-blue-600 font-semibold hover:underline">
                Dodaj prvu informaciju
              </button>
            </div>
          )}
        </div>
      </div>

      <AddCardModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddCard} 
      />
    </div>
  );
};

export default Dashboard;