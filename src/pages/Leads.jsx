import React, { useState } from 'react';
import { Plus, LayoutGrid, List as ListIcon, X } from 'lucide-react';
import toast from 'react-hot-toast';

import LeadCard from '../components/leads/LeadCard';
import LeadTable from '../components/leads/LeadTable';
import LeadForm from '../components/leads/LeadForm';
import SearchBar from '../components/common/SearchBar';
import FilterBar from '../components/common/FilterBar';
import EmptyState from '../components/common/EmptyState';
import { useLeads } from '../context/LeadContext';

const Leads = () => {
  const { leads, addLead, updateLead, deleteLead } = useLeads();
  const [viewMode, setViewMode] = useState('table');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const handleAddClick = () => {
    setSelectedLead(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLead(null);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setActiveFilter('All');
  };

  const handleFormSubmit = (formData) => {
    if (selectedLead) {
      updateLead({ ...formData, id: selectedLead.id, date: selectedLead.date, createdAt: selectedLead.createdAt });
      toast.success('Lead updated successfully!');
    } else {
      addLead(formData);
      toast.success('New lead created!');
    }
    closeModal();
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this lead?');
    if (confirmDelete) {
      deleteLead(id);
      toast.error('Lead deleted.');
    }
  };

  const filteredLeads = leads
    .filter(lead => activeFilter === 'All' || lead.status === activeFilter)
    .filter(lead => {
      const query = searchQuery.toLowerCase();
      return (
        lead.name.toLowerCase().includes(query) ||
        lead.company.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query)
      );
    });

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 bg-background transition-colors duration-200 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-text tracking-tight">Lead Management</h1>
          <p className="text-sm md:text-base text-text-secondary mt-1">Manage and track your entire sales pipeline.</p>
        </div>

        <div className="flex flex-row items-center justify-between md:justify-end space-x-3 w-full md:w-auto">
          {/* View Toggle Buttons - Hidden on Mobile since we force grid view */}
          <div className="hidden md:flex bg-surface border border-border rounded-lg p-1 shadow-sm transition-colors duration-200">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md min-h-[44px] min-w-[44px] transition-colors flex items-center justify-center ${viewMode === 'table' ? 'bg-surface  text-accent ' : 'text-text-secondary  hover:text-text-secondary '}`}
              aria-label="Table View"
            >
              <ListIcon size={18} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md min-h-[44px] min-w-[44px] transition-colors flex items-center justify-center ${viewMode === 'grid' ? 'bg-surface  text-accent ' : 'text-text-secondary  hover:text-text-secondary '}`}
              aria-label="Grid View"
            >
              <LayoutGrid size={18} />
            </button>
          </div>

          <button
            onClick={handleAddClick}
            className="flex flex-1 md:flex-none items-center justify-center px-4 py-2.5 min-h-[44px] bg-accent text-white font-medium rounded-lg hover:opacity-90 dark:bg-accent dark:hover:bg-accent transition-colors shadow-sm"
          >
            <Plus size={18} className="mr-2" />
            Add New Lead
          </button>
        </div>
      </div>

      <div className="mb-6 space-y-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} leads={leads} />
      </div>

      {filteredLeads.length === 0 ? (
        <EmptyState 
          isTotalEmpty={leads.length === 0} 
          onClearFilters={handleClearFilters} 
        />
      ) : (
        <>
          {/* Table View Wrapper - Hidden on Mobile entirely */}
          <div className={viewMode === 'table' ? 'hidden md:block' : 'hidden'}>
            <LeadTable leads={filteredLeads} onEdit={handleEditClick} onDelete={handleDelete} />
          </div>

          {/* Grid/Card View Wrapper - Force block on Mobile, respect viewMode on Desktop */}
          <div className={viewMode === 'grid' ? 'block' : 'block md:hidden'}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredLeads.map(lead => (
                <LeadCard key={lead.id} lead={lead} onEdit={handleEditClick} onDelete={handleDelete} />
              ))}
            </div>
          </div>
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
          {/* 
            Responsive Modal Box
            Mobile: Takes up entire viewport, slides up from bottom (items-end above, w-full h-full here)
            Tablet+: Max-width, rounded corners, auto height
          */}
          <div className="bg-surface w-full h-full md:h-auto md:max-w-lg md:max-h-[90vh] md:rounded-xl shadow-2xl overflow-y-auto animate-in slide-in-from-bottom-full md:fade-in md:zoom-in-95 duration-200 border-0 md:border md:border-border transition-colors">
            
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-border sticky top-0 bg-surface z-10 transition-colors">
              <h2 className="text-lg md:text-xl font-bold text-text">
                {selectedLead ? 'Edit Lead' : 'Add New Lead'}
              </h2>
              <button
                onClick={closeModal}
                className="text-slate-400 dark:text-text-secondary hover:text-text-secondary transition-colors p-2 min-h-[44px] min-w-[44px] rounded-full hover:bg-surface flex items-center justify-center"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 md:p-6 pb-20 md:pb-6">
              <LeadForm 
                initialData={selectedLead} 
                onSubmit={handleFormSubmit} 
                onCancel={closeModal} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
