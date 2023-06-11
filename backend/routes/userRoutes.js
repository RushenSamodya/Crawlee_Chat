const express = require('express');
const { registerUser, authUser, allUsers } = require('../controllers/userControllers');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

//for the registration handling of a user
router.route('/').post(registerUser).get(protect, allUsers)

//for the login handling of a user
router.post('/login',authUser);

router

module.exports = router;
