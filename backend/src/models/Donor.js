import mongoose from 'mongoose';

const donorSchema = new mongoose.Schema({
    // Basic identification
    donorId: {
        type: String,
        required: [true, 'Donor ID is required'],
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },

    // Demographics
    age: {
        type: Number,
        required: [true, 'Age is required'],
        min: [18, 'Donor must be at least 18 years old'],
        max: [70, 'Donor must be under 70 years old']
    },
    weight: {
        type: Number,
        required: [true, 'Weight is required'],
        min: [30, 'Weight must be at least 30 kg']
    },
    gender: {
        type: String,
        required: [true, 'Gender is required'],
        enum: ['male', 'female']
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true
    },

    // Medical information
    bloodGroup: {
        type: String,
        required: [true, 'Blood group is required'],
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    hlaTyping: {
        type: String,
        required: [true, 'HLA typing is required'],
        trim: true
    },

    // Medical data for ML predictions
    bmi: {
        type: Number,
        required: false
    },
    creatinine: {
        type: Number,
        required: false,
        min: [0, 'Creatinine cannot be negative']
    },
    gfr: {
        type: Number,
        required: false,
        min: [0, 'GFR cannot be negative']
    },
    systolicBP: {
        type: Number,
        required: false,
        min: [60, 'Systolic BP too low'],
        max: [250, 'Systolic BP too high']
    },
    diastolicBP: {
        type: Number,
        required: false,
        min: [40, 'Diastolic BP too low'],
        max: [150, 'Diastolic BP too high']
    },
    smoking: {
        type: Boolean,
        default: false
    },
    diabetes: {
        type: Boolean,
        default: false
    },
    hypertension: {
        type: Boolean,
        default: false
    },

    // Status tracking
    status: {
        type: String,
        enum: ['active', 'matched', 'inactive'],
        default: 'active'
    },

    // Added by which user
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }
}, {
    timestamps: true
});

// Calculate BMI if weight and height are provided (we'll derive from weight-based estimation)
donorSchema.pre('save', function (next) {
    // Auto-calculate BMI if not provided but weight is available
    // Using a reasonable height estimate if needed
    if (!this.bmi && this.weight) {
        // This is a placeholder - frontend should ideally provide height
        // For now, we'll leave BMI to be calculated on frontend or provided directly
    }
    next();
});

const Donor = mongoose.model('Donor', donorSchema);

export default Donor;
