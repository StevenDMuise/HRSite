import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import BaseLayout from '../components/layout/BaseLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

interface Interview {
  id: string;
  companyName: string;
  position: string;
  type: 'phone' | 'technical' | 'behavioral' | 'onsite';
  date: string;
  time: string;
  interviewers: string[];
  location?: string;
  meetingLink?: string;
  preparation: string;
  notes: string;
  outcome?: 'pending' | 'passed' | 'failed' | 'no-show';
}

const InterviewDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [interview, setInterview] = useState<Interview>({
    id: id || '',
    companyName: 'Example Corp',
    position: 'Software Engineer',
    type: 'technical',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    interviewers: ['John Doe'],
    preparation: '',
    notes: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add API call to save interview
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInterview(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <BaseLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Interview Details
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)}>
                Edit Details
              </Button>
            )}
          </div>
        </div>

        <Card className="mt-8">
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <Input
                    label="Company"
                    type="text"
                    name="companyName"
                    value={interview.companyName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Input
                    label="Position"
                    type="text"
                    name="position"
                    value={interview.position}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Interview Type
                  </label>
                  <select
                    name="type"
                    value={interview.type}
                    onChange={handleInputChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="phone">Phone Screen</option>
                    <option value="technical">Technical</option>
                    <option value="behavioral">Behavioral</option>
                    <option value="onsite">On-site</option>
                  </select>
                </div>
                <div>
                  <Input
                    label="Date"
                    type="date"
                    name="date"
                    value={interview.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Input
                    label="Time"
                    type="time"
                    name="time"
                    value={interview.time}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Input
                    label="Location/Meeting Link"
                    type="text"
                    name="meetingLink"
                    value={interview.meetingLink}
                    onChange={handleInputChange}
                    placeholder="Zoom link or office address"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Preparation Notes
                  </label>
                  <textarea
                    name="preparation"
                    rows={4}
                    value={interview.preparation}
                    onChange={handleInputChange}
                    placeholder="Topics to prepare, questions to ask..."
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Interview Notes
                  </label>
                  <textarea
                    name="notes"
                    rows={4}
                    value={interview.notes}
                    onChange={handleInputChange}
                    placeholder="Questions asked, your responses..."
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                {interview.outcome && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Outcome
                    </label>
                    <select
                      name="outcome"
                      value={interview.outcome}
                      onChange={handleInputChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="pending">Pending</option>
                      <option value="passed">Passed</option>
                      <option value="failed">Failed</option>
                      <option value="no-show">No Show</option>
                    </select>
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{interview.companyName}</h3>
                  <p className="mt-1 text-sm text-gray-500">{interview.position}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Interview Type</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {interview.type.charAt(0).toUpperCase() + interview.type.slice(1)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date & Time</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(interview.date).toLocaleDateString()} at {interview.time}
                  </p>
                </div>
                {interview.meetingLink && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Location/Meeting Link</p>
                    <p className="mt-1 text-sm text-gray-900">{interview.meetingLink}</p>
                  </div>
                )}
                {interview.preparation && (
                  <div className="sm:col-span-2">
                    <p className="text-sm font-medium text-gray-500">Preparation Notes</p>
                    <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                      {interview.preparation}
                    </p>
                  </div>
                )}
                {interview.notes && (
                  <div className="sm:col-span-2">
                    <p className="text-sm font-medium text-gray-500">Interview Notes</p>
                    <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                      {interview.notes}
                    </p>
                  </div>
                )}
                {interview.outcome && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Outcome</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {interview.outcome.charAt(0).toUpperCase() + interview.outcome.slice(1)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>
      </div>
    </BaseLayout>
  );
};

export default InterviewDetails;
