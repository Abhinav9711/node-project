const express = require('express');
const router = express.Router();

const { getTaskDetails, getTaskNames, updateTask, createTask, deleteTask, sortApiFunction } = require('../controller/taskController');

router.route("/create").post(createTask);
router.route("/update").patch(updateTask);
router.route("/delete").delete(deleteTask);
router.route("/sortapi").post(sortApiFunction);
router.route("/details").get(getTaskDetails);
router.route("/names").get(getTaskNames);

module.exports = router