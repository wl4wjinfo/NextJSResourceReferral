'use client';

import { useState } from 'react';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Supply {
  name: string;
  quantity: number;
}

export default function EventTracker() {
  const [attendeeCount, setAttendeeCount] = useState(0);
  
  const supplyOptions = [
    'Covid Test kits',
    'Education coloring book and crayons',
    'Educational info',
    'Facemasks',
    'Food / Snack',
    'Hand sanitizer',
    'Health info',
    'Medicaid info',
    'Organization T\'Shirt',
    'Organizational bag',
    'Plant',
    'Plant education card',
    'Seed packet',
    'State budget info',
    'WL4WJ 5X7 card',
    'Water'
  ].sort();

  const [formData, setFormData] = useState({
    team: 'Sandhills',
    eventName: '',
    eventStart: '',
    eventEnd: '',
    location: '',
    eventDate: new Date(),
    volunteers: [] as string[],
    chwsAttended: [] as string[],
    supplies: [] as Supply[],
  });

  const [newVolunteer, setNewVolunteer] = useState('');
  const [newChw, setNewChw] = useState('');
  const [newSupply, setNewSupply] = useState<Supply>({
    name: '',
    quantity: 0
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date: Date | null) => {
    setFormData(prev => ({
      ...prev,
      eventDate: date || new Date()
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save the event data
    const formattedData = {
      ...formData,
      eventDate: formData.eventDate.toISOString().split('T')[0], // Format date as YYYY-MM-DD
    };
    console.log('Form submitted:', { ...formattedData, attendeeCount });
  };

  const incrementAttendeeCount = () => {
    setAttendeeCount(prev => prev + 1);
  };

  const calculateTotalTime = () => {
    if (!formData.eventStart || !formData.eventEnd) return '';
    
    const start = new Date(`2000-01-01T${formData.eventStart}`);
    const end = new Date(`2000-01-01T${formData.eventEnd}`);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return '';
    
    const diff = end.getTime() - start.getTime();
    if (diff < 0) return '';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  };

  const handleAddVolunteer = () => {
    if (newVolunteer.trim()) {
      setFormData(prev => ({
        ...prev,
        volunteers: [...prev.volunteers, newVolunteer.trim()]
      }));
      setNewVolunteer('');
    }
  };

  const handleRemoveVolunteer = (index: number) => {
    setFormData(prev => ({
      ...prev,
      volunteers: prev.volunteers.filter((_, i) => i !== index)
    }));
  };

  const handleAddChw = () => {
    if (newChw.trim()) {
      setFormData(prev => ({
        ...prev,
        chwsAttended: [...prev.chwsAttended, newChw.trim()]
      }));
      setNewChw('');
    }
  };

  const handleRemoveChw = (index: number) => {
    setFormData(prev => ({
      ...prev,
      chwsAttended: prev.chwsAttended.filter((_, i) => i !== index)
    }));
  };

  const handleAddSupply = () => {
    if (newSupply.name && newSupply.quantity > 0) {
      setFormData(prev => ({
        ...prev,
        supplies: [...prev.supplies, { ...newSupply }]
      }));
      setNewSupply({ name: '', quantity: 0 });
    }
  };

  const handleRemoveSupply = (index: number) => {
    setFormData(prev => ({
      ...prev,
      supplies: prev.supplies.filter((_, i) => i !== index)
    }));
  };

  const handleSupplyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSupply(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value
    }));
  };

  return (
    <main className="min-h-screen bg-white p-8 pb-24">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Event Tracker</h1>
          <p className="text-gray-600">Track attendance and details for your events</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Team Selection */}
          <div>
            <label htmlFor="team" className="block text-sm font-medium text-gray-700 mb-1">
              Team
            </label>
            <select
              id="team"
              name="team"
              required
              value={formData.team}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Sandhills">Sandhills</option>
              <option value="Triad">Triad</option>
            </select>
          </div>

          {/* Event Date */}
          <div>
            <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-1">
              Event Date
            </label>
            <div className="relative">
              <DatePicker
                selected={formData.eventDate}
                onChange={handleDateChange}
                dateFormat="MMMM d, yyyy"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholderText="Select event date"
                showPopperArrow={false}
                required
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
          </div>

          {/* Event Name */}
          <div>
            <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-1">
              Event Name
            </label>
            <input
              type="text"
              id="eventName"
              name="eventName"
              required
              value={formData.eventName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter event name"
            />
          </div>

          {/* Event Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Event Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              required
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter event location"
            />
          </div>

          {/* Event Start Time */}
          <div>
            <label htmlFor="eventStart" className="block text-sm font-medium text-gray-700 mb-1">
              Event Start Time
            </label>
            <input
              type="time"
              id="eventStart"
              name="eventStart"
              required
              value={formData.eventStart}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Event End Time */}
          <div>
            <label htmlFor="eventEnd" className="block text-sm font-medium text-gray-700 mb-1">
              Event End Time
            </label>
            <input
              type="time"
              id="eventEnd"
              name="eventEnd"
              required
              value={formData.eventEnd}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Event Total Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Total Time
            </label>
            <div className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-700">
              {calculateTotalTime() || 'Please enter start and end times'}
            </div>
          </div>

          {/* Volunteers */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Volunteers
            </label>
            <div className="space-y-2">
              {formData.volunteers.map((volunteer, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span>{volunteer}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveVolunteer(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newVolunteer}
                  onChange={(e) => setNewVolunteer(e.target.value)}
                  placeholder="Add volunteer..."
                  className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddVolunteer}
                  className="p-2 text-blue-600 hover:text-blue-800"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* CHWs Attended */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              CHWs Attended
            </label>
            <div className="space-y-2">
              {formData.chwsAttended.map((chw, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span>{chw}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveChw(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <select
                  value={newChw}
                  onChange={(e) => setNewChw(e.target.value)}
                  className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select CHW...</option>
                  <option value="Ana">Ana</option>
                  <option value="Kim">Kim</option>
                  <option value="Brian">Brian</option>
                  <option value="Karina">Karina</option>
                  <option value="Carla">Carla</option>
                  <option value="Debra">Debra</option>
                  <option value="Yael">Yael</option>
                  <option value="Minerva">Minerva</option>
                  <option value="Darlene">Darlene</option>
                  <option value="Tony">Tony</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddChw}
                  disabled={!newChw}
                  className="p-2 text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:hover:text-gray-400"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Number of CHWs Attended */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of CHWs Attended
            </label>
            <div className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-700">
              {formData.chwsAttended.length} CHW{formData.chwsAttended.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Event Supplies Given */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Event Supplies Given
            </label>
            
            {/* Supply List */}
            {formData.supplies.length > 0 && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4 px-4 py-2 bg-gray-50 rounded-t font-medium text-sm text-gray-600">
                  <div>Supply Name</div>
                  <div>Quantity</div>
                </div>
                {formData.supplies.map((supply, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4 items-center bg-gray-50 px-4 py-2 rounded relative group">
                    <div>{supply.name}</div>
                    <div className="flex items-center justify-between">
                      <span>{supply.quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSupply(index)}
                        className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="text-sm text-gray-600 px-4">
                  Total Supplies: {formData.supplies.reduce((sum, supply) => sum + supply.quantity, 0)}
                </div>
              </div>
            )}

            {/* Add New Supply */}
            <div className="grid grid-cols-2 gap-4">
              <select
                name="name"
                value={newSupply.name}
                onChange={handleSupplyChange}
                className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select supply...</option>
                {supplyOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="quantity"
                  value={newSupply.quantity || ''}
                  onChange={handleSupplyChange}
                  placeholder="Quantity"
                  min="1"
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddSupply}
                  disabled={!newSupply.name || newSupply.quantity <= 0}
                  className="px-4 py-2 text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:hover:text-gray-400"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Attendee Counter */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Attendee Counter</h3>
                <p className="text-sm text-gray-500">Click the button to count each attendee</p>
              </div>
              <div className="text-3xl font-bold text-blue-600">{attendeeCount}</div>
            </div>
            <button
              type="button"
              onClick={incrementAttendeeCount}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Count Attendee
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Save Event
          </button>
        </form>
      </div>
      <BottomNav />
    </main>
  );
}
