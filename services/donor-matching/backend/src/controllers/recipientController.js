import Recipient from '../models/Recipient.js';

// @desc    Create new recipient
// @route   POST /api/recipients
// @access  Private (Clinician only)
export const createRecipient = async (req, res) => {
    try {
        const recipientData = {
            ...req.body,
            addedBy: req.user._id
        };

        const recipient = await Recipient.create(recipientData);

        res.status(201).json({
            success: true,
            message: 'Recipient created successfully',
            data: recipient
        });
    } catch (error) {
        // Handle duplicate recipientId error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Recipient ID already exists'
            });
        }

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: messages
            });
        }

        console.error('Create recipient error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get all recipients
// @route   GET /api/recipients
// @access  Private
export const getAllRecipients = async (req, res) => {
    try {
        const { status, bloodGroup, urgencyScore } = req.query;

        let filter = {};
        if (status) filter.status = status;
        if (bloodGroup) filter.bloodGroup = bloodGroup;
        if (urgencyScore) filter.urgencyScore = { $gte: parseInt(urgencyScore) };

        const recipients = await Recipient.find(filter)
            .populate('addedBy', 'name email role')
            .sort({ urgencyScore: -1, waitingTime: -1 });

        res.status(200).json({
            success: true,
            count: recipients.length,
            data: recipients
        });
    } catch (error) {
        console.error('Get recipients error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get recipient by ID
// @route   GET /api/recipients/:id
// @access  Private
export const getRecipientById = async (req, res) => {
    try {
        const recipient = await Recipient.findById(req.params.id)
            .populate('addedBy', 'name email role');

        if (!recipient) {
            return res.status(404).json({
                success: false,
                message: 'Recipient not found'
            });
        }

        res.status(200).json({
            success: true,
            data: recipient
        });
    } catch (error) {
        console.error('Get recipient error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Update recipient
// @route   PUT /api/recipients/:id
// @access  Private (Clinician only)
export const updateRecipient = async (req, res) => {
    try {
        const recipient = await Recipient.findById(req.params.id);

        if (!recipient) {
            return res.status(404).json({
                success: false,
                message: 'Recipient not found'
            });
        }

        const updatedRecipient = await Recipient.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            message: 'Recipient updated successfully',
            data: updatedRecipient
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: messages
            });
        }

        console.error('Update recipient error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Delete recipient
// @route   DELETE /api/recipients/:id
// @access  Private (Clinician only)
export const deleteRecipient = async (req, res) => {
    try {
        const recipient = await Recipient.findById(req.params.id);

        if (!recipient) {
            return res.status(404).json({
                success: false,
                message: 'Recipient not found'
            });
        }

        await recipient.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Recipient deleted successfully'
        });
    } catch (error) {
        console.error('Delete recipient error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get recipient statistics
// @route   GET /api/recipients/stats/summary
// @access  Private
export const getRecipientStats = async (req, res) => {
    try {
        const totalRecipients = await Recipient.countDocuments();
        const waitingRecipients = await Recipient.countDocuments({ status: 'waiting' });
        const matchedRecipients = await Recipient.countDocuments({ status: 'matched' });

        const urgencyStats = await Recipient.aggregate([
            {
                $group: {
                    _id: '$urgencyScore',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: -1 }
            }
        ]);

        const bloodGroupStats = await Recipient.aggregate([
            {
                $group: {
                    _id: '$bloodGroup',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                total: totalRecipients,
                waiting: waitingRecipients,
                matched: matchedRecipients,
                byUrgency: urgencyStats,
                byBloodGroup: bloodGroupStats
            }
        });
    } catch (error) {
        console.error('Get recipient stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
