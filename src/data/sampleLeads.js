/**
 * Realistic sample data for the CRM.
 * Used as the initial state when localStorage is completely empty.
 */
export const sampleLeads = [
  {
    id: 'lead-001',
    name: 'Aarav Sharma',
    company: 'TechMahindra Solutions',
    email: 'aarav.sharma@techmahindra.example.in',
    phone: '+91 98765 43210',
    status: 'New',
    source: 'LinkedIn',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    date: new Date(Date.now() - 86400000 * 2).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  },
  {
    id: 'lead-002',
    name: 'Priya Patel',
    company: 'Flipkart Innovations',
    email: 'priya.p@flipkart.example.in',
    phone: '+91 87654 32109',
    status: 'New',
    source: 'Website',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
    date: new Date(Date.now() - 86400000 * 1).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  },
  {
    id: 'lead-003',
    name: 'Rohan Gupta',
    company: 'Zomato Enterprises',
    email: 'r.gupta@zomato.example.com',
    phone: '+91 76543 21098',
    status: 'Contacted',
    source: 'Cold Call',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    date: new Date(Date.now() - 86400000 * 5).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  },
  {
    id: 'lead-004',
    name: 'Ananya Desai',
    company: 'Ola Cabs Group',
    email: 'ananya.d@ola.example.in',
    phone: '+91 65432 10987',
    status: 'Meeting Scheduled',
    source: 'Referral',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
    date: new Date(Date.now() - 86400000 * 7).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  },
  {
    id: 'lead-005',
    name: 'Karan Singh',
    company: 'Swiggy Logistics',
    email: 'karan.s@swiggy.example.com',
    phone: '+91 54321 09876',
    status: 'Won',
    source: 'Email Campaign',
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(), // 14 days ago
    date: new Date(Date.now() - 86400000 * 14).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  },
  {
    id: 'lead-006',
    name: 'Meera Iyer',
    company: 'Freshworks Inc',
    email: 'm.iyer@freshworks.example.com',
    phone: '+91 43210 98765',
    status: 'Lost',
    source: 'Other',
    createdAt: new Date(Date.now() - 86400000 * 21).toISOString(), // 21 days ago
    date: new Date(Date.now() - 86400000 * 21).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
];
