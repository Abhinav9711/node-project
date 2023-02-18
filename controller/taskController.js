const { isEmpty, get } = require('lodash');

const Task = require('../models/task');

const createTask = async (req, res) => {
  try {
    const { task = '', status = '' } = req.body || '';
    if (isEmpty(task) || isEmpty(status)) {
      throw new Error('Please pass all required fields');
    }

    const taskData = await Task.find({ task });

    if (!isEmpty(taskData)) {
      throw new Error('Given Task-name is already exist, Please change or update Task-name');
    }

    const newTask = new Task({
      task: task,
      status: status,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    await newTask.save();
    res.status(200).json('New task created successfully');
  }

  catch (error) {
    res.status(400).json({ 'message': error.message });
  }
}

const updateTask = async (req, res) => {
  try {
    const { filter, update } = req.body || {};
    if(isEmpty(filter) || isEmpty(update)) {
      res.status(400).json({"message": 'Please pass filter and update values'});
      return ;
    }
    const data = await Task.findOne(filter);
    if (isEmpty(data)) {
      throw new Error('Task is not present with provided filter, so can not update it');
    }
    update.updatedAt = new Date();
    await Task.updateOne(filter, { "$set": update });

    res.status(200).json('Updated successfuly');
  }
  catch (error) {
    res.status(400).json({ 'message': error.message });
  }
}


const deleteTask = async (req, res) => {
  try {
    await Task.deleteOne(req.query);
    res.status(200).json({ 'message': 'Task deleted successfull' });
  }
  catch (error) {
    res.status(400).json({ 'message': error.message });
  }
}

const sortApiFunction = async (req, res) => {
  try {
    const { tasks } = req.body || [];

    if (isEmpty(tasks)) {
      return;
    }
    await Task.updateMany({ "$set": { sequence: 0 } });
    var count = tasks.length;
    await tasks.map(async (task) => {
      count -= 1
      await Task.updateOne({ task }, { "$set": { sequence: count + 1 } });
    })
    res.status(200).json({ 'status': 'success', 'message': 'updated task in given sequence' });
  }
  catch (error) {
    res.status(400).json({ 'status': 'failed', 'error': error.message });
  }
}

const getTaskDetails = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 5;
    const count = await Task.count(req.query);
    const page = Number(req.query.page) || 1;
    let pages = count / limit;
    const skip = (page - 1) * limit;

    pages = pages > parseInt(pages) ? parseInt(pages) + 1 : pages;
    const data = await Task.find(req.query).sort('-sequence').skip(skip).limit(limit);

    console.log('data fetched successfuly');
    res.status(200).json({ myData: data, 'Total number of records': count, "Total number of pages: ": pages, "Current page": page, limit: limit });
  }
  catch (error) {
    res.status(400).json({ "error": error });
  }
}

const getTaskNames = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 5;
    const count = await Task.count(req.query);
    const page = Number(req.query.page) || 1;
    let pages = count / limit;
    const skip = (page - 1) * limit;

    pages = pages > parseInt(pages) ? parseInt(pages) + 1 : pages;

    const data = await Task.find({}, { task: 1 }).sort('-sequence').skip(skip).limit(limit);
    res.status(200).json({ 'data': data, 'Total number of Tasks:': data.length, "Total number of pages: ": pages, "Current page": page, limit: limit });

  }
  catch (error) {
    res.status(400).json({ 'message': error.message });
  }
}

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  sortApiFunction,
  getTaskDetails,
  getTaskNames
}