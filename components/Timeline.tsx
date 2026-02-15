import React from 'react';
import { Plane, Hotel, Info } from 'lucide-react';
import { TIMELINE_DATA } from '../constants';

const Timeline: React.FC = () => {
  return (
    <div className="w-full py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="bg-blue-600 w-2 h-8 mr-3 rounded-full"></span>
        PLAN PUTOVANJA
      </h2>
      
      <div className="relative">
        {/* Desktop Line */}
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full z-0"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 relative z-10">
          {TIMELINE_DATA.map((event, index) => {
            const Icon = event.icon === 'plane' ? Plane : event.icon === 'hotel' ? Hotel : Info;
            return (
              <div key={event.id} className="group relative">
                {/* Mobile Line connection (vertical) */}
                {index !== TIMELINE_DATA.length - 1 && (
                   <div className="md:hidden absolute left-6 top-10 w-0.5 h-full bg-gray-200"></div>
                )}

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-full flex md:flex-col items-center md:items-start md:text-center text-left gap-4 md:gap-2">
                  <div className={`
                    flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-md
                    ${event.isReturn ? 'bg-indigo-500' : 'bg-blue-500'}
                  `}>
                    <Icon size={20} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="text-sm font-bold text-blue-900 uppercase tracking-wide">
                      {event.date} <span className="text-gray-400">|</span> {event.time}
                    </div>
                    <h3 className="font-bold text-gray-800 leading-tight mt-1">{event.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{event.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Timeline;