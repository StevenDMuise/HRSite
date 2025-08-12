import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseLayout from '../components/layout/BaseLayout';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

interface FormData {
  companyName: string;
  position: string;
  location: string;
  jobPostingUrl: string;
  salaryRange: string;
  status: string;
  notes: string;
  resumeLink?: string;
  coverLetterLink?: string;
}

const JobApplicationForm: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    position: '',
    location: '',
    jobPostingUrl: '',
    salaryRange: '',
    status: 'applied',
    notes: '',
    resumeLink: '',
    coverLetterLink: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // TODO: Add API call to save application
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              New Application
            </h2>
          </div>
        </div>

        <Card className="mt-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input
                  label="Company Name"
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <Input
                  label="Position"
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Input
                  label="Location"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Input
                  label="Salary Range"
                  type="text"
                  name="salaryRange"
                  value={formData.salaryRange}
                  onChange={handleChange}
                  placeholder="e.g., $80,000 - $100,000"
                />
              </div>

              <div className="sm:col-span-2">
                <Input
                  label="Job Posting URL"
                  type="url"
                  name="jobPostingUrl"
                  value={formData.jobPostingUrl}
                  onChange={handleChange}
                  placeholder="https://"
                />
              </div>

              <div className="sm:col-span-2">
                <Input
                  label="Resume Link"
                  type="url"
                  name="resumeLink"
                  value={formData.resumeLink}
                  onChange={handleChange}
                  placeholder="Link to your resume for this application"
                />
              </div>

              <div className="sm:col-span-2">
                <Input
                  label="Cover Letter Link"
                  type="url"
                  name="coverLetterLink"
                  value={formData.coverLetterLink}
                  onChange={handleChange}
                  placeholder="Link to your cover letter for this application"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="applied">Applied</option>
                  <option value="interviewing">Interviewing</option>
                  <option value="offered">Offered</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  name="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => navigate('/dashboard')}
                type="button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                Save Application
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </BaseLayout>
  );
};

export default JobApplicationForm;
