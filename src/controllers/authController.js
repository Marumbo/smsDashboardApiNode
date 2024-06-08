const User = require("../models/user");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
async function login(req, res) {
    try {
        const { phone_or_email, password } = req.body;
        console.log(phone_or_email)

        if (!phone_or_email || !password) {
            res.status(400).json({ status: 'fail', message: 'email and password are required' });
        }

        const userExists = await User.findOne({$or:[{ email:phone_or_email},{phone_number:phone_or_email }]});;
        if (!userExists) {
            return res.status(404).send({ status: "fail", message: "user not found" });
        }

        const isPwdValid = await bcrypt.compare(password, userExists.password);

        if (!isPwdValid) {
            return res.status(401).send({ status: "fail", message: "invalid credentials" });
        }

        const token = jwt.sign({ email: userExists.email,phone_number:userExists.phone_number, id: userExists._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).send({ status: "success", message: "login successful", data: { token } });

    } catch (error) {
        res.status(500).send({ status: "fail", message: error.message });
    }
}

async function signup(req, res) {
    try {
        const { email,full_name,password, phone_number } = req.body;
        if (!email || !password || !full_name  || !phone_number) {
            res.status(400).json({ status: 'fail', message: 'Required fields are missing' });
        }
        const userExists = await User.findOne({ $or:[{email:email},{phone_number:phone_number}]  });
        if (userExists) {
            return res.status(409).send({ status: "fail", message: "user already exists" });
        }
        const hashedPwd = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashedPwd, full_name, phone_number });

        const token = jwt.sign({ email: user.email,phone_number:user.phone_number, id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

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