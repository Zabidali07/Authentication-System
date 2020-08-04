const { validationResult } = require("express-validator");

exports.runValidation = (req, res, next) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({               //as we have array of errors
                errors: errors.array()[0].msg       // but we do print the required error msg
            });
    }
    next();
}