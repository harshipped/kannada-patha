import React from 'react';
import { BookOpen } from 'lucide-react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <header className="bg-white shadow-sm border-b-2 border-kannada-orange">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-kannada-orange" />
              <h1 className="text-2xl font-bold text-gray-900">
                ಕನ್ನಡ <span className="text-kannada-orange">ಪಾಠ</span>
              </h1>
            </div>
            <div className="text-sm text-gray-600">
              Interactive Kannada Literature Reader
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;