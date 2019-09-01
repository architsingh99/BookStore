const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);

const multer = require('multer');
const transactionController = require('webservice/transaction.controller');

const request_param = multer();




/**
 * @api {post} /transaction/save  Save A Transaction
 * @apiVersion 1.0.0
 * @apiGroup Transaction
 * @apiParam {string} email Email
 * @apiParam {string} book_id Book Id
 * @apiSuccessExample {json} Success
 * {
    "status": 200,
    "data": {
        "email": "architsingh99@gmail.com",
        "isDeleted": false,
        "status": "Active",
        "book_id": "5d6bfcd6ad64e623a48c1622",
        "_id": "5d6c0a99739ec80938768f95",
        "createdAt": "2019-09-01T18:14:49.222Z",
        "__v": 0
    },
    "message": "transaction saved."
}
*/

namedRouter.post("api.transaction.save", '/transaction/save', request_param.any(), async (req, res) => {
    try {
        const success = await transactionController.store(req, res);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Export the express.Router() instance
module.exports = router;
