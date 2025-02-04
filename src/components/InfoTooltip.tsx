import React from 'react';

interface InfoTooltipProps {
  title: string;
  content: string;
}

export function InfoTooltip({ title, content }: InfoTooltipProps) {
  return (
    <div className="group relative inline-block">
      <div className="cursor-help text-indigo-600 hover:text-indigo-800">
        <span className="border-b-2 border-dotted border-indigo-400">{title}</span>
      </div>
      <div className="invisible group-hover:visible absolute z-50 w-64 p-4 mt-2 bg-white rounded-lg shadow-xl border border-indigo-100 text-sm text-gray-700">
        {content}
      </div>
    </div>
  );
}