const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');
const { validateAddSchool } = require('../validators/schoolValidator');

// Route to add a school
router.post('/addSchool', validateAddSchool, schoolController.addSchool);

// Route to list schools
router.get('/listSchools', schoolController.listSchools);

module.exports = router;
