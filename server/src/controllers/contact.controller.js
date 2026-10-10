const Contact = require('../models/Contact');

/**
 * @desc    Submit a contact form
 * @route   POST /api/contact
 * @access  Public
 */
const submitContact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);

    // TODO: Send email notification to owner (integrate with nodemailer or a service like SendGrid)
    // For now, just save to DB

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been sent. We will get back to you soon.',
      data: { id: contact._id },
    });
  } catch (error) {
    console.error('Submit contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again.',
    });
  }
};

/**
 * @desc    Get all contact submissions (admin)
 * @route   GET /api/contact
 * @access  Private/Admin
 */
const getContacts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      read,
      type,
    } = req.query;

    const query = { isArchived: false };

    if (read === 'true') query.isRead = true;
    if (read === 'false') query.isRead = false;
    if (type) query.type = type;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [contacts, total, unreadCount] = await Promise.all([
      Contact.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Contact.countDocuments(query),
      Contact.countDocuments({ isRead: false, isArchived: false }),
    ]);

    res.json({
      success: true,
      data: contacts,
      unreadCount,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contacts',
    });
  }
};

/**
 * @desc    Mark contact as read
 * @route   PUT /api/contact/:id/read
 * @access  Private/Admin
 */
const markAsRead = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found',
      });
    }

    res.json({
      success: true,
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update contact',
    });
  }
};

/**
 * @desc    Archive a contact
 * @route   DELETE /api/contact/:id
 * @access  Private/Admin
 */
const archiveContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isArchived: true },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found',
      });
    }

    res.json({
      success: true,
      message: 'Contact archived',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to archive contact',
    });
  }
};

module.exports = {
  submitContact,
  getContacts,
  markAsRead,
  archiveContact,
};
