import mongoose from 'mongoose';

const predictionRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    donorData: {
        age: { type: Number, required: true },
        bloodGroup: { type: String, required: true },
        bmi: { type: Number, required: true },
        creatinine: { type: Number, required: true },
        gfr: { type: Number, required: true },
        systolicBP: { type: Number, required: true },
        diastolicBP: { type: Number, required: true },
        smoking: { type: Boolean, required: true },
        diabetes: { type: Boolean, required: true },
        hypertension: { type: Boolean, required: true }
    },
    recipientData: {
        age: { type: Number, required: true },
        bloodGroup: { type: String, required: true },
        bmi: { type: Number, required: true },
        creatinine: { type: Number, required: true },
        gfr: { type: Number, required: true },
        systolicBP: { type: Number, required: true },
        diastolicBP: { type: Number, required: true },
        dialysisYears: { type: Number, required: true },
        diabetes: { type: Boolean, required: true },
        hypertension: { type: Boolean, required: true },
        previousTransplants: { type: Number, required: true }
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    }
}, {
    timestamps: true
});

const PredictionRequest = mongoose.model('PredictionRequest', predictionRequestSchema);

export default PredictionRequest;
