import Lead from '../models/Lead.js';

/**
 * @desc    Get all leads with pagination, sorting, and filtering
 * @route   GET /api/leads
 * @access  Private
 * @sideEffects Reads from database, calculates pagination info
 */
export const getLeads = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', source, dateFrom, dateTo } = req.query;

    const filter = { owner: req.user._id };

    if (status && status !== 'All') {
      filter.status = status;
    }
    
    if (source && source !== 'All') {
      filter.source = source;
    }

    if (search) {
      const regex = { $regex: search, $options: 'i' };
      filter.$or = [{ name: regex }, { company: regex }, { email: regex }];
    }
    
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    const sortObj = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const parsedLimit = parseInt(limit);

    console.log(`[GET] /api/leads - User: ${req.user._id}`);
    
    const leads = await Lead.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(parsedLimit);

    const total = await Lead.countDocuments(filter);
    const pages = Math.ceil(total / parsedLimit);

    res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        total,
        page: parseInt(page),
        limit: parsedLimit,
        pages,
        hasNext: parseInt(page) < pages,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new lead
 * @route   POST /api/leads
 * @access  Private
 * @sideEffects Creates a new lead in the database
 */
export const createLead = async (req, res, next) => {
  try {
    const { name, company, email, phone, status, source, notes } = req.body;
    
    console.log(`[POST] /api/leads - User: ${req.user._id}`);

    const newLead = await Lead.create({
      name,
      company,
      email,
      phone,
      status,
      source,
      notes,
      owner: req.user._id
    });

    res.status(201).json({
      success: true,
      data: newLead
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get lead by ID
 * @route   GET /api/leads/:id
 * @access  Private
 * @sideEffects None
 */
export const getLeadById = async (req, res, next) => {
  try {
    console.log(`[GET] /api/leads/${req.params.id} - User: ${req.user._id}`);
    
    const lead = await Lead.findOne({ _id: req.params.id, owner: req.user._id });

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update lead
 * @route   PUT /api/leads/:id
 * @access  Private
 * @sideEffects Updates the specified lead fields in database
 */
export const updateLead = async (req, res, next) => {
  try {
    console.log(`[PUT] /api/leads/${req.params.id} - User: ${req.user._id}`);

    // prevent changing owner
    const updateData = { ...req.body };
    delete updateData.owner;

    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update lead status only
 * @route   PATCH /api/leads/:id/status
 * @access  Private
 * @sideEffects Updates the status field of a lead
 */
export const updateLeadStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    console.log(`[PATCH] /api/leads/${req.params.id}/status - User: ${req.user._id}`);

    const validStatuses = ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

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
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete lead
 * @route   DELETE /api/leads/:id
 * @access  Private
 * @sideEffects Removes lead from database
 */
export const deleteLead = async (req, res, next) => {
  try {
    console.log(`[DELETE] /api/leads/${req.params.id} - User: ${req.user._id}`);

    const lead = await Lead.findOne({ _id: req.params.id, owner: req.user._id });

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    await lead.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get dashboard statistics for leads
 * @route   GET /api/leads/stats
 * @access  Private
 * @sideEffects Uses MongoDB aggregation to gather high level stats
 */
export const getLeadStats = async (req, res, next) => {
  try {
    console.log(`[GET] /api/leads/stats - User: ${req.user._id}`);
    
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const stats = await Lead.aggregate([
      { $match: { owner: req.user._id } },
      {
        $facet: {
          statusBreakdown: [
            { $group: { _id: '$status', count: { $sum: 1 } } }
          ],
          sourceBreakdown: [
            { $group: { _id: '$source', count: { $sum: 1 } } }
          ],
          monthlyLeads: [
            {
              $project: {
                isThisMonth: { $gte: ['$createdAt', thisMonthStart] },
                isLastMonth: {
                  $and: [
                    { $gte: ['$createdAt', lastMonthStart] },
                    { $lte: ['$createdAt', lastMonthEnd] }
                  ]
                }
              }
            },
            {
              $group: {
                _id: null,
                thisMonthLeads: { $sum: { $cond: ['$isThisMonth', 1, 0] } },
                lastMonthLeads: { $sum: { $cond: ['$isLastMonth', 1, 0] } }
              }
            }
          ],
          total: [
            { $count: 'count' }
          ]
        }
      }
    ]);

    const result = stats[0];
    const totalLeads = result.total[0] ? result.total[0].count : 0;
    
    const statusBreakdown = {};
    let wonLeads = 0;
    result.statusBreakdown.forEach(s => {
      statusBreakdown[s._id] = s.count;
      if (s._id === 'Won') wonLeads = s.count;
    });

    const sourceBreakdown = {};
    result.sourceBreakdown.forEach(s => {
      sourceBreakdown[s._id] = s.count;
    });

    const thisMonthLeads = result.monthlyLeads[0] ? result.monthlyLeads[0].thisMonthLeads : 0;
    const lastMonthLeads = result.monthlyLeads[0] ? result.monthlyLeads[0].lastMonthLeads : 0;

    const growthRate = lastMonthLeads === 0 
      ? (thisMonthLeads > 0 ? 100 : 0) 
      : ((thisMonthLeads - lastMonthLeads) / lastMonthLeads) * 100;

    const conversionRate = totalLeads > 0 ? parseFloat(((wonLeads / totalLeads) * 100).toFixed(1)) : 0;

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
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get monthly lead statistics for the last 6 months
 * @route   GET /api/leads/stats/monthly
 * @access  Private
 * @sideEffects Uses MongoDB aggregation pipeline for time-series data
 */
export const getMonthlyStats = async (req, res, next) => {
  try {
    console.log(`[GET] /api/leads/stats/monthly - User: ${req.user._id}`);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const stats = await Lead.aggregate([
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
          won: {
            $sum: { $cond: [{ $eq: ['$status', 'Won'] }, 1, 0] }
          },
          lost: {
            $sum: { $cond: [{ $eq: ['$status', 'Lost'] }, 1, 0] }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedStats = [];
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      
      const found = stats.find(s => s._id.year === year && s._id.month === month);
      
      const total = found ? found.total : 0;
      const won = found ? found.won : 0;
      const lost = found ? found.lost : 0;
      const conversionRate = total > 0 ? parseFloat(((won / total) * 100).toFixed(1)) : 0;

      formattedStats.push({
        month: `${monthNames[month - 1]} ${year}`,
        total,
        won,
        lost,
        conversionRate
      });
    }

    res.status(200).json({
      success: true,
      data: formattedStats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Search leads quickly
 * @route   GET /api/leads/search
 * @access  Private
 * @param   {string} req.query.q - Search query string
 * @param   {string} req.query.limit - Number of results to return
 * @sideEffects Reads from database
 */
export const searchLeads = async (req, res, next) => {
  try {
    const { q, limit = 5 } = req.query;
    console.log(`[GET] /api/leads/search - User: ${req.user._id}, Query: ${q}`);
    
    if (!q) {
      return res.status(200).json({ success: true, data: [] });
    }
    
    const regex = { $regex: q, $options: 'i' };
    const filter = {
      owner: req.user._id,
      $or: [{ name: regex }, { company: regex }, { email: regex }]
    };
    
    const leads = await Lead.find(filter)
      .select('_id name company email status')
      .limit(parseInt(limit));
      
    res.status(200).json({ success: true, data: leads });
  } catch(error) {
    next(error);
  }
};
