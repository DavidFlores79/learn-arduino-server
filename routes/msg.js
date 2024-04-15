/**
 * path: api/v1
 */
const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validateFields');
const { getMessages, sendMessage, sendSMSMessage, sendVerificationSMSMessage } = require('../controllers/messages');
const { validateJWT } = require('../middlewares/validateJWT');
const { validateUserById } = require('../helpers/dbValidators');
const router = Router();

router.get('/', [
    validateJWT,
], getMessages);

router.post('/send', [
    validateJWT,
], sendMessage);

router.post('/send-verification-sms', [
    check('uid', 'El uid debe ser valido').isMongoId(),
    check('uid').custom( validateUserById ),
    validateJWT,
    validateFields,
], sendVerificationSMSMessage);

router.post('/send-sms', [
    validateJWT,
], sendSMSMessage);

module.exports = router;