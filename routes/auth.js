const express = require('express')
const router = express.Router()
const User = require('../modules/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const dotenv = require('dotenv');
dotenv.config({path: "../config.env"});

const JWT_SWCRET = process.env.JWT_SECRET;

/*
    --> To create a Basic route <--
    
    router.post('/', (req, res)=>{ 
        const user = User(req.body);
        user.save()
        console.log(req.body);
        res.json(['This is authentication route']);
    });

*/


//ROUTE-1
/* --> Create a User using POST: "localhost:5000/api/auth/"; Doesn't require Auth <--  */
router.post('/createuser', [
    body('name', 'Enter valid name').isLength({ min: 3 }),
    body('email', 'Enter valid email').isEmail(),
    body('password', 'Enter valid password').isLength({ min: 8 })
], async (req, res) => {

    //If there are errors, returns Bad request and the errors
    const errors = validationResult(req);
    let credentials = true;
    if (!errors.isEmpty()) {
        credentials = false;
        return res.status(400).json({credentials, errors: errors.array() });
    }

    //Check wether a user is already exists or not.

    try {

        let existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ credentials, errors: 'User already exist!! Please again try using another email' });
        }

        //Creates a new user.
        // const salt = await bcrypt.genSalt(10);
        const salt = await bcrypt.genSalt(10);
        const seqPwd = await bcrypt.hash(req.body.password, salt);

        existingUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: seqPwd,
        })

        const data = {
            user:{
                id: existingUser.id
            }
        }
        const authToken = jwt.sign(data, JWT_SWCRET);
        res.json({ authToken });

    } catch (error) {
        res.status(500).send("Oops!! Some error occured. Please try again later.");
    }

    // .then(user => res.json(user))
    // .catch(err => {
    //     console.log(err)
    //     res.json({ errors: "Please enter unique value for email" })
    // })
})


//ROUTE-2
/*  Authenticate login through POST: localhost:5000/api/auth/login     */
router.post('/login', [
    body('email', 'Enter valid email').isEmail(),
    body('password', 'Can not be blank.').exists()
], async (req, res) => {

    //If there are errors, returns Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    //Find a user from database. 
    const {email, password} = req.body;
    /*
        IF
            let currentEmail = req.body.email;
            let currentPassword = req.body.password;
        THEN
            let currentUser = await User.findOne({email: currentEmail});
            const comparePwd = bcrypt.compareSync(currentPassword, currentUser.password);
    */
    try {

        let currentUser = await User.findOne({email});
        if (!currentUser) {
            return res.status(400).json({error: "Please login with correct credentials!!"});
        }

        const comparePwd = bcrypt.compareSync(password, currentUser.password);
        if (!comparePwd) {
            return res.status(400).json({error: "Please login with correct credentials!!"});
        }

        const data = {
            user: {
                id: currentUser.id
            }
        }
        const authToken = jwt.sign(data, JWT_SWCRET);
        res.json({ authToken });

    } catch (error) {
        res.status(500).send("Oops!! Some error occured. Please try again later.");
    }
})

//ROUTE-3

router.post('/getuser', fetchuser, async (req,res) =>{
    // try {

        let userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    // } catch (error) {
    //     res.status(500).send("Oops!! Some error occured. Please try again later.");
    // }
});
module.exports = router