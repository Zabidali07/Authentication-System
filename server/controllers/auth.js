const User = require("../models/auth");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

var transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "be223fd8c84052",
    pass: "d3389db1e94241",
  },
});

exports.signUp = (req, res) => {
  const { name, email, password } = req.body;

  User.findOne({ email }).exec((err, user) => {
    if (err) return res.status(401).json({ error: "email already exist !" });

    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: "10m" }
    );

    const activationLink = `${process.env.CLIENT_URL}/auth/activate/${token}`;
    const emaildata = {
      to: [
        // you have used array so that u can send to multiple persons
        {
          address: email,
          name: "",
        },
      ],
      from: {
        address: process.env.EMAIL_FROM,
        name: " mern auth ",
      },
      subject: "Account activation",
      html: `
        <div> 
        <h2> Please use this following link to activate the account </h2>

          <a href = "${activationLink}" target = "_blank" >
             ${activationLink} </a>

             <hr/>

             <p> This email contains sensitive information </p>
             
             <a href = "${process.env.CLIENT_URL}" target = "_blank" >
                 ${process.env.CLIENT_URL} </a>


        </div>`,
    };

    transport.sendMail(emaildata, (err, info) => {
      if (err)
        return res.status(400).json({
          error: err,
        });

      res.json({
        message: `Email has been sent successfully ${email} Follow the nstruction.`,
      });
    });
  });
};

exports.activateAccount = (req, res) => {
  const { token } = req.body;
  if (token) {
    return jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err) => {
      //Here we use JWT_ACUMT_VER for
      if (err) {
        //verifying user.
        return res.status(401).json({
          error: "link has expired",
        });
      }

      const { name, email, password } = jwt.decode(token);

      const newUser = new User({ name, email, password });
      //newUser is the instance of our schema , seee here we are passing password as their is virtual
      //field whuch takes password and convert it and save it as hashed_password. so here in database
      //we never store password

      User.findOne({ email }).exec((err, user) => {
        if (err) {
          return res.status(401).json({
            error: "somethin went wrong",
          });
        }
        if (user) {
          return res.status(401).json({
            error: "Database errr, user exist",
          });
        }
        //  res.json({user: `${newUser} is nbfg`});
        newUser.save((err, userData) => {
          if (err) {
            return res.status(401).json({
              error: `There is a error in saving the database ${err}`,
            });
          }
          return res.json(userData);
        });
      });
    });
  }

  return res.status(401).json({
    error: "The token is invalid",
  });
};

exports.signIn = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: `user with this email doesn't exist ${err}`,
      });
    }

    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: `incorrect password`,
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const { _id, name, email, role } = user;

    return res.json({
      token,
      user: {
        _id,
        name,
        role,
        email,
      },
      message: "Signed in succcessfully",
    });
  });
};

exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  User.findOne({ email }).exec((err, user) => {
    if (err)
      return res.status(400).json({
        error: `user with this email doesn't exist ${err}`,
      });

    const token = jwt.sign(
      { _id: user._id, name: user.name },
      process.env.JWT_RESET_PASSWORD,
      { expiresIn: "20m" }
    );

    const link = `${process.env.CLIENT_URL}/auth/password/reset/${token}`;

    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "password reset link ",
      html: `
                     <div>
                     <h1>Please use the following link to reset the password: </h1>
                      
                     <a href = "${link}" target = "_blank"> ${link}</a>
                      </div>
                     
                     `,
    };

    user.updateOne({ resetPasswordLink: token }).exec((err, success) => {
      if (err)
        return res.status(400).json({
          error: `cann save the reset passowrd link ${err}`,
        });

      transport
        .sendMail(emailData)
        .then(() => {
          return res.json({
            message: `Email has beeen sent successfully ${email}`,
          });
        })
        .catch((err) => {
          return res.status(400).json({
            error: `There was an error in sending the email ${err}`,
          });
        });
    });
  });
};

exports.resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  if (resetPasswordLink) {
    return jwt.verify(
      resetPasswordLink,
      process.env.JWT_RESET_PASSWORD,
      (err) => {
        if (err) {
          return res.status(400).json({
            error: "Expired link. Try again.",
          });
        }

        User.findOne({ resetPasswordLink }).exec((err, user) => {
          if (err || !user) {
            return res.status(400).json({
              error: "Somethig went wrong. Try later",
            });
          }

          const updateFields = {
            password: newPassword,
            resetPasswordLink: "",
          };

          user = _.extend(user, updateFields);

          user.save((err) => {
            if (err) {
              return res.status(400).json({
                error: "error in resetting the password",
              });
            }

            return res.json({
              message: "Great! The password has reset.",
            });
          });
        });
      }
    );
  }

  return res.status(400).json({
    error: "We have not received the reset password link",
  });
};

// exports.resetPassword = (req, res) => {
//   const { resetPasswordLink, newPassword } = req.body;

//   if (resetPasswordLink) {
//     return jwt.verify(
//       resetPasswordLink,
//       process.env.JWT_RESET_PASSWORD,
//       (err) => {
//         if (err)
//           return res.status(400).json({
//             error: `Expired link try again ${err}`,
//           });

//         User.findOne({ resetPasswordLink }).exec((err, user) => {
//           if (err || !user) {
//             console.log(err);
//             return res.status(400).json({
//               error: `something went wrong ${err}`,
//             });
//           }

//           const updateFields = {
//             password: newPassword,
//             resetPasswordLink: "",
//           };

//           user = _.extend(user, updateFields);

//           user.save((err) => {
//             if (err)
//               return res.status(400).json({
//                 error: `Error in reseting the password  ${err}`,
//               });

//             return res.json({
//               message: "Great password has been reset",
//             });
//           });
//         });
//       }
//     );
//   }

//   return res.status(400).json({
//     message: "reset password link not found",
//   });
// };
