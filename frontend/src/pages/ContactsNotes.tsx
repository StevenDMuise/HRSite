import React, { useState } from 'react';
import BaseLayout from '../components/layout/BaseLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

interface Contact {
  id: string;
  name: string;
  role: string;
  company: string;
  email: string;
  phone?: string;
  notes: string;
  lastContactDate: string;
}

const ContactsNotes: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [newContact, setNewContact] = useState<Omit<Contact, 'id'>>({
    name: '',
    role: '',
    company: '',
    email: '',
    phone: '',
    notes: '',
    lastContactDate: new Date().toISOString().split('T')[0]
  });

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add API call to save contact
    const contact: Contact = {
      id: Date.now().toString(),
      ...newContact
    };
    setContacts([...contacts, contact]);
    setIsAddingContact(false);
    setNewContact({
      name: '',
      role: '',
      company: '',
      email: '',
      phone: '',
      notes: '',
      lastContactDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewContact(prev => ({
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
              Contacts & Notes
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Button onClick={() => setIsAddingContact(true)}>
              Add Contact
            </Button>
          </div>
        </div>

        {isAddingContact && (
          <Card className="mt-8">
            <form onSubmit={handleAddContact} className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <Input
                    label="Name"
                    type="text"
                    name="name"
                    required
                    value={newContact.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Input
                    label="Role"
                    type="text"
                    name="role"
                    value={newContact.role}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Input
                    label="Company"
                    type="text"
                    name="company"
                    required
                    value={newContact.company}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    required
                    value={newContact.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Input
                    label="Phone"
                    type="tel"
                    name="phone"
                    value={newContact.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Input
                    label="Last Contact Date"
                    type="date"
                    name="lastContactDate"
                    value={newContact.lastContactDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    rows={4}
                    value={newContact.notes}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => setIsAddingContact(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Save Contact
                </Button>
              </div>
            </form>
          </Card>
        )}

        <div className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {contacts.length > 0 ? (
            contacts.map(contact => (
              <Card key={contact.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{contact.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{contact.role}</p>
                    <p className="text-sm text-gray-500">{contact.company}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Email:</span> {contact.email}
                  </p>
                  {contact.phone && (
                    <p className="text-sm">
                      <span className="font-medium">Phone:</span> {contact.phone}
                    </p>
                  )}
                  <p className="text-sm">
                    <span className="font-medium">Last Contact:</span>{' '}
                    {new Date(contact.lastContactDate).toLocaleDateString()}
                  </p>
                </div>
                {contact.notes && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900">Notes</h4>
                    <p className="mt-1 text-sm text-gray-500">{contact.notes}</p>
                  </div>
                )}
              </Card>
            ))
          ) : (
            <div className="sm:col-span-2 lg:col-span-3">
              <Card className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No contacts</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding a new contact.</p>
                <div className="mt-6">
                  <Button onClick={() => setIsAddingContact(true)}>
                    Add Your First Contact
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </BaseLayout>
  );
};

export default ContactsNotes;
