const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const repo = require("../../repository");
const { v4 } = require("../../utils/uuid");
const { sessionCreate } = require("../../utils/session");
const CustomError = require("../../utils/custom_error");

const clients = {}
module.exports.algoritm = (req, res) => {
    try {
        const { hash } = req.body

        const verify = verifyHash(hash)
        const myKey = createHash(verify)
        const myHash = createBigHash(myKey)
        clients[myKey] = { myKey, status: false }

        res.status(200).json({ status: 200, error: false, hash: myHash })
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: 500, error: err.message, data: null });
    }
}

module.exports.authorization = async (req, res) => {
    try {
        const { username, password, key } = req.body;

        if (!clients[key] || clients[key].myKey != key) return res.status(400).json({ status: 400, error: "Aka sizni tanimayman" })

        if (!(username && password))
            return res.status(401).json({ status: 401, error: "Username and password is required" })

        const user = await repo.repositories().adminRepository().findOne({ login: username });
        if (user) {
            if (user.active) {
                const isMatch = await bcrypt.compare(password, user.password)
                if (!isMatch) {
                    res.status(401).json({ status: 401, error: "Username or password is wrong", data: null });
                } else {
                    await repo.repositories().adminRepository().update(user._id, { last_active: new Date() })
                    const tokens = await authCheck(user)

                    clients[key] = {}
                    res.cookie('access_token', tokens.access);
                    res.status(200).json({ status: 200, data: { refresh_token: tokens.refresh, session: tokens.session }, error: null })
                }
            } else {
                res.status(401).json({ status: 401, error: "User No Active", data: null })
            }
        } else {
            res.status(401).json({ status: 401, error: "user is not exist with this id", data: null });
        }
    } catch (err) {
        console.log(err)
        res.status(401).json({ status: 401, error: err.message, data: null });
    }
}

const authCheck = async (user) => {
    try {
        await repo.repositories().authRepository().remove({ admin_id: user._id })

        const newObj = {
            access_token: v4(),
            refresh_token: v4(),
            a_t_created_date: new Date(),
            session_created_date: new Date(),
            admin_id: user._id
        }
        const a = await repo.repositories().authRepository().insert(newObj)

        const session = sessionCreate(String(a._id), process.env.SECRET_KEY)
        const refresh = jwt.sign({ user: user._id }, process.env.SECRET_KEY, { expiresIn: '30d' });
        const access = jwt.sign({ user: user._id }, process.env.SECRET_KEY, { expiresIn: '1m' });

        return { refresh, access, session }
    } catch (err) {
        console.log(err)
        throw new CustomError(err.status, err.message)
    }
}

function createBigHash(secret) {
    const alifbo = `оЧjэ$GheRY?0pЖяДт=BaN8ёЯф) ЁgVLyь!]9mГ+IwrзXу[KТЫ@УБЛЪl5ыйf1EЕчЬ:,ОЩФЮQ-k|юHпР7кВAдрDЦХ&ИUxШшъА(ЗvJcжб%вгouЙ^сZi3}nWМPb_C64КztTиSмлO{щdце*н.MЭС/s2FНПхаq`;

    const randomStep = Math.floor(Math.random() * alifbo.length) + 1
    const random = randomStep && randomStep != alifbo.length ? randomStep : 1

    const split = alifbo.split('')
    let hash1 = alifbo[random]

    for (const key of secret) {
        const secret2 = (split.findIndex((e) => e == key) + random) % alifbo.length
        hash1 += alifbo[secret2]
    }

    let divison = Math.floor(alifbo.length / hash1.length)
    let hash = ''
    for (let i = 0; i < alifbo.length; i++) {
        if (i % divison == 0) {
            hash += hash1[i / divison] || ''
        } else {
            hash += alifbo[i]
        }
    }

    hash += alifbo[divison]
    return hash
}

function createHash(secret) {
    const alifbo = `оЧjэ$GheRY?0pЖяДт=BaN8ёЯф) ЁgVLyь!]9mГ+IwrзXу[KТЫ@УБЛЪl5ыйf1EЕчЬ:,ОЩФЮQ-k|юHпР7кВAдрDЦХ&ИUxШшъА(ЗvJcжб%вгouЙ^сZi3}nWМPb_C64КztTиSмлO{щdце*н.MЭС/s2FНПхаq`;

    const randomStep = Math.floor(Math.random() * alifbo.length) + 1
    const random = randomStep && randomStep != alifbo.length ? randomStep : 1

    const split = alifbo.split('')
    let hash = alifbo[random]

    for (const key of secret) {
        const secret2 = (split.findIndex((e) => e == key) + random) % alifbo.length
        hash += alifbo[secret2]
    }

    return hash
}

function verifyHash(hash) {
    const alifbo = `оЧjэ$GheRY?0pЖяДт=BaN8ёЯф) ЁgVLyь!]9mГ+IwrзXу[KТЫ@УБЛЪl5ыйf1EЕчЬ:,ОЩФЮQ-k|юHпР7кВAдрDЦХ&ИUxШшъА(ЗvJcжб%вгouЙ^сZi3}nWМPb_C64КztTиSмлO{щdце*н.MЭС/s2FНПхаq`;
    const split = alifbo.split('')

    let findDivison = split.findIndex((e) => e == hash[hash.length - 1])
    let verifyHash = ''
    for (let i = 0; i < hash.length - findDivison; i++) {
        if (i % findDivison == 0) {
            verifyHash += hash[i]
        }
    }

    let findRandom = ''
    let verifySecret = ''
    for (const key of verifyHash) {
        if (!findRandom) {
            findRandom = split.findIndex((e) => e == key)
        } else {
            const findIndex = split.findIndex((e) => e == key)
            const plus = findIndex - findRandom
            const index = plus > alifbo.length ? plus - alifbo.length : plus < 0 ? plus + alifbo.length : plus
            verifySecret += alifbo[index]
        }
    }

    return verifySecret
}
