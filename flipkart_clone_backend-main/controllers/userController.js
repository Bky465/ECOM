const user = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret_key = "type-user";

const signUp = async (req, res) => {

    //existing user check
    //user creation
    //token Generation
    const { name, age, regno, email, password, key, displaypic } = req.body;
    try {
        const existingUser = await user.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        let role;
        if (key === secret_key) {
            role = 'admin';
        }
        else {
            role = 'user';
        }
        
        const result = await user.create({
            name: name,
            age: age,
            regno: regno,
            email: email,
            password: hashedPassword,
            role: role,
            image: displaypic
        })
        const token = jwt.sign({ email: result.email, id: result._id, role: result.role }, secret_key);

        return res.status(201).json({ user: result, token: token });


    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: "something went wrong" });
    }
}
const signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await user.findOne({ email: email });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" })
        }
        const matchPassword = await bcrypt.compare(password, existingUser.password);
        if (!matchPassword) {
            return res.status(400).json({ message: "Invalid Credentials!" });
        }
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id, role: existingUser.role }, secret_key);
        if (existingUser.role === "user") {
            return res.status(201).json({ user: existingUser, token: token, message: "user login successful" });
        }
        else {
            return res.status(201).json({ user: existingUser, token: token, message: "admin login successful" });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "something went wrong" });
    }

}
const createUser = async (req, res) => {
    try {

        if (req.role === "admin") {

            const { name, age, regno, email, password, role, image } = req.body;
            const existingUser = await user.findOne({ email: email });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists" })
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const result = await user.create({
                name: name,
                age: age,
                regno: regno,
                email: email,
                password: hashedPassword,
                role: role,
                image: image
            })
            const token = jwt.sign({ email: result.email, id: result._id, role: result.role }, secret_key);
            return res.status(201).json({ user: result, token: token, message: "user created successfully" });
        }
        else {
            return res.status(404).json({ message: "unauthorized user!" })
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });

    }
}
const updateUser = async (req, res) => {
    console.log(req.userId)
    console.log(req.role)
    const id = req.params.id;
    try {

        if (req.role === "admin" || req.userId === id) {
            const { name, age, regno, password, role, image } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const newuser = {
                name: name,
                age: age,
                regno: regno,
                password: hashedPassword,
                role: role,
                image: image
            }
            await user.findByIdAndUpdate(id, newuser, { new: true });
            return res.status(201).json({ newuser: newuser, message: "user updated successfully" })
        }
        else {
            return res.status(404).json({ message: "unauthorized user!" })
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });

    }
}

const deleteUser = async (req, res) => {
    console.log(req.userId)
    console.log(req.role)
    const id = req.params.id;
    try {

        if (req.role === "admin" || req.userId === id) {

            await user.deleteOne({ _id: id })
            return res.status(201).json({ message: "user deleted successfully" })
        }
        else {
            return res.status(404).json({ message: "unauthorized user!" })
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });

    }
}
module.exports = { signUp, signIn, deleteUser, updateUser, createUser }