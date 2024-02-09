const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const experimentSchema = new Schema({
    TotalClicks: {
        type: Number,
        required: true
    },
    CorrectClicks: {
        type: Number,
        required: true
    },
    AvgMouseDist: {
        type: Number,
        required: true
    },
    AvgTime: {
        type: Number,
        required: true
    },
    TotalTime: {
        type: Number,
        required: true
    },
    TotalColls: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const ExperimentData = mongoose.model("ExperimentData", experimentSchema);

module.exports = ExperimentData;
