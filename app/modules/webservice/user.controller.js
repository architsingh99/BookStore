const userRepo = require('user/repositories/user.repository');
const userModel = require('user/models/user.model.js');

const fs = require('fs');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const Cryptr = require('cryptr');
const cryptr = new Cryptr(config.jwtSecret);

//mail send 
const { join } = require('path');
const ejs = require('ejs');
const { readFile } = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(readFile);


class userController {
    constructor() {
        this.user = {};
    }

    async signup(req, res) {
        try {
            let userData = await userRepo.getUserByField({email:req.body.email});
            if(!userData)
            {
                        // Another Email Provided, send verification Email
                        let OTP = Math.floor(1000 + Math.random() * 9000);
                        req.body.verification_code = OTP;

                        let html = `Hello ${req.body.first_name} ${req.body.last_name},<br>
                                You have Registered Successfully to Book Store<br>
                                here's your Email verification OTP: <b>${OTP}</b><br>
                                Please verify your email to get Going<br>
                                -Admin Team Book Store`;
                    
                        let sendMail = await transporter.sendMail({
                            from: `Admin<${process.env.MAIL_USERNAME}>`,
                            to: req.body.email,
                            subject: 'New User | Book Store',
                            html: html
                        });
                        let user = new userModel();
                        req.body.password = user.generateHash(req.body.password);
                        let saveUser = await userRepo.save(req.body);
                        return { status: 200, data: saveUser, message: 'Registration Successful, Please Check your Email for verification OTP' };
                    }
                    else
                    {
                        return { status: 201, data: [], message: 'Email Already Exists.' };
                    }    
        } catch(e) {
            return { status: 500, data: [], message: e.message };
        }
    }

    async signin(req, res) {
        try{
            let userData = await userRepo.getUserByField({email:req.body.email});
            if(userData){
 
                    //check is active
                    if(userData.isActive==true){
                        if (!userData.validPassword(req.body.password,userData.password)) {
                            return { status: 500, data: [], message: 'Authentication failed, Wrong Password' };
                        }else{
                                //check is verified
                            if(userData.isEmailVerified == true){
                                const payload = { id: userData._id };
                                const token = jwt.sign(payload, config.jwtSecret, {expiresIn: 86400});
                                //const updated = await userRepo.updateById(data, userData._id);
                                return { status: 200, token: token,  data: userData, "message": "You have successfully logged in" };
                            }else{
                                return {status: 500,data:userData,message: `Your Account Email is not verified.`};
                            }
                        }
                    }else{
                         return {status: 500,data:{},message: `Your Account is not active.`};
                       // throw new Error('Your Account is not active.');
                }
            }
            else{
                return {status: 500,data:{},message: 'No user found.'};
                }
        }catch(e){
            return { status: 500, data: [], message: e.message };
        }
    }

    async verifyOTP(req, res) {
        try {
            let user = await userRepo.getByField({ email: req.body.email });
            if(user && !_.isEmpty(user.verification_code)){
                if(user.verification_code == req.body.otp) {
                    let updateUser = userRepo.updateById({ isEmailVerified: true, verification_code: '' }, user._id);
                    return { status: 200, data: {}, message: 'Email verified Successfully' };
                } else {
                    throw new Error('Wrong OTP');    
                }
            } else {
                throw new Error('Invalid User');
            }
        } catch(e) {
            return { status: 500, data: [], message: e.message };
        }
    }

    async resetPassword(req, res) {
        try {
            let user = await userRepo.getByField({email: req.body.email});
            if(user){
                if(user.isEmailVerified == true)
                {
                    let random_pass = Math.random().toString(36).substr(2, 9);
                    let readable_pass = random_pass;
                    random_pass = user.generateHash(random_pass);
                    let user_details = await userRepo.updateById({password: random_pass}, user._id);
                    if (!user_details) {  
                        return null;
                    }
                    // return readable_pass;
                    let mailOptions = {
                            from: `Admin<${process.env.MAIL_USERNAME}>`,
                            to: user.email,
                            subject: 'Reset Password | Book Store',
                            html: `Hello ${user.first_name} ${user.last_name},<br>
                                    We have received your Password Reset request.<br>
                                    Here is your New Password: <b>${readable_pass}</b><br>
                                    -Book Store Admin Team`
                    };
                    let sendEmail = await transporter.sendMail(mailOptions);
                    return { status: 200, data: {}, message: 'New password sent to provided Email' };
                }
                else
                {
                    return { status: 201, data: {}, message: 'Your mail is not verified yet. Verify your mail first.' };
                }
            } else {
                return { status: 500, data: [], message: 'No Account exists with provided Email' };
            }
        } catch(e) {
            return { status: 500, data: [], message: e.message };
        }
    }

    async changePassword(req, res){
        try{
            let userData = await userRepo.getById(req.user._id);
        
            if(!_.isEmpty(userData) && userData.isActive == true && userData.isDeleted == false) {
                if(userData.validPassword(req.body.old_password, userData.password)){
                    let newPassword = userData.generateHash(req.body.new_password);
                    let updatedUser = await userRepo.updateById({ password: newPassword }, req.user._id);
                    if(updatedUser){
                        return { status: 200, data: updatedUser, message: 'Password Changed Successfully' }
                    }
                } else {
                    return { status: 500, data: [], message: 'Wrong current Password' };
                    //throw new Error('Wrong current Password');
                }
            } else {
                return { status: 500, data: [], message: 'User not Found' };
                //throw new Error('User not Found');
            }
        } catch(e){
            return { status: 500, data: [], message: e.message };
        }
    }

}

module.exports = new userController();
