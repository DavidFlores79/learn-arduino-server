/**
 * path: api/users
 */
const { Router } = require('express');
const { validateJWT } = require('../middlewares/validateJWT');
const { getConnectedUsers } = require('../controllers/users');
const router = Router();

router.get('/', [
    validateJWT,
], getConnectedUsers);

module.exports = router;