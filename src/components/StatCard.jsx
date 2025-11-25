import React from 'react';

const StatCard = ({ title, value, icon: Icon, color, dark }) => (
  <div className={`p-6 rounded-xl shadow-sm border flex justify-between items-start ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
    <div>
      <p className={`text-sm font-medium mb-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{title}</p>
      <h3 className="text-3xl font-bold">{value}</h3>
    </div>
    <div className={`p-3 rounded-lg ${color} text-white shadow-lg shadow-${color}/30`}>
      <Icon size={24} />
    </div>
  </div>
);

export default StatCard;