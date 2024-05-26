/**
 * path: api/v1
 */
const { Router } = require('express');
const { check } = require('express-validator');
const { validateJWT } = require('../middlewares/validateJWT');
const { chatWithOpenAI, openAIFunctionCall } = require('../controllers/openia');
const router = Router();

router.post('/chat', [
    validateJWT,
], chatWithOpenAI);

router.post('/function-call', [
    validateJWT,
], openAIFunctionCall);


module.exports = router;