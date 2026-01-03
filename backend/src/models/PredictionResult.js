import mongoose from 'mongoose';

const predictionResultSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    predictionRequest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PredictionRequest',
        required: true
    },
    compatibilityProbability: {
        type: Number,
        required: true,
        min: 0,
        max: 1
    },
    suitabilityDecision: {
        type: String,
        enum: ['Suitable', 'Not Suitable'],
        required: true
    },
    threshold: {
        type: Number,
        required: true,
        default: 0.5
    },
    modelVersion: {
        type: String,
        default: 'random_forest_v1'
    },
    decisionSupport: {
        type: String,
        default: 'This system provides decision support only and does not replace professional medical judgment.'
    }
}, {
    timestamps: true
});

const PredictionResult = mongoose.model('PredictionResult', predictionResultSchema);

export default PredictionResult;
