const mongoose = require('mongoose');

const OPERATION_TYPES = ['uppercase', 'lowercase', 'reverse', 'wordcount'];
const STATUS_TYPES = ['Pending', 'Running', 'Success', 'Failed'];

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    inputText: {
      type: String,
      required: true,
    },
    operationType: {
      type: String,
      enum: OPERATION_TYPES,
      required: true,
    },
    status: {
      type: String,
      enum: STATUS_TYPES,
      default: 'Pending',
    },
    result: {
      type: String,
      default: null,
    },
    logs: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);


taskSchema.index({ userId: 1, createdAt: -1 });
taskSchema.index({ status: 1 });

module.exports = mongoose.model('Task', taskSchema);
module.exports.OPERATION_TYPES = OPERATION_TYPES;
module.exports.STATUS_TYPES = STATUS_TYPES;