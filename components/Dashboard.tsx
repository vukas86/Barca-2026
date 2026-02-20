import React, { useState, useEffect } from 'react';
import { Plus, ExternalLink, MapPin, AlertCircle, Search, Trash2, Edit2, Info, Copy, Save, LogOut } from 'lucide-react';
import Timeline from './Timeline';
import AddCardModal from './AddCardModal';
import { Category, TravelCard } from '../types';
import { INITIAL_CARDS, TAB_LABELS } from '../constants';

const Dashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<Category>(Category.SIGHTS);
  
  // IZMENA: Sada učitavamo podatke ISKLJUČIVO iz fajla constants.ts (INITIAL_CARDS).
  // LocalStorage se ignoriše da bi podaci bili isti na svim uređajima.
  const [cards, setCards] = useState<TravelCard[]>(INITIAL_CARDS);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<TravelCard | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Napomena: Uklonili smo useEffect koji je čuvao podatke u LocalStorage.
  // Sada se podaci čuvaju samo privremeno u memoriji dok ne klikneš na "Sačuvaj kod".

  const handleAddCard = (newCard: TravelCard) => {
    setCards([newCard, ...cards]);
  };

  const handleUpdateCard = (updatedCard: TravelCard) => {
    setCards(cards.map(card => card.id === updatedCard.id ? updatedCard : card));
  };

  const handleDeleteCard = (id: string) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovu informaciju?')) {
      setCards(cards.filter(card => card.id !== id));
    }
  };

  const openAddModal = () => {
    setEditingCard(null);
    setIsModalOpen(true);
  };

  const openEditModal = (card: TravelCard) => {
    setEditingCard(card);
    setIsModalOpen(true);
  };

  const handleExportData = () => {
    // Formatiramo podatke da izgledaju tačno kao kod u constants.ts
    const jsonString = JSON.stringify(cards, null, 2);
    const exportString = `export const INITIAL_CARDS: TravelCard[] = ${jsonString};`;
    
    navigator.clipboard.writeText(exportString).then(() => {
      alert('✅ KOD JE KOPIRAN!\n\nSada uradi sledeće:\n1. Otvori fajl "constants.ts"\n2. Obriši sve linije gde piše "export const INITIAL_CARDS..."\n3. Nalepi (Paste) ovo što si upravo kopirao\n4. Sačuvaj i uradi "git push"');
    }).catch(err => {
      console.error('Failed to copy: ', err);
      alert('Došlo je do greške pri kopiranju.');
    });
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
        
        {/* Top Right Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button 
            onClick={handleExportData}
            title="Sačuvaj izmene za GitHub"
            className="bg-green-600/80 hover:bg-green-600 backdrop-blur-md text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-green-500/30 flex items-center gap-2 shadow-lg"
          >
            <Save size={18} />
            <span className="hidden md:inline">Sačuvaj kod</span>
          </button>
          
          <button 
            onClick={onLogout}
            title="Odjavi se"
            className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-white/30 flex items-center gap-2"
          >
            <LogOut size={18} />
            <span className="hidden md:inline">Odjavi se</span>
          </button>
        </div>
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
            onClick={openAddModal}
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

        {/* CONTENT RENDERER */}
        {activeTab === Category.INFO ? (
            /* LIST VIEW FOR INFO */
            <div className="flex flex-col gap-4">
                {filteredCards.length > 0 ? (
                    filteredCards.map((card) => (
                        <div key={card.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all flex flex-col md:flex-row gap-6 items-start md:items-center justify-between group">
                             <div className="flex items-start gap-4 flex-1">
                                <div className="hidden md:flex bg-blue-100 text-blue-600 p-3 rounded-full flex-shrink-0">
                                    <Info size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{card.title}</h3>
                                    <p className="text-gray-600 leading-relaxed mb-3 whitespace-pre-wrap">{card.description}</p>
                                    {card.link && (
                                        <a 
                                            href={card.link} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1"
                                        >
                                            Saznaj više <ExternalLink size={14} />
                                        </a>
                                    )}
                                </div>
                             </div>

                             {/* Edit/Delete Actions for List View */}
                             <div className="flex gap-2 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 mt-2 md:mt-0 justify-end">
                                <button
                                    onClick={() => openEditModal(card)}
                                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2 md:block"
                                >
                                    <Edit2 size={18} />
                                    <span className="md:hidden text-sm">Izmeni</span>
                                </button>
                                <button
                                    onClick={() => handleDeleteCard(card.id)}
                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 md:block"
                                >
                                    <Trash2 size={18} />
                                    <span className="md:hidden text-sm">Obriši</span>
                                </button>
                             </div>
                        </div>
                    ))
                ) : (
                    <div className="py-12 text-center text-gray-500 bg-white rounded-2xl border border-dashed border-gray-300">
                        <p className="text-lg">Nema informacija u ovoj kategoriji.</p>
                        <button onClick={openAddModal} className="mt-4 text-blue-600 font-semibold hover:underline">
                            Dodaj prvu informaciju
                        </button>
                    </div>
                )}
            </div>
        ) : (
            /* GRID VIEW FOR OTHER CATEGORIES */
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
                    
                    {/* Action Buttons (Edit & Delete) - Top Left */}
                    <div className="absolute top-2 left-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                        <button
                        onClick={(e) => {
                            e.preventDefault();
                            openEditModal(card);
                        }}
                        className="bg-white/90 text-blue-600 p-2 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110"
                        title="Izmeni"
                        >
                        <Edit2 size={16} />
                        </button>
                        <button
                        onClick={(e) => {
                            e.preventDefault();
                            handleDeleteCard(card.id);
                        }}
                        className="bg-white/90 text-red-600 p-2 rounded-full shadow-lg hover:bg-red-600 hover:text-white transition-all transform hover:scale-110"
                        title="Obriši"
                        >
                        <Trash2 size={16} />
                        </button>
                    </div>
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{card.title}</h3>
                    
                    {/* Event Details */}
                    {card.category === Category.EVENTS && (
                      <div className="mb-3 space-y-1 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        {(card.date || card.time) && (
                          <div className="flex items-center gap-2">
                            <span className="font-semibold min-w-[70px]">Kada:</span>
                            <span>
                              {card.date ? new Date(card.date).toLocaleDateString('sr-RS') : ''}
                              {card.date && card.time ? ' u ' : ''}
                              {card.time ? card.time : ''}
                            </span>
                          </div>
                        )}
                        {card.location && (
                          <div className="flex items-center gap-2">
                            <span className="font-semibold min-w-[70px]">Gde:</span>
                            <span className="truncate" title={card.location}>{card.location}</span>
                          </div>
                        )}
                        {card.address && (
                          <div className="flex items-center gap-2">
                            <span className="font-semibold min-w-[70px]">Adresa:</span>
                            <span className="truncate" title={card.address}>{card.address}</span>
                          </div>
                        )}
                        {card.price && (
                          <div className="flex items-center gap-2">
                            <span className="font-semibold min-w-[70px]">Cena:</span>
                            <span className="text-green-600 font-bold">{card.price.includes('€') ? card.price : `${card.price}€`}</span>
                          </div>
                        )}
                      </div>
                    )}

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
                <button onClick={openAddModal} className="mt-4 text-blue-600 font-semibold hover:underline">
                    Dodaj prvu informaciju
                </button>
                </div>
            )}
            </div>
        )}
      </div>

      <AddCardModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddCard} 
        onEdit={handleUpdateCard} 
        editingCard={editingCard}
      />
    </div>
  );
};

export default Dashboard;