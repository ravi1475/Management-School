import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter, FileText, Download } from 'lucide-react';

interface Student {
  id: number;
  name: string;
  admissionNo: string;
  class: string;
  feeStatus: 'Paid' | 'Partially Paid' | 'Unpaid';
  totalFees: number;
  paidAmount: number;
  dueAmount: number;
  lastPaymentDate?: string;
}

const StudentManagement = () => {
  const students: Student[] = [
    {
      id: 1,
      name: 'John Doe',
      admissionNo: 'ST2024001',
      class: 'Grade 10',
      feeStatus: 'Paid',
      totalFees: 50000,
      paidAmount: 50000,
      dueAmount: 0,
      lastPaymentDate: '2024-02-15',
    },
    {
      id: 2,
      name: 'Jane Smith',
      admissionNo: 'ST2024002',
      class: 'Grade 9',
      feeStatus: 'Partially Paid',
      totalFees: 45000,
      paidAmount: 30000,
      dueAmount: 15000,
      lastPaymentDate: '2024-01-20',
    },
    {
      id: 3,
      name: 'Mike Johnson',
      admissionNo: 'ST2024003',
      class: 'Grade 11',
      feeStatus: 'Unpaid',
      totalFees: 55000,
      paidAmount: 0,
      dueAmount: 55000,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Partially Paid':
        return 'bg-yellow-100 text-yellow-800';
      case 'Unpaid':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Student Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage student records, view fee status, and handle registrations.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Admission No
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Class
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Fee Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Total Fees
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Paid Amount
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Due Amount
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {student.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{student.admissionNo}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{student.class}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                            student.feeStatus
                          )}`}
                        >
                          {student.feeStatus}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        ₹{student.totalFees.toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        ₹{student.paidAmount.toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        ₹{student.dueAmount.toLocaleString()}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-2">
                        <Button variant="ghost" size="sm" className="text-indigo-600">
                          View Details
                        </Button>
                        <Button variant="ghost" size="sm" className="text-indigo-600">
                          <FileText className="h-4 w-4 mr-1" />
                          Invoice
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentManagement;