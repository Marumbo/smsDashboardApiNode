const User = require("../models/user");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ status: 'fail', message: 'email and password are required' });
        }

        const userExists = await User.findOne({ email });;
        if (!userExists) {
            return res.status(404).send({ status: "fail", message: "user not found" });
        }

        const isPwdValid = await bcrypt.compare(password, userExists.password);

        if (!isPwdValid) {
            return res.status(401).send({ status: "fail", message: "invalid credentials" });
        }

        const token = jwt.sign({ email: userExists.email, id: userExists._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).send({ status: "success", message: "login successful", data: { token } });

    } catch (error) {
        res.status(500).send({ status: "fail", message: error.message });
    }
}

async function signup(req, res) {
    try {
        const { email, first_name, last_name, phone_number } = req.body;
        if (!email || !password || !first_name || !last_name || !phone_number) {
            res.status(400).json({ status: 'fail', message: 'Required fields are missing' });
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(409).send({ status: "fail", message: "user already exists" });
        }
        const hashedPwd = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashedPwd, first_name, last_name, phone_number });

        const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(201).send({
            status: "success", message: "signup successful", data: {
                userId: user._id,
                email: user.email,
                token: token
            }
        });
    } catch (error) {
        res.status(500).send({ status: "fail", message: error.message });
    }
}

module.exports = { login, signup };