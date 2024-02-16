/**
 * path: api/v1
 */
const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validateFilds');
const { getMessages, sendMessage } = require('../controllers/messages');
const { validateJWT } = require('../middlewares/validateJWT');
const router = Router();

router.get('/', [
    validateJWT,
], getMessages);

router.post('/send', [
    validateJWT,
], sendMessage);

module.exports = router;