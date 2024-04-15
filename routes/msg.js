/**
 * path: api/v1
 */
const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validateFilds');
const { getMessages, sendMessage, sendSMSMessage, sendVerificationSMSMessage } = require('../controllers/messages');
const { validateJWT } = require('../middlewares/validateJWT');
const router = Router();

router.get('/', [
    validateJWT,
], getMessages);

router.post('/send', [
    validateJWT,
], sendMessage);

router.post('/send-verification-sms', [
    validateJWT,
], sendVerificationSMSMessage);

router.post('/send-sms', [
    validateJWT,
], sendSMSMessage);

router.post('/send-verify-sms', [
    validateJWT,
], sendVerificationSMSMessage);

module.exports = router;