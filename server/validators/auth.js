const { check } = require("express-validator");

const MIN = 6;

exports.userSignUpValidators = [
    check("name").not().isEmpty().withMessage("The name field is required"),
    check("email").isEmail().withMessage("Provide correct email"),
    check("password").isLength({ min: MIN }).withMessage(`password must be atleast ${MIN} long`)
];

exports.userSignInValidators = [
    check("email").isEmail().withMessage("Provide correct email"),
    check("password").isLength({ min: MIN }).withMessage(`password must be atleast ${MIN} long`)
]