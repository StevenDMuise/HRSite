import React from 'react';
import { Link } from 'react-router-dom';
import BaseLayout from '../components/layout/BaseLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

interface Application {
  id: string;
  companyName: string;
  position: string;
  status: 'applied' | 'interviewing' | 'offered' | 'rejected';
  dateApplied: string;
  nextStep?: string;
}

const Dashboard: React.FC = () => {
  // This will be replaced with actual API call later
  const applications: Application[] = [];
  
  const stats = [
    { label: 'Active Applications', value: '3', color: 'text-blue-600' },
    { label: 'Interviews Scheduled', value: '1', color: 'text-yellow-600' },
    { label: 'Applications this Week', value: '5', color: 'text-green-600' },
  ];

  return (
    <BaseLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <div className="sm:flex sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="mt-4 sm:mt-0">
            <Link to="/applications/new">
              <Button>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Application
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-3">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <dt className="text-sm font-medium text-gray-500">{stat.label}</dt>
              <dd className={`mt-1 text-3xl font-semibold ${stat.color}`}>{stat.value}</dd>
            </Card>
          ))}
        </div>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">Recent Applications</h2>
        
        <div className="mt-4 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {applications.length > 0 ? (
            applications.map((application) => (
              <Card key={application.id} className="hover:shadow-lg transition-shadow">
                <Link to={`/applications/${application.id}`}>
                  <h3 className="text-lg font-medium text-gray-900">{application.position}</h3>
                  <p className="mt-1 text-sm text-gray-500">{application.companyName}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${
                        application.status === 'applied' ? 'bg-blue-100 text-blue-800' :
                        application.status === 'interviewing' ? 'bg-yellow-100 text-yellow-800' :
                        application.status === 'offered' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(application.dateApplied).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <Card className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No applications</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new application.</p>
                <div className="mt-6">
                  <Link to="/applications/new">
                    <Button>Add Your First Application</Button>
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

export default Dashboard;
