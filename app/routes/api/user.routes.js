const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);

const multer = require('multer');
const userController = require('webservice/user.controller');

const request_param = multer();


// Common User Modules Starts

/**
 * @api {post} /user/signup Sign Up
 * @apiVersion 1.0.0
 * @apiGroup User
 * @apiParam {string} email User Email.
 * @apiParam {string} password Password.
 * @apiParam {string} first_name First Name.
 * @apiParam {string} last_name Last Name.
 * @apiSuccessExample {json} Success
 * {
    "status": 200,
    "data": {
        "first_name": "Archit",
        "last_name": "Singh",
        "email": "architsingh99@gmail.com",
        "password": "123456",
        "isEmailVerified": false,
        "verification_code": "9509",
        "isDeleted": false,
        "isActive": true,
        "_id": "5d6bc4094bb7db06e8f37444",
        "__v": 0
    },
    "message": "Registration Successful, Please Check your Email for verification OTP"
}
*/
namedRouter.post("api.user.signup", '/user/signup', request_param.any(), async (req, res) => {
    try {
        const success = await userController.signup(req, res);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

/**
 * @api {post} /user/forgotpassword Forgot Password
 * @apiVersion 1.0.0
 * @apiGroup User
 * @apiParam {string} email User Email.
 * @apiSuccessExample {json} Success
 * {
    "status": 200,
    "data": {},
    "message": "New password sent to provided Email"
}
*/
namedRouter.post("api.user.forgotpassword", '/user/forgotpassword', request_param.any(), async (req, res) => {
    try {
        const success = await userController.resetPassword(req, res);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

/**
 * @api {post} /user/verifyotp Verify OTP
 * @apiVersion 1.0.0
 * @apiGroup User
 * @apiParam {string} email User Email.
 * @apiParam {string} otp OTP
 * @apiSuccessExample {json} Success
 * {
    "status": 200,
    "data": {},
    "message": "Email verified Successfully"
}
*/
namedRouter.post("api.user.verifyotp", '/user/verifyotp', request_param.any(), async (req, res) => {
    try {
        const success = await userController.verifyOTP(req, res);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

/**
 * @api {post} /user/signin Verify OTP
 * @apiVersion 1.0.0
 * @apiGroup User
 * @apiParam {string} email User Email.
 * @apiParam {string} otp OTP
 * @apiSuccessExample {json} Success
 * {
    "status": 200,
    "data": {},
    "message": "Email verified Successfully"
}
*/
namedRouter.post("api.user.signin", '/user/signin', request_param.any(), async (req, res) => {
    try {
        const success = await userController.signin(req, res);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

namedRouter.all('/user*', auth.authenticateAPI);

/**
 * @api {post} /user/changepassword  Change Password
 * @apiVersion 1.0.0
 * @apiGroup User
 * @apiParam {string} old_password Old password
 * @apiParam {string} new_password New password
 * @apiHeader x-access-token User's Access token
 * @apiSuccessExample {json} Success
 * {
    "status": 200,
    "data": {
        "first_name": "Archit",
        "last_name": "Singh",
        "email": "architsingh99@gmail.com",
        "password": "$2a$08$RMApD3zFCRQnG33Mfm2lc./pY3rQKDDmweIyfTmajurMalKGReQn6",
        "isEmailVerified": true,
        "verification_code": "",
        "isDeleted": false,
        "isActive": true,
        "_id": "5d6bcaea4a15751e48a3d43f",
        "createdAt": "2019-09-01T13:43:06.164Z",
        "__v": 0
    },
    "message": "Password Changed Successfully"
}
*/

namedRouter.post("api.user.changePassword", '/user/changepassword', request_param.any(), async (req, res) => {
    try {
        const success = await userController.changePassword(req, res);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


// Export the express.Router() instance
module.exports = router;
