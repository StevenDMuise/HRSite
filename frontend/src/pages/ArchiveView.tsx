import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BaseLayout from '../components/layout/BaseLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

interface ArchivedApplication {
  id: string;
  companyName: string;
  position: string;
  dateApplied: string;
  dateArchived: string;
  reason: 'accepted_other' | 'rejected' | 'position_filled' | 'no_longer_interested' | 'other';
  notes?: string;
}

const ArchiveView: React.FC = () => {
  const [archivedApplications, setArchivedApplications] = useState<ArchivedApplication[]>([]);

  const handleUnarchive = async (id: string) => {
    // TODO: Add API call to unarchive application
    setArchivedApplications(prev => prev.filter(app => app.id !== id));
  };

  const getReasonText = (reason: ArchivedApplication['reason']) => {
    switch (reason) {
      case 'accepted_other':
        return 'Accepted another offer';
      case 'rejected':
        return 'Rejected';
      case 'position_filled':
        return 'Position filled';
      case 'no_longer_interested':
        return 'No longer interested';
      case 'other':
        return 'Other';
    }
  };

  return (
    <BaseLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Archived Applications
            </h2>
          </div>
        </div>

        <div className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {archivedApplications.length > 0 ? (
            archivedApplications.map(application => (
              <Card key={application.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{application.position}</h3>
                    <p className="mt-1 text-sm text-gray-500">{application.companyName}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Applied:</span>{' '}
                    {new Date(application.dateApplied).toLocaleDateString()}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Archived:</span>{' '}
                    {new Date(application.dateArchived).toLocaleDateString()}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Reason:</span>{' '}
                    {getReasonText(application.reason)}
                  </p>
                </div>
                {application.notes && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900">Notes</h4>
                    <p className="mt-1 text-sm text-gray-500">{application.notes}</p>
                  </div>
                )}
                <div className="mt-6">
                  <Button
                    variant="secondary"
                    onClick={() => handleUnarchive(application.id)}
                  >
                    Move to Active
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <div className="sm:col-span-2 lg:col-span-3">
              <Card className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No archived applications</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Applications you archive will appear here.
                </p>
                <div className="mt-6">
                  <Link to="/dashboard">
                    <Button>
                      View Active Applications
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </BaseLayout>
  );
};

export default ArchiveView;
