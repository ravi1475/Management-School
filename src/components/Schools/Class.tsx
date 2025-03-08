import { useState } from 'react';
import { FiEye, FiEdit, FiTrash2, FiX } from 'react-icons/fi';
interface ClassSectionItem {
  id: number;
  className: string;
  sectionName: string;
  teacher: string;
  subjects: string[];
}

export const ClassSectionManagement = () => {
  const initialItems: ClassSectionItem[] = [
    {
      id: 1,
      className: 'NURSERY',
      sectionName: 'A',
      teacher: 'Sarah Johnson',
      subjects: ['Basic Math', 'Phonics'],
    },
    {
      id: 2,
      className: 'KINDERGARTEN',
      sectionName: 'B',
      teacher: 'John Doe',
      subjects: ['Art', 'Music'],
    },
    {
      id: 3,
      className: 'GRADE 1',
      sectionName: 'C',
      teacher: 'Jane Smith',
      subjects: ['Science', 'Math'],
    },
    {
      id: 4,
      className: 'GRADE 2',
      sectionName: 'A',
      teacher: 'Emily Davis',
      subjects: ['History', 'Geography'],
    },
    {
      id: 5,
      className: 'GRADE 3',
      sectionName: 'B',
      teacher: 'Michael Brown',
      subjects: ['English', 'Social Studies'],
    },
    {
      id: 6,
      className: 'GRADE 4',
      sectionName: 'C',
      teacher: 'Laura Wilson',
      subjects: ['Math', 'Science'],
    },
  ];

  const [items, setItems] = useState<ClassSectionItem[]>(initialItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubjectsPopupOpen, setIsSubjectsPopupOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<ClassSectionItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<ClassSectionItem | null>(null);
  const [formData, setFormData] = useState({
    className: '',
    sectionName: '',
    teacher: '',
    subjects: [] as string[],
  });
  const [newSubject, setNewSubject] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const generateNewId = () => {
    return items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
  };

  const filteredItems = items.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.className.toLowerCase().includes(searchLower) ||
      item.sectionName.toLowerCase().includes(searchLower) ||
      item.teacher.toLowerCase().includes(searchLower)
    );
  });

  // Pagination logic
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.className.trim() || !formData.sectionName.trim() || !formData.teacher.trim()) return;

    if (currentItem) {
      setItems(items.map((i) => (i.id === currentItem.id ? { ...i, ...formData } : i)));
    } else {
      const newItem: ClassSectionItem = {
        id: generateNewId(),
        ...formData,
        className: formData.className.trim(),
        sectionName: formData.sectionName.trim(),
        teacher: formData.teacher.trim(),
      };
      setItems([...items, newItem]);
    }
    resetForm();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter((i) => i.id !== id));
      if (selectedItem && selectedItem.id === id) {
        setSelectedItem(null);
      }
    }
  };

  const handleEdit = (item: ClassSectionItem) => {
    setCurrentItem(item);
    setFormData({
      className: item.className,
      sectionName: item.sectionName,
      teacher: item.teacher,
      subjects: item.subjects,
    });
    setIsModalOpen(true);
    setIsSubjectsPopupOpen(false);
  };

  const resetForm = () => {
    setFormData({
      className: '',
      sectionName: '',
      teacher: '',
      subjects: [],
    });
    setCurrentItem(null);
    setIsModalOpen(false);
    setIsSubjectsPopupOpen(false);
    setNewSubject('');
  };

  const handleAddSubject = () => {
    if (newSubject.trim()) {
      setFormData((prev) => ({
        ...prev,
        subjects: [...prev.subjects, newSubject.trim()],
      }));
      setNewSubject('');
    }
  };

  const handleRemoveSubject = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Class & Section Management</h1>
          <p className="mt-1 text-sm text-gray-500">Manage classes and sections efficiently</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <button
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium flex items-center"
            >
              Add New
            </button>
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search classes or sections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sr. No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Section</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teacher</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedItems.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-500">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.className}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.sectionName}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.teacher}</td>
                  <td className="px-6 py-4 text-sm text-center space-x-4">
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setIsSubjectsPopupOpen(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <FiEye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <FiEdit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredItems.length === 0 && (
            <div className="px-6 py-12 text-center">
              <h3 className="mt-2 text-sm font-medium text-gray-900">No items found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search' : 'Get started by creating a new item'}
              </p>
            </div>
          )}

          {/* Pagination Controls */}
          <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
            >
              Next
            </button>
          </div>
        </div>

        {/* View Details Popup */}
        {isSubjectsPopupOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Class Details</h3>
                <button onClick={() => setIsSubjectsPopupOpen(false)} className="text-gray-400 hover:text-gray-500">
                  ×
                </button>
              </div>

              <div className="px-6 py-4 space-y-4">
                {selectedItem ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                      <p className="text-sm text-gray-600">{selectedItem.className}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                      <p className="text-sm text-gray-600">{selectedItem.sectionName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
                      <p className="text-sm text-gray-600">{selectedItem.teacher}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subjects</label>
                      <ul className="list-disc pl-5">
                        {selectedItem.subjects.map((subject, index) => (
                          <li key={index} className="text-sm text-gray-600">{subject}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-600">No item selected.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">{currentItem ? 'Edit Item' : 'Add New Item'}</h3>
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-500">
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.className}
                    onChange={(e) => setFormData((prev) => ({ ...prev, className: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Section Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.sectionName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, sectionName: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teacher <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.teacher}
                    onChange={(e) => setFormData((prev) => ({ ...prev, teacher: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subjects</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Add a subject"
                    />
                    <button
                      type="button"
                      onClick={handleAddSubject}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.subjects.map((subject, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-sm">
                        {subject}
                        <button
                          type="button"
                          onClick={() => handleRemoveSubject(index)}
                          className="ml-1 text-gray-500 hover:text-gray-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    {currentItem ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};