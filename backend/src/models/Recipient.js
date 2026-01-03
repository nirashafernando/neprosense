import mongoose from 'mongoose';

const recipientSchema = new mongoose.Schema({
    // Basic identification
    recipientId: {
        type: String,
        required: [true, 'Recipient ID is required'],
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
        min: [1, 'Age must be at least 1 year'],
        max: [90, 'Age must be under 90 years']
    },
    weight: {
        type: Number,
        required: [true, 'Weight is required'],
        min: [20, 'Weight must be at least 20 kg']
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

    // Recipient-specific information
    waitingTime: {
        type: Number,
        required: [true, 'Waiting time is required'],
        min: [0, 'Waiting time cannot be negative']
    },
    urgencyScore: {
        type: Number,
        required: [true, 'Urgency score is required'],
        min: [1, 'Urgency score must be between 1-10'],
        max: [10, 'Urgency score must be between 1-10']
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
    dialysisYears: {
        type: Number,
        required: false,
        min: [0, 'Dialysis years cannot be negative']
    },
    diabetes: {
        type: Boolean,
        default: false
    },
    hypertension: {
        type: Boolean,
        default: false
    },
    previousTransplants: {
        type: Number,
        default: 0,
        min: [0, 'Previous transplants cannot be negative']
    },

    // Status tracking
    status: {
        type: String,
        enum: ['waiting', 'matched', 'transplanted', 'inactive'],
        default: 'waiting'
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

const Recipient = mongoose.model('Recipient', recipientSchema);

export default Recipient;
