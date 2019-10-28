const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

//To check whether person has logged in or not

router.use((req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const verified = jwt.verify(token, 'tokenParam');
        req.userData = verified;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'You first need to login'
        });
    }
});


module.exports = router;