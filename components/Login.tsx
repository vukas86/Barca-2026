import React, { useState } from 'react';
import { Lock, MapPin } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'BARCELONA' && password === 'travel*26') {
      onLogin();
    } else {
      setError('Pogrešno korisničko ime ili lozinka.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=2070&auto=format&fit=crop")' }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      
      <div className="relative z-10 w-full max-w-md p-8 bg-white/90 rounded-2xl shadow-2xl backdrop-blur-md border border-white/20">
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 bg-blue-600 rounded-full mb-4 shadow-lg">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Barselona 2026</h1>
          <p className="text-gray-600 mt-2">Planer Putovanja</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Korisničko ime</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Unesite korisničko ime"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lozinka</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Unesite lozinku"
            />
          </div>

          {error && (
            <div className="flex items-center text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              <Lock className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Prijavi se
          </button>
        </form>
        
        <div className="mt-8 text-center text-xs text-gray-500">
          © 2026 Travel Group • Pristup samo za članove
        </div>
      </div>
    </div>
  );
};

export default Login;