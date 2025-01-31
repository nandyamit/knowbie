import React from 'react';

export const Features = () => {
  const features = [
    {
      title: 'Multiple Categories',
      description: 'Test your knowledge in Books, Films, and Music.',
      icon: <img src="Assets/multiple_categories_icon.png" alt="Multiple Categories" className="h-16 w-auto mx-auto" />
    },
    {
      title: 'Track Progress',
      description: 'Monitor your improvement with detailed analytics.',
      icon: <img src="Assets/track_progress_icon.png" alt="Track Progress" className="h-16 w-auto mx-auto" />
    },
    {
      title: 'Compete & Compare',
      description: 'See how you rank against other users.',
      icon: <img src="Assets/compete_compare_icon.png" alt="Compete & Compare" className="h-16 w-auto mx-auto" />
    },
    {
      title: 'Smart Insights',
      description: 'Get AI-powered recommendations to improve.',
      icon: <img src="Assets/smart_insights_icon.png" alt="Smart Insights" className="h-16 w-auto mx-auto" />
    }
  ];

  return (
    <div className="py-12 bg-secondary-300 rounded-lg animate-[fadeInOut]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div key={index} 
              className="text-center bg-primary-100 rounded-lg shadow-md p-4">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-medium text-primary-200">
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
  );
};