/**
 * path: api/v1
 */
const { Router } = require('express');
const { check } = require('express-validator');
const { validateJWT } = require('../middlewares/validateJWT');
const { chatWithOpenAI } = require('../controllers/openia');
const router = Router();

router.post('/chat', [
    validateJWT,
], chatWithOpenAI);

// router.post('/call-apis', [
//     validateJWT,
// ], callApis);


module.exports = router;