import React from 'react';

export const Features = () => {
  const features = [
    {
      title: 'Multiple Categories',
      description: 'Test your knowledge in Books, Films, and Music.',
      icon: '📚'
    },
    {
      title: 'Track Progress',
      description: 'Monitor your improvement with detailed analytics.',
      icon: '📈'
    },
    {
      title: 'Compete & Compare',
      description: 'See how you rank against other users.',
      icon: '🏆'
    },
    {
      title: 'Smart Insights',
      description: 'Get AI-powered recommendations to improve.',
      icon: '🤖'
    }
  ];

  return (
    <div className="py-12 bg-secondary-300 rounded-lg animate-[fadeInOut]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-10">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-medium text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-base text-primary-200">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};