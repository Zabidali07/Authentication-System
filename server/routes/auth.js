const express = require("express");
const router = express.Router();
const {signUp, 
    activateAccount, 
    signIn, 
    forgotPassword, 
    resetPassword 
    } = require("../controllers/auth")

const mongoose = require("mongoose");

const { userSignUpValidators, userSignInValidators } = require("../validators/auth");
const { runValidation } = require('../validators/index');

router.post("/signup", userSignUpValidators, runValidation,  signUp);

router.post("/account-activation", activateAccount);

router.post("/signin", userSignInValidators, runValidation, signIn);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);




module.exports = router;




// var schema = new mongoose.Schema({ name: 'string', size: 'string' });
// var Tank = mongoose.model('Tank', schema);
// router.post("/check-save", (req, res) => {
//     const trailUser = new Tank({ name: "zabid", size:"11" });
 
//     trailUser.save((err, post) => {
//         if(err) return res.status(400).json({
//             status: "failed",
//             message: `There is eror in database ${err}`
//         })

//         return res.json(post);
//     })
   

// });