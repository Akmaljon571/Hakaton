const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 1000;
process.env.TZ = 'Asia/Tashkent';

app.use(cors());
app.use(express.json());

app.listen(PORT, console.log('Ishni boshladik'))
