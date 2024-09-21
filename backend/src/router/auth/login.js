const { Router } = require("express");
const { authorization, algoritm } = require("../../controller/auth/login");
const { logout } = require("../../middleware/logout");
const { refresh_token } = require("../../middleware/refresh_token");
const { single } = require("../../middleware/single");

module.exports.loginRouter = Router()
    .get('/single', single)
    .post('/login', authorization)
    .post('/logout', logout)
    .post('/refresh_token', refresh_token)
    .post('/handshake', algoritm)
