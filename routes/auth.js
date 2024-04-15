/**
 * path: api/auth
 */
const { Router } = require('express');
const { login, register, renewToken, activate } = require('../controllers/auth');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validateFields');
const { validateJWT } = require('../middlewares/validateJWT');
const { validateUserById, validateCode } = require('../helpers/dbValidators');
const router = Router();

router.post('/register', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El correo es obligatorio').not().isEmpty(),
    check('email', 'Debe ser un email válido').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validateFields,
], register);

router.post('/activate', [
    check('uid', 'El uid es obligatorio').isMongoId(),
    check('uid').custom( validateUserById ),
    check('code', 'El codigo es obligatorio').not().isEmpty(),
    check('code').custom( validateCode ),
    validateFields,
], activate);

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