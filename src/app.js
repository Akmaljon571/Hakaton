const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { router } = require('./router');
const { ErrorHandle } = require('./middleware/error_handler.js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 1000;
process.env.TZ = 'Asia/Tashkent';

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(router);
app.use(ErrorHandle);

app.listen(PORT, console.log('Ishni boshladik'))
