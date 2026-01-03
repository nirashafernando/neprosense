import mongoose from 'mongoose';

const batchPredictionRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipient',
        required: true
    },
    donorIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donor'
    }],
    selectAll: {
        type: Boolean,
        default: false
    },
    predictions: [{
        donorId: {
            type: String,
            required: true
        },
        donor_ref: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Donor'
        },
        probability: {
            type: Number,
            required: true
        },
        riskCategory: {
            category: {
                type: String,
                enum: ['Low Risk', 'Medium Risk', 'High Risk'],
                required: true
            },
            color: String,
            description: String
        },
        shapExplanation: [{
            feature: String,
            importance: Number,
            description: String
        }],
        explanationText: String,
        rank: {
            type: Number,
            required: true
        }
    }],
    topDonors: [{
        donorId: String,
        donor_ref: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Donor'
        },
        probability: Number,
        riskCategory: {
            category: String,
            color: String,
            description: String
        },
        rank: Number
    }],
    totalEvaluated: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'completed'
    }
}, {
    timestamps: true
});

// Index for faster queries
batchPredictionRequestSchema.index({ user: 1, createdAt: -1 });
batchPredictionRequestSchema.index({ recipientId: 1 });

const BatchPredictionRequest = mongoose.model('BatchPredictionRequest', batchPredictionRequestSchema);

export default BatchPredictionRequest;
