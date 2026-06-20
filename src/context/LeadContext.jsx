import React, { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { sampleLeads } from '../data/sampleLeads';

/**
 * @typedef {Object} Lead
 * @property {string} id - Unique identifier for the lead
 * @property {string} name - Full name of the lead
 * @property {string} company - Company name
 * @property {string} email - Contact email
 * @property {string} phone - Contact phone number
 * @property {'New' | 'Contacted' | 'Meeting Scheduled' | 'Proposal Sent' | 'Won' | 'Lost'} status - Current pipeline status
 * @property {'Website' | 'Referral' | 'LinkedIn' | 'Cold Call' | 'Email Campaign' | 'Other'} source - Acquisition source
 * @property {string} createdAt - ISO string representation of the creation date
 */

/**
 * @typedef {Object} LeadContextValue
 * @property {Lead[]} leads - Array of all leads
 * @property {function(Omit<Lead, 'id' | 'createdAt'>): void} addLead - Function to create a new lead
 * @property {function(Lead): void} updateLead - Function to update an existing lead
 * @property {function(string): void} deleteLead - Function to delete a lead by ID
 * @property {function(string): Lead | undefined} getLeadById - Function to retrieve a lead by ID
 */

// Create the Context with a null initial value to enforce usage within a Provider
export const LeadContext = createContext(null);

/**
 * Provider component that manages lead state and provides CRUD operations to its children.
 * Automatically synchronizes with localStorage via the useLocalStorage hook.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components that require access to the context
 * @returns {JSX.Element} The rendered Provider
 */
export const LeadProvider = ({ children }) => {
  // Use custom hook to handle state and localStorage sync seamlessly
  const [leads, setLeads] = useLocalStorage('startup-crm-leads', sampleLeads);

  /**
   * Adds a new lead to the state, automatically generating an ID and createdAt timestamp.
   *
   * @param {Omit<Lead, 'id' | 'createdAt'>} leadData - The user-provided lead data
   */
  const addLead = (leadData) => {
    const newLead = {
      ...leadData,
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      createdAt: new Date().toISOString(),
      // Ensure 'date' property is maintained for backward compatibility with UI components
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setLeads(prevLeads => [newLead, ...prevLeads]);
  };

  /**
   * Updates an existing lead in the state.
   *
   * @param {Lead} updatedLead - The complete lead object with updated values
   */
  const updateLead = (updatedLead) => {
    setLeads(prevLeads => 
      prevLeads.map(lead => (lead.id === updatedLead.id ? updatedLead : lead))
    );
  };

  /**
   * Deletes a lead from the state by its unique ID.
   *
   * @param {string} id - The ID of the lead to delete
   */
  const deleteLead = (id) => {
    setLeads(prevLeads => prevLeads.filter(lead => lead.id !== id));
  };

  /**
   * Retrieves a specific lead by its unique ID.
   *
   * @param {string} id - The ID of the lead to find
   * @returns {Lead | undefined} The found lead object, or undefined if not found
   */
  const getLeadById = (id) => {
    return leads.find(lead => lead.id === id);
  };

  // Define the context value object
  const value = {
    leads,
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

/**
 * Custom hook to consume the LeadContext.
 * Ensures the hook is used within a valid LeadProvider.
 *
 * @returns {LeadContextValue} The lead context value containing state and CRUD methods
 * @throws {Error} If called outside of a LeadProvider
 */
export const useLeads = () => {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error("useLeads must be used within a LeadProvider");
  }
  return context;
};
