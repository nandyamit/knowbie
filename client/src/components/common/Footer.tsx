import React from 'react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
    return (
      <footer className="bg-secondary-300 text-primary-200 py-6">
        <div>
          <p className="max-w-7xl mx-auto px-4">Need help? Contact us at support@knowbie.com</p>
          <p className="text-center" >&copy; {currentYear} The Knowbie Team</p>
        </div>
      </footer>
    );
  };