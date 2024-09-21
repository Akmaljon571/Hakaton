const bcrypt = require("bcryptjs")
const repo = require("../../repository")

module.exports.createAdmin = async (req, res) => {
    try {
        const { name, login, password, role, open_page, open_factory, open_folders } = req.result

        const find = await repo.repositories().adminRepository().findOne({ login: login })
        if (find) return res.status(400).json({ status: 400, error: 'User login already exists', data: null });

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const newObj = { name, login, role, open_page, password: hash, open_factory, open_folders }

        const newAdmin = await repo.repositories().adminRepository().insert(newObj)
        await repo.repositories().logRepository().create(req, newAdmin._id, "Admin create")
        res.status(200).json({ status: 200, error: null, data: "Successful saved" });
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: 500, error: err.message, data: null });
    }
}

module.exports.listActive = async (req, res) => {
    try {
        const { status } = req.query
        const adminList = await repo.repositories().adminRepository().findAll()
        if (status === 'inactive') {
            res.status(200).json({ status: 200, error: null, data: adminList.filter(e => !e.active) })
        } else {
            res.status(200).json({ status: 200, error: null, data: adminList.filter(e => e.active) })
        }
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message, data: null })
    }
}

module.exports.updateAdmin = async (req, res) => {
    try {
        const { id } = req.params
        const args = req.result
        const findId = await repo.repositories().adminRepository().findById(id)
        if (!findId) return res.status(404).json({ status: 404, error: "Admin Not Found", data: null })

        const findLogin = await repo.repositories().adminRepository().findOne({ login: args.login })
        if (findLogin && findLogin._id != id) res.status(400).json({ status: 400, error: 'User login already use', data: null });

        let password
        if (args.password) {
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(args.password, salt);
        }
        await repo.repositories().adminRepository().update(id, {
            name: args.name || findId.name,
            login: args.login || findId.login,
            password: password || findId.password,
            role: args.role || findId.role,
            open_page: args.open_page || findId.open_page,
            open_factory: args.open_factory || findId.open_factory,
            open_folders: args.open_folders || findId.open_folders
        })

        await repo.repositories().logRepository().create(req, id, "Admin update")
        res.status(200).json({ status: 200, error: null, data: 'Successful updated' })
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message, data: null })
    }
}

module.exports.deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params
        const findId = await repo.repositories().adminRepository().findById(id)
        if (!findId) return res.status(404).json({ status: 404, error: "Admin Not Found", data: null })

        await repo.repositories().adminRepository().remove(id)
        await repo.repositories().logRepository().create(req, id, "Admin delete")
        res.status(204).json({ status: 204, error: null, data: 'Successful deleted' })
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message, data: null })
    }
}

module.exports.activeAdmin = async (req, res) => {
    try {
        const { id } = req.params
        const findId = await repo.repositories().adminRepository().findById(id)
        if (!findId) return res.status(404).json({ status: 404, error: "Admin Not Found", data: null })

        await repo.repositories().adminRepository().active(id)
        await repo.repositories().logRepository().create(req, id, "Admin activate")
        res.status(204).json({ status: 200, error: null, data: 'Successful activate' })
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message, data: null })
    }
}
