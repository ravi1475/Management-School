import React, { useState } from 'react';

const FilterModal = ({ onApply, onClear }) => {
  // Hard-coded options for grades and sections
  const gradeOptions = Array.from({ length: 12 }, (_, i) => String(i + 1));
  const sectionOptions = ['A', 'B', 'C', 'D'];

  // Local state to manage filter selections
  const [grade, setGrade] = useState('');
  const [section, setSection] = useState('');

  // Call the parent's onApply callback with selected filters
  const handleApply = () => {
    if (onApply) {
      onApply({ grade, section });
    }
  };

  // Reset filter selections and call the parent's onClear callback
  const handleClear = () => {
    setGrade('');
    setSection('');
    if (onClear) {
      onClear();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-semibold mb-4">Filter by Grade &amp; Section</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Grade
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg p-2"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          >
            <option value="">All</option>
            {gradeOptions.map((g) => (
              <option key={g} value={g}>
                Class {g}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Section
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg p-2"
            value={section}
            onChange={(e) => setSection(e.target.value)}
          >
            <option value="">All</option>
            {sectionOptions.map((s) => (
              <option key={s} value={s}>
                Section {s}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-green-500 text-white rounded"
            onClick={handleApply}
          >
            Apply Filters
          </button>
          <button
            className="px-4 py-2 bg-gray-300 rounded"
            onClick={handleClear}
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;