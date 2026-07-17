import React, { useState, useEffect } from 'react';

const STATUS_OPTIONS = ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];
const SOURCE_OPTIONS = ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'];

const LeadForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'New',
    source: 'Website',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email is invalid';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const inputBaseClasses = "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition-shadow bg-surface  text-text ";

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">
          Name <span className="text-error">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`${inputBaseClasses} ${
            errors.name 
              ? 'border-red-500 focus:ring-red-200 ' 
              : 'border-border  focus:ring-blue-200  focus:border-blue-500 '
          }`}
          placeholder="e.g. Jane Doe"
        />
        {errors.name && <p className="mt-1 text-sm text-error">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-medium text-text-secondary mb-1">
          Company <span className="text-error">*</span>
        </label>
        <input
          type="text"
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          className={`${inputBaseClasses} ${
            errors.company 
              ? 'border-red-500 focus:ring-red-200 ' 
              : 'border-border  focus:ring-blue-200  focus:border-blue-500 '
          }`}
          placeholder="e.g. Acme Corp"
        />
        {errors.company && <p className="mt-1 text-sm text-error">{errors.company}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">
          Email <span className="text-error">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`${inputBaseClasses} ${
            errors.email 
              ? 'border-red-500 focus:ring-red-200 ' 
              : 'border-border  focus:ring-blue-200  focus:border-blue-500 '
          }`}
          placeholder="jane@acme.com"
        />
        {errors.email && <p className="mt-1 text-sm text-error">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-text-secondary mb-1">
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={`${inputBaseClasses} border-border  focus:ring-blue-200  focus:border-blue-500`}
          placeholder="+1 (555) 000-0000"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-text-secondary mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={`${inputBaseClasses} border-border  focus:ring-blue-200  focus:border-blue-500`}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="source" className="block text-sm font-medium text-text-secondary mb-1">
            Source
          </label>
          <select
            id="source"
            name="source"
            value={formData.source}
            onChange={handleChange}
            className={`${inputBaseClasses} border-border  focus:ring-blue-200  focus:border-blue-500`}
          >
            {SOURCE_OPTIONS.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-border">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 text-sm font-medium text-text-secondary bg-surface border border-border rounded-lg hover:bg-background focus:outline-none focus:ring-2 focus:ring-slate-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 text-sm font-medium text-white bg-accent border border-transparent rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors shadow-sm"
        >
          {initialData ? 'Update Lead' : 'Create Lead'}
        </button>
      </div>
    </form>
  );
};

export default LeadForm;
