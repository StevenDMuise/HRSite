import React, { useState } from 'react';
import BaseLayout from '../components/layout/BaseLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

interface ExportOptions {
  includeArchived: boolean;
  includeNotes: boolean;
  includeContacts: boolean;
  dateRange: 'all' | 'last30' | 'last90' | 'custom';
  startDate?: string;
  endDate?: string;
  format: 'csv' | 'json' | 'pdf';
}

const ExportPage: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [options, setOptions] = useState<ExportOptions>({
    includeArchived: true,
    includeNotes: true,
    includeContacts: true,
    dateRange: 'all',
    format: 'csv'
  });

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // TODO: Add API call to export data
      // Mock download for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockData = JSON.stringify({ message: 'Export successful' });
      const blob = new Blob([mockData], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `job-applications-${new Date().toISOString().split('T')[0]}.${options.format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <BaseLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Export Data
            </h2>
          </div>
        </div>

        <Card className="mt-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Export Options</h3>
              <p className="mt-1 text-sm text-gray-500">
                Select what data you would like to include in your export.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeArchived"
                  checked={options.includeArchived}
                  onChange={e => setOptions(prev => ({ ...prev, includeArchived: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="includeArchived" className="ml-3 text-sm text-gray-700">
                  Include archived applications
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeNotes"
                  checked={options.includeNotes}
                  onChange={e => setOptions(prev => ({ ...prev, includeNotes: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="includeNotes" className="ml-3 text-sm text-gray-700">
                  Include notes and comments
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeContacts"
                  checked={options.includeContacts}
                  onChange={e => setOptions(prev => ({ ...prev, includeContacts: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="includeContacts" className="ml-3 text-sm text-gray-700">
                  Include contact information
                </label>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Date Range</label>
              <select
                value={options.dateRange}
                onChange={e => setOptions(prev => ({ ...prev, dateRange: e.target.value as ExportOptions['dateRange'] }))}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All time</option>
                <option value="last30">Last 30 days</option>
                <option value="last90">Last 90 days</option>
                <option value="custom">Custom range</option>
              </select>
            </div>

            {options.dateRange === 'custom' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    value={options.startDate}
                    onChange={e => setOptions(prev => ({ ...prev, startDate: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    value={options.endDate}
                    onChange={e => setOptions(prev => ({ ...prev, endDate: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700">Export Format</label>
              <select
                value={options.format}
                onChange={e => setOptions(prev => ({ ...prev, format: e.target.value as ExportOptions['format'] }))}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="csv">CSV</option>
                <option value="json">JSON</option>
                <option value="pdf">PDF</option>
              </select>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleExport}
                isLoading={isExporting}
                disabled={isExporting}
              >
                {isExporting ? 'Exporting...' : 'Export Data'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </BaseLayout>
  );
};

export default ExportPage;
