const mongoose = require("mongoose");
const crypto = require("crypto");

const UserSchema  = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        max: 32 
    },
    email: {
        type: String,
        required: true,
        unique: true

    },
    hashed_password: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    role: String,
    resetPasswordLink: {
        data: String,
        default: ""
    }
 }, {timestamps: true})


 UserSchema.methods = {         // when we want to have custom functions
     makeSalt: function(){      //then we use this we declare our methods here
         return Math.round(new Date().valueOf()*Math.random()+ "");
     } , 
                      // you can use any algorithm for salting purpose
     encryptPassword: function(password){
        
         // if(password) return "";

          try{
              return crypto                         //this.salt is we get
              .createHmac("sha1", this.salt)        //helps me in creating contaoner //  uses algorithm sha1  
              .update(password)                     //digeststop the process and use encoding
              .digest("hex")                        //
          }catch(err){
              return err;
          }
     },

     // here you encryptong plain password
     //whatever is generated compareing with ccureent password
     authenticate: function(password){
            return this.encryptPassword(password) === this.hashed_password;
     }


 };
 
 UserSchema.virtual("password").set(function(password) {

     this._password = password;

     //generate salt
     this.salt = this.makeSalt();
     this.hashed_password = this.encryptPassword(password);

 }).get(function(){
     return this._password;
 })

 module.exports = mongoose.model("users", UserSchema);