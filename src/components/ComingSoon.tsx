import React from 'react';
import { Settings } from 'lucide-react';

interface ComingSoonProps {
  title: string;
  description?: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ title, description }) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 capitalize">{title}</h2>
      <div className="bg-white rounded-lg border p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Settings className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Coming Soon
          </h3>
          <p className="text-gray-600">
            {description || 'This feature is being developed by our AI agents.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;