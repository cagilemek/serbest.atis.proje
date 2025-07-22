'use client';

import React from 'react';

interface BasketballCourtProps {
  showAnimation?: boolean;
  shotResult?: boolean | null;
}

export default function BasketballCourt({ showAnimation = false, shotResult = null }: BasketballCourtProps) {
  return (
    <div className="relative w-full h-64 basketball-court rounded-lg overflow-hidden border-4 border-orange-800">
      {/* Court Lines */}
      <div className="absolute inset-0">
        {/* Free throw line */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-white"></div>
        
        {/* Three point arc */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-32 h-16 border-2 border-white rounded-t-full border-b-0"></div>
      </div>

      {/* Basketball Hoop */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
        {/* Backboard */}
        <div className="w-16 h-12 bg-white border-2 border-gray-300 rounded-sm mb-1"></div>
        
        {/* Rim */}
        <div className="relative">
          <div className="w-12 h-3 bg-orange-600 border-2 border-orange-700 rounded-full mx-auto"></div>
          {/* Net */}
          <div className="flex justify-center mt-1">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-0.5 h-4 bg-white opacity-70 mx-0.5"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Basketball */}
      <div className={`absolute bottom-20 left-1/2 transform -translate-x-1/2 ${showAnimation ? 'shot-animation' : ''}`}>
        <div className="w-8 h-8 basketball rounded-full border-2 border-orange-800 relative">
          {/* Basketball lines */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-0.5 bg-orange-800 rounded"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center rotate-90">
            <div className="w-6 h-0.5 bg-orange-800 rounded"></div>
          </div>
        </div>
      </div>

      {/* Shot Result Animation */}
      {shotResult !== null && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`text-4xl font-bold animate-fade-in ${
            shotResult ? 'text-green-500' : 'text-red-500'
          }`}>
            {shotResult ? '🎯' : '❌'}
          </div>
        </div>
      )}
    </div>
  );
}