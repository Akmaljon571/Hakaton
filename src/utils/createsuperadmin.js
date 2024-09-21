const readline = require('readline')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const { adminModel } = require('../models/admin')
require('dotenv').config()

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

mongoose.connect(process.env.DB);

const getUserInputStep1 = async () => {
    const find = await adminModel.findOne({ role: "admin" })
    if (!find) {
        await getUserInputStep2();
    } else {
        console.log('SuperAdmin mavjud...')
        rl.close();
        process.exit();
    }
}

const getUserInputStep2 = async () => {
    const salt = await bcrypt.genSalt(10);
    await adminModel.create({
        name: "Админ",
        login: 'demo',
        password: await bcrypt.hash("demo", salt),
        role: 'admin'
    })
    console.log('Create Super User...')
    rl.close();
    process.exit();
}

(async () => {
    await getUserInputStep1();
})();


// Bu file Yengi Eng kotta super Admin yaratish uchun ishlatilinadi.
// Bu hech qaysi file ga ulanmaydi. Faqat terminal orqali foydalanadi
