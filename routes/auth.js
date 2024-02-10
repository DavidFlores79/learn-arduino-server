/**
 * path: api/auth
 */
const { Router } = require('express');
const { login, register, renewToken } = require('../controllers/auth');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validateFilds');
const { validateJWT } = require('../middlewares/validateJWT');
const router = Router();

router.post('/register', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El correo es obligatorio').not().isEmpty(),
    check('email', 'Debe ser un email válido').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validateFields,
], register);

router.post('/login', [
    check('email', 'El correo es obligatorio').not().isEmpty(),
    check('email', 'Debe ser un email válido').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validateFields,
], login);

router.get('/renew', [
    validateJWT,
], renewToken);

module.exports = router;