const jwt = require('jsonwebtoken');
import dotenv from 'dotenv';

dotenv.config();
const JWT_SWCRET = process.env.JWT_SWCRET;
const fetchuser = (req, res, next)=>{

    const token = req.header('auth-token');
    // console.log(token);

    if (!token) {
        res.status(401).send({error: "User not found!!"})
    }

    try {
        const data = jwt.verify(token, JWT_SWCRET);
        req.user = data.user;
        // console.log(data);
        next();
    } catch (error) {
        res.status(401).send({error: "User not found!!"})
    }
}

module.exports = fetchuser;