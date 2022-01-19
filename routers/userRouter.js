const fs = require("fs");
const { validateUser } = require('../userHelpers')
const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

router.post('/', validateUser, async (req, res, next) => {
    try {
        const { username, age, password } = req.body;
        const data = await fs.promises
            .readFile("./user.json", { encoding: "utf8" })
            .then((data) => JSON.parse(data));
        const id = uuidv4()
        data.push({ id, username, age, password });
        await fs.promises.writeFile("./user.json", JSON.stringify(data), {
            encoding: "utf8",
        });
        res.send({ id, message: 'sucess' });
    } catch (error) {
        next({ status: 500, internalMessage: error.message })
    }

})

router.patch('/:userId', validateUser, async (req, res, next) => {
    const { username, age, password } = req.body;
    const users = await fs.promises
        .readFile("./user.json", { encoding: "utf8" })
        .then((data) => JSON.parse(data));
    const newUsers = users.map((user) => {
        if (user.id !== req.params.userId) return user
        return {
            username, password, age, id: req.params.userId
        }
    })
    await fs.promises.writeFile("./user.json", JSON.stringify(newUsers), {
        encoding: "utf8",
    });
    res.status(200).send({ message: "useridted" })
})
router.get('/', async (req, res, next) => {
    try {
        const age = Number(req.query.age)
        const users = await fs.promises
            .readFile("./user.json", { encoding: "utf8" })
            .then((data) => JSON.parse(data));
        const filteredUsers = users.filter(user => user.age === age)
        res.send(filteredUsers)
    } catch (error) {
        next({ status: 500, internalMessage: error.message })
    }

})

router.post('/login', async (req, res, next) => {
    const { username, age, password } = req.body;
    const users = await fs.promises
        .readFile("./user.json", { encoding: "utf8" })
        .then((data) => JSON.parse(data));
    const isUsernameExists = users.some(user => user.username === username && user.password === password)
    if (isUsernameExists && req.method == 'POST') return next({ status: 200, message: "login success" })
    else {
        res.send({ status: 200, message: "login failed" })
    }
})
router.get('/id', async (req, res, next) => {
    const users = await fs.promises
        .readFile("./user.json", { encoding: "utf8" })
        .then((data) => JSON.parse(data));
        res.send(users);
})

router.delete('/:id', async(req,res,next)=>{
    const { id} = req.body;
    const users = await fs.promises
        .readFile("./user.json", { encoding: "utf8" })
        .then((data) => JSON.parse(data));
        const newuser=users.filter(user=>user.id !=req.params.id);
        await fs.promises.writeFile("./user.json", JSON.stringify(newuser), {
            encoding: "utf8",
        });
})

module.exports = router