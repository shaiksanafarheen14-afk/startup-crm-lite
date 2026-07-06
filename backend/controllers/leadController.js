import Lead from '../models/Lead.js';

/**
 * Get all leads with pagination, filtering, and search.
 * Inputs: req.query (page, limit, sortBy, sortOrder, status, search, source, dateFrom, dateTo)
 * Outputs: Paginated list of leads { total, page, limit, pages, hasNext, hasPrev }.
 * Side effects: None.
 */
export const getLeads = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      status,
      search,
      source,
      dateFrom,
      dateTo
    } = req.query;

    const filter = { owner: req.user._id };

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (source && source !== 'All') {
      filter.source = source;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const leads = await Lead.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const total = await Lead.countDocuments(filter);
    const pages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages,
        hasNext: pageNum < pages,
        hasPrev: pageNum > 1
      },
    });
  } catch (error) {
    console.error('Error in getLeads:', error);
    next(error);
  }
};

/**
 * Create a new lead.
 * Inputs: req.body
 * Outputs: The newly created lead.
 * Side effects: Saves a new document to the database.
 */
export const createLead = async (req, res, next) => {
  try {
    const leadData = {
      ...req.body,
      owner: req.user._id,
    };

    const newLead = await Lead.create(leadData);

    res.status(201).json({
      success: true,
      data: newLead,
    });
  } catch (error) {
    console.error('Error in createLead:', error);
    next(error);
  }
};

/**
 * Get a single lead by ID.
 * Inputs: req.params.id
 * Outputs: The requested lead.
 * Side effects: None.
 */
export const getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, owner: req.user._id });

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    console.error('Error in getLeadById:', error);
    next(error);
  }
};

/**
 * Update an existing lead.
 * Inputs: req.params.id, req.body
 * Outputs: The updated lead.
 * Side effects: Updates the corresponding document in the database.
 */
export const updateLead = async (req, res, next) => {
  try {
    if (req.body.owner) {
      delete req.body.owner;
    }

    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    console.error('Error in updateLead:', error);
    next(error);
  }
};

/**
 * Update the status of a lead.
 * Inputs: req.params.id, req.body.status
 * Outputs: The updated lead.
 * Side effects: Updates the status field of the lead in the database.
 */
export const updateLeadStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { status },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    console.error('Error in updateLeadStatus:', error);
    next(error);
  }
};

/**
 * Delete a lead.
 * Inputs: req.params.id
 * Outputs: Success message.
 * Side effects: Removes the lead from the database.
 */
export const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, owner: req.user._id });

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    await lead.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully',
    });
  } catch (error) {
    console.error('Error in deleteLead:', error);
    next(error);
  }
};

/**
 * Get dashboard statistics for leads using aggregation.
 * Inputs: None (uses req.user._id)
 * Outputs: totalLeads, statusBreakdown, conversionRate, sourceBreakdown, thisMonthLeads, lastMonthLeads, growthRate.
 * Side effects: None.
 */
export const getLeadStats = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const stats = await Lead.aggregate([
      { $match: { owner: req.user._id } },
      {
        $facet: {
          totalCounts: [
            { $count: "total" }
          ],
          statusCounts: [
            { $group: { _id: "$status", count: { $sum: 1 } } }
          ],
          sourceCounts: [
            { $group: { _id: "$source", count: { $sum: 1 } } }
          ],
          timeCounts: [
            {
              $group: {
                _id: null,
                thisMonth: {
                  $sum: { $cond: [{ $gte: ["$createdAt", startOfThisMonth] }, 1, 0] }
                },
                lastMonth: {
                  $sum: { 
                    $cond: [
                      { $and: [{ $gte: ["$createdAt", startOfLastMonth] }, { $lte: ["$createdAt", endOfLastMonth] }] }, 
                      1, 0
                    ] 
                  }
                }
              }
            }
          ]
        }
      }
    ]);

    const result = stats[0];
    const totalLeads = result.totalCounts.length > 0 ? result.totalCounts[0].total : 0;
    
    const statusBreakdown = result.statusCounts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    const sourceBreakdown = result.sourceCounts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    const wonLeads = statusBreakdown['Won'] || 0;
    const conversionRate = totalLeads > 0 ? Number(((wonLeads / totalLeads) * 100).toFixed(1)) : 0;

    const timeData = result.timeCounts.length > 0 ? result.timeCounts[0] : { thisMonth: 0, lastMonth: 0 };
    const thisMonthLeads = timeData.thisMonth;
    const lastMonthLeads = timeData.lastMonth;

    let growthRate = 0;
    if (lastMonthLeads > 0) {
      growthRate = Number((((thisMonthLeads - lastMonthLeads) / lastMonthLeads) * 100).toFixed(1));
    } else if (thisMonthLeads > 0) {
      growthRate = 100; 
    }

    res.status(200).json({
      success: true,
      data: {
        totalLeads,
        statusBreakdown,
        conversionRate,
        sourceBreakdown,
        thisMonthLeads,
        lastMonthLeads,
        growthRate
      },
    });
  } catch (error) {
    console.error('Error in getLeadStats:', error);
    next(error);
  }
};

/**
 * Get monthly statistics for the last 6 months.
 * Inputs: None (uses req.user._id)
 * Outputs: Array of monthly stats objects { month, total, won, lost, conversionRate }.
 * Side effects: None.
 */
export const getMonthlyStats = async (req, res, next) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5); 
    sixMonthsAgo.setDate(1); 
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyStats = await Lead.aggregate([
      { 
        $match: { 
          owner: req.user._id,
          createdAt: { $gte: sixMonthsAgo }
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          total: { $sum: 1 },
          won: { $sum: { $cond: [{ $eq: ['$status', 'Won'] }, 1, 0] } },
          lost: { $sum: { $cond: [{ $eq: ['$status', 'Lost'] }, 1, 0] } }
        }
      }
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Generate the last 6 months list to ensure zero-data months are included chronologically
    const last6Months = [];
    const d = new Date();
    d.setDate(1);
    for (let i = 5; i >= 0; i--) {
      const pastDate = new Date(d.getFullYear(), d.getMonth() - i, 1);
      last6Months.push({
        year: pastDate.getFullYear(),
        month: pastDate.getMonth() + 1, 
        label: `${monthNames[pastDate.getMonth()]} ${pastDate.getFullYear()}`
      });
    }

    const formattedStats = last6Months.map(m => {
      // Find if we have data for this month
      const stat = monthlyStats.find(s => s._id.year === m.year && s._id.month === m.month);
      const total = stat ? stat.total : 0;
      const won = stat ? stat.won : 0;
      const lost = stat ? stat.lost : 0;
      const conversionRate = total > 0 ? Number(((won / total) * 100).toFixed(1)) : 0;
      
      return {
        month: m.label,
        total,
        won,
        lost,
        conversionRate
      };
    });

    res.status(200).json({
      success: true,
      data: formattedStats,
    });
  } catch (error) {
    console.error('Error in getMonthlyStats:', error);
    next(error);
  }
};

/**
 * Quick search for autocomplete (debounced).
 * Inputs: req.query.q, req.query.limit
 * Outputs: Minimal lead objects matching the search.
 * Side effects: None.
 */
export const searchLeads = async (req, res, next) => {
  try {
    const { q = '', limit = 5 } = req.query;
    
    if (!q) {
      return res.status(200).json({ success: true, data: [] });
    }

    const filter = {
      owner: req.user._id,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { company: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ]
    };
    
    const limitNum = Math.min(parseInt(limit, 10), 10); 

    const leads = await Lead.find(filter)
      .select('_id name company email status')
      .limit(limitNum);

    res.status(200).json({
      success: true,
      data: leads
    });
  } catch (error) {
    console.error('Error in searchLeads:', error);
    next(error);
  }
};
