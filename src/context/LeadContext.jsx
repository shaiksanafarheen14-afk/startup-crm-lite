import { createContext, useState, useContext, useCallback } from 'react';
import toast from 'react-hot-toast';
import leadService from '../services/leadService';

export const LeadContext = createContext(null);

export const LeadProvider = ({ children }) => {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({});

  const fetchLeads = useCallback(async (params) => {
    setIsLoading(true);
    try {
      const response = await leadService.getLeads(params);
      if (response.success) {
        setLeads(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch leads');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addLead = async (leadData) => {
    try {
      const response = await leadService.createLead(leadData);
      if (response.success) {
        setLeads(prevLeads => [response.data, ...prevLeads]);
        toast.success('Lead created successfully');
      }
    } catch (error) {
      if (error.response?.data?.errors?.length) {
         error.response.data.errors.forEach(err => toast.error(err.message));
      } else {
         toast.error(error.response?.data?.message || 'Failed to create lead');
      }
      throw error; 
    }
  };

  const updateLead = async (id, updatedLeadData) => {
    try {
      const response = await leadService.updateLead(id, updatedLeadData);
      if (response.success) {
        setLeads(prevLeads => 
          prevLeads.map(lead => (lead.id === id || lead._id === id ? response.data : lead))
        );
        toast.success('Lead updated successfully');
      }
    } catch (error) {
      if (error.response?.data?.errors?.length) {
         error.response.data.errors.forEach(err => toast.error(err.message));
      } else {
         toast.error(error.response?.data?.message || 'Failed to update lead');
      }
      throw error;
    }
  };

  const deleteLead = async (id) => {
    try {
      const response = await leadService.deleteLead(id);
      if (response.success) {
        setLeads(prevLeads => prevLeads.filter(lead => lead.id !== id && lead._id !== id));
        toast.success('Lead deleted successfully');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete lead');
    }
  };

  const getLeadById = (id) => {
    return leads.find(lead => lead.id === id || lead._id === id);
  };

  const value = {
    leads,
    isLoading,
    pagination,
    fetchLeads,
    addLead,
    updateLead,
    deleteLead,
    getLeadById
  };

  return (
    <LeadContext.Provider value={value}>
      {children}
    </LeadContext.Provider>
  );
};

export const useLeads = () => {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error("useLeads must be used within a LeadProvider");
  }
  return context;
};
