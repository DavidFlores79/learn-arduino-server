/**
 * path: api/users
 */
const { Router } = require('express');
const { validateJWT } = require('../middlewares/validateJWT');
const { getUsers } = require('../controllers/users');
const router = Router();

router.get('/users', [
    validateJWT,
], getUsers);

module.exports = router;