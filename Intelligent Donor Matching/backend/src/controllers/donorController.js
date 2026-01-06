import Donor from '../models/Donor.js';

// @desc    Create new donor
// @route   POST /api/donors
// @access  Private (Clinician only)
export const createDonor = async (req, res) => {
    try {
        const donorData = {
            ...req.body,
            addedBy: req.user._id
        };

        const donor = await Donor.create(donorData);

        res.status(201).json({
            success: true,
            message: 'Donor created successfully',
            data: donor
        });
    } catch (error) {
        // Handle duplicate donorId error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Donor ID already exists'
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

        console.error('Create donor error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get all donors
// @route   GET /api/donors
// @access  Private
export const getAllDonors = async (req, res) => {
    try {
        const { status, bloodGroup } = req.query;

        let filter = {};
        if (status) filter.status = status;
        if (bloodGroup) filter.bloodGroup = bloodGroup;

        const donors = await Donor.find(filter)
            .populate('addedBy', 'name email role')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: donors.length,
            data: donors
        });
    } catch (error) {
        console.error('Get donors error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get donor by ID
// @route   GET /api/donors/:id
// @access  Private
export const getDonorById = async (req, res) => {
    try {
        const donor = await Donor.findById(req.params.id)
            .populate('addedBy', 'name email role');

        if (!donor) {
            return res.status(404).json({
                success: false,
                message: 'Donor not found'
            });
        }

        res.status(200).json({
            success: true,
            data: donor
        });
    } catch (error) {
        console.error('Get donor error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Update donor
// @route   PUT /api/donors/:id
// @access  Private (Clinician only)
export const updateDonor = async (req, res) => {
    try {
        const donor = await Donor.findById(req.params.id);

        if (!donor) {
            return res.status(404).json({
                success: false,
                message: 'Donor not found'
            });
        }

        const updatedDonor = await Donor.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            message: 'Donor updated successfully',
            data: updatedDonor
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

        console.error('Update donor error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Delete donor
// @route   DELETE /api/donors/:id
// @access  Private (Clinician only)
export const deleteDonor = async (req, res) => {
    try {
        const donor = await Donor.findById(req.params.id);

        if (!donor) {
            return res.status(404).json({
                success: false,
                message: 'Donor not found'
            });
        }

        await donor.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Donor deleted successfully'
        });
    } catch (error) {
        console.error('Delete donor error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get donor statistics
// @route   GET /api/donors/stats/summary
// @access  Private
export const getDonorStats = async (req, res) => {
    try {
        const totalDonors = await Donor.countDocuments();
        const activeDonors = await Donor.countDocuments({ status: 'active' });
        const matchedDonors = await Donor.countDocuments({ status: 'matched' });

        const bloodGroupStats = await Donor.aggregate([
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
                total: totalDonors,
                active: activeDonors,
                matched: matchedDonors,
                byBloodGroup: bloodGroupStats
            }
        });
    } catch (error) {
        console.error('Get donor stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
