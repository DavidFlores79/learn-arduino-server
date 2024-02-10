/**
 * path: api/v1
 */
const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validateFilds');
const { getMessages } = require('../controllers/messages');
const { validateJWT } = require('../middlewares/validateJWT');
const router = Router();

router.get('/messages', [
    validateJWT,
], getMessages);

module.exports = router;