const jwt = require("jsonwebtoken");


exports.authorize = (req, res, next) => {
     jwt.verify(req.headers.authorization, process.env.JWT_SECRET, (err) => {
         if(err) return res.status(400).json({
             error: `Unauthorized Access ${err}`
            })

            next();
     })

}