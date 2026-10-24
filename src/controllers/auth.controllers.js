
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
    validateRegisterInput,
    validateLoginInput
} = require("../utils/authValidation");

async function register(req, res) {
    try {
        const { name, email, password } = req.body;

        const validation = validateRegisterInput(
            name,
            email,
            password
        );

        if (validation.error) {
            return res.status(400).json({
                message: validation.error
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email is already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword
        });

        return res.status(201).json({
            message: "Registration successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({
                message: "Email is already registered"
            });
        }

        console.error(err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        const validation = validateLoginInput(email, password);

        if (validation.error) {
            return res.status(400).json({
                message: validation.error
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({
            email: normalizedEmail
        }).select("+password");

        if (
            !user ||
            !(await bcrypt.compare(password, user.password))
        ) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not configured");
        }

        const token = jwt.sign(
            { id: user._id.toString() },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "1d"
            }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

module.exports = {
    register,
    login
};
