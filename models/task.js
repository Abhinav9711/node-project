const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  task: {
    type: String,
    required: [true, 'task name must be provied']
  },
  status: {
    type: String,
    required: [true, 'status must be provided'],
    enum: {
      values: ['Completed', 'Incompleted'],
      message: '{VALUE} is not supported'
    }
  },
  createdAt: {
    type: Date
  },
  updatedAt: {
    type: Date
  },
  sequence: {
    type: Number
  }
});
module.exports = mongoose.model('Task', taskSchema);