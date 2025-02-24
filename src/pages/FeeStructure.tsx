import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save } from 'lucide-react';

interface FeeCategory {
  id: string;
  name: string;
  amount: number;
  frequency: 'Monthly' | 'Quarterly' | 'Yearly';
}

interface ClassFeeStructure {
  id: string;
  className: string;
  totalAnnualFee: number;
  categories: FeeCategory[];
}

// Styled button component
const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  onClick,
  className = ''
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'ghost';
  size?: 'sm' | 'md';
  onClick?: () => void;
  className?: string;
}) => {
  const baseStyles = 'rounded-md font-medium focus:outline-none transition-colors';
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    ghost: 'text-gray-600 hover:bg-gray-100'
  };
  const sizes = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2'
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// Input component
const Input = ({ 
  type = 'text',
  value,
  onChange,
  placeholder,
  className = ''
}: {
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
  />
);

// Default fee categories for selection
const DEFAULT_CATEGORIES = [
  'Tuition Fee',
  'Transport Fee',
  'Library Fee',
  'Laboratory Fee',
  'Sports Fee',
  'Development Fee'
];

// Add this constant before the FeeStructure component
const SAMPLE_FEE_STRUCTURES: ClassFeeStructure[] = [
  {
    id: '1',
    className: 'Class 10',
    totalAnnualFee: 0,
    categories: [
      {
        id: '1-1',
        name: 'Tuition Fee',
        amount: 5000,
        frequency: 'Monthly'
      },
      {
        id: '1-2',
        name: 'Development Fee',
        amount: 10000,
        frequency: 'Yearly'
      }
    ]
  },
  {
    id: '2',
    className: 'Class 11',
    totalAnnualFee: 0,
    categories: [
      {
        id: '2-1',
        name: 'Tuition Fee',
        amount: 6000,
        frequency: 'Monthly'
      },
      {
        id: '2-2',
        name: 'Laboratory Fee',
        amount: 5000,
        frequency: 'Quarterly'
      }
    ]
  }
];

const FeeStructure = () => {
  const [feeStructures, setFeeStructures] = useState<ClassFeeStructure[]>([]);
  const [editingStructureId, setEditingStructureId] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [newClassName, setNewClassName] = useState('');

  // Replace the existing useEffect for loading data
  useEffect(() => {
    const savedStructures = localStorage.getItem('feeStructures');
    if (savedStructures) {
      setFeeStructures(JSON.parse(savedStructures));
    } else {
      // Initialize with sample data if no saved data exists
      setFeeStructures(SAMPLE_FEE_STRUCTURES);
    }
  }, []);

  // Save to localStorage whenever feeStructures changes
  useEffect(() => {
    localStorage.setItem('feeStructures', JSON.stringify(feeStructures));
  }, [feeStructures]);

  const handleAddStructure = () => {
    if (!newClassName) return;
    
    // Format the class name to ensure it has "Class" prefix
    const formattedClassName = newClassName.trim().match(/^\d+$/) 
      ? `Class ${newClassName}`
      : !newClassName.toLowerCase().startsWith('class') 
        ? `Class ${newClassName}`
        : newClassName;

    const newStructure: ClassFeeStructure = {
      id: Date.now().toString(),
      className: formattedClassName,
      totalAnnualFee: 0,
      categories: []
    };
    
    setFeeStructures([...feeStructures, newStructure]);
    setNewClassName('');
  };

  const handleDeleteStructure = (id: string) => {
    setFeeStructures(feeStructures.filter(structure => structure.id !== id));
  };

  const handleAddCategory = (structureId: string) => {
    const newCategory: FeeCategory = {
      id: `${structureId}-${Date.now()}`,
      name: DEFAULT_CATEGORIES[0],
      amount: 0,
      frequency: 'Monthly'
    };

    setFeeStructures(structures =>
      structures.map(structure =>
        structure.id === structureId
          ? {
              ...structure,
              categories: [...structure.categories, newCategory]
            }
          : structure
      )
    );
  };

  const handleUpdateCategory = (
    structureId: string,
    categoryId: string,
    updates: Partial<FeeCategory>
  ) => {
    setFeeStructures(structures =>
      structures.map(structure =>
        structure.id === structureId
          ? {
              ...structure,
              categories: structure.categories.map(category =>
                category.id === categoryId
                  ? { ...category, ...updates }
                  : category
              )
            }
          : structure
      )
    );
  };

  const handleDeleteCategory = (structureId: string, categoryId: string) => {
    setFeeStructures(structures =>
      structures.map(structure =>
        structure.id === structureId
          ? {
              ...structure,
              categories: structure.categories.filter(
                category => category.id !== categoryId
              )
            }
          : structure
      )
    );
  };

  const calculateTotalAnnualFee = (categories: FeeCategory[]): number => {
    return categories.reduce((total, category) => {
      const multiplier = category.frequency === 'Monthly' 
        ? 12 
        : category.frequency === 'Quarterly' 
          ? 4 
          : 1;
      return total + (category.amount * multiplier);
    }, 0);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Fee Structure Management
          </h1>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          <Input
            type="text"
            placeholder="Enter class (e.g. 5 or Class 5)"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
          />
          <Button onClick={handleAddStructure}>
            <Plus className="mr-2 h-4 w-4" />
            Add Class
          </Button>
        </div>
      </div>

      <div className="mt-8 space-y-8">
        {feeStructures.map((structure) => (
          <div key={structure.id} className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {structure.className}
                </h2>
                <p className="text-sm text-gray-500">
                  Total Annual Fee: ₹{calculateTotalAnnualFee(structure.categories).toLocaleString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleDeleteStructure(structure.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="px-6 py-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Frequency</th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {structure.categories.map((category) => (
                    <tr key={category.id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        {editingCategoryId === category.id ? (
                          <select
                            className="border rounded p-1"
                            value={category.name}
                            onChange={(e) =>
                              handleUpdateCategory(structure.id, category.id, {
                                name: e.target.value
                              })
                            }
                          >
                            {DEFAULT_CATEGORIES.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        ) : (
                          category.name
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        {editingCategoryId === category.id ? (
                          <Input
                            type="number"
                            value={category.amount}
                            onChange={(e) =>
                              handleUpdateCategory(structure.id, category.id, {
                                amount: Number(e.target.value)
                              })
                            }
                          />
                        ) : (
                          `₹${category.amount.toLocaleString()}`
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        {editingCategoryId === category.id ? (
                          <select
                            className="border rounded p-1"
                            value={category.frequency}
                            onChange={(e) =>
                              handleUpdateCategory(structure.id, category.id, {
                                frequency: e.target.value as 'Monthly' | 'Quarterly' | 'Yearly'
                              })
                            }
                          >
                            <option value="Monthly">Monthly</option>
                            <option value="Quarterly">Quarterly</option>
                            <option value="Yearly">Yearly</option>
                          </select>
                        ) : (
                          category.frequency
                        )}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            editingCategoryId === category.id
                              ? setEditingCategoryId(null)
                              : setEditingCategoryId(category.id)
                          }
                        >
                          {editingCategoryId === category.id ? (
                            <Save className="h-4 w-4" />
                          ) : (
                            <Edit2 className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCategory(structure.id, category.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={4} className="px-3 py-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-indigo-600"
                        onClick={() => handleAddCategory(structure.id)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Fee Category
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeeStructure;