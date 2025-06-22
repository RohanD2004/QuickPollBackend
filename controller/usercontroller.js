const User = require('../model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const signup = async (req, res) => {


    try
    {

        if (!req.body) {
            return res.status(400).json({ message: "Data cannot be empty" });
        }
        
        const userData = {
            name: req.body.data.name,
            email: req.body.data.email,
            password: req.body.data.password,
        }
        
        if (userData.password) {
            const salt = await bcrypt.genSalt(10);
            userData.password = await bcrypt.hash(userData.password, salt);
        }
        
        const new_user = new User(userData);
        await new_user.save();
        
        res.status(201).json({
            message: "User added successfully",
        });
    }catch(error)
    {
        res.status(400).json({
            message:'Something went wrong'
        })
    }


}
const loginuser = async (req, res) => {
    const { email, password } = req.body.data;
    try {

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const ismatch = await bcrypt.compare(password, user.password);
        if (!ismatch) {
            return res.status(404).json({ message: "Invalid password" })
        }

        const jwt_token = jwt.sign(
            { id: user._id, },
            process.env.JWT_SCREET,
            { expiresIn: '5h' }
        );

        res.status(200).json({ message: "Login successful", token: jwt_token,id: user._id });


    } catch (error) {
        res.status(400).json({ message: error })
    }
}

const getUser = async (req, res) => {
    const id = req.body.id;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User found", data: user });
    } catch (error) {
        res.status(400).json({ message: "Something went wrong" })
    }
}

module.exports={
    signup,
    loginuser,
    getUser
}