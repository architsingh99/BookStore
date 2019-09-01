const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);

const multer = require('multer');
const bookController = require('webservice/book.controller');

const request_param = multer();



namedRouter.all('/book*', auth.authenticateAPI);

/**
 * @api {post} /book/save  Save A Book
 * @apiVersion 1.0.0
 * @apiGroup Book
 * @apiParam {string} title Titlle
 * @apiParam {string} description Description
 * @apiParam {string} author Author
 * @apiParam {number} price Price
 * @apiParam {number} stock Stock
 * @apiParam {number} ISBN ISBN
 * @apiHeader x-access-token User's Access token
 * @apiSuccessExample {json} Success
 * {
    "status": 200,
    "data": {
        "title": "www11",
        "description": "awesome11",
        "price": 34511,
        "ISBN": 1234511,
        "stock": 411,
        "author": "Archit11",
        "isDeleted": false,
        "status": "Active",
        "user_id": "5d6bcaea4a15751e48a3d43f",
        "_id": "5d6bfcd6ad64e623a48c1622",
        "createdAt": "2019-09-01T17:16:06.197Z",
        "__v": 0
    },
    "message": "Book saved."
}
*/

namedRouter.post("api.book.save", '/book/save', request_param.any(), async (req, res) => {
    try {
        const success = await bookController.store(req, res);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

/**
 * @api {get} /book/getBookForSale Get Books For Sale 
 * @apiVersion 1.0.0
 * @apiGroup Book
 * @apiParam {string} generalSearch Search keyword (Optional)
 * @apiHeader x-access-token User's Access token
 * @apiSuccessExample {json} Success
 * {
    "status": 200,
    "data": [
        {
            "_id": "5d6bfe28a126b3243059d79b",
            "title": "MoodCafe",
            "description": "Mood",
            "price": 34511,
            "ISBN": 888,
            "stock": 411,
            "author": "Achit",
            "isDeleted": false,
            "status": "Active",
            "user_id": "5d6bcaea4a15751e48a3d43f",
            "createdAt": "2019-09-01T17:21:44.099Z",
            "__v": 0,
            "seller": {
                "_id": "5d6bcaea4a15751e48a3d43f",
                "first_name": "Archit",
                "last_name": "Singh",
                "email": "architsingh99@gmail.com",
                "password": "$2a$08$RMApD3zFCRQnG33Mfm2lc./pY3rQKDDmweIyfTmajurMalKGReQn6",
                "isEmailVerified": true,
                "verification_code": "",
                "isDeleted": false,
                "isActive": true,
                "createdAt": "2019-09-01T13:43:06.164Z",
                "__v": 0
            }
        },
        {
            "_id": "5d6bfe37a126b3243059d79c",
            "title": "MoodCafe",
            "description": "Mood",
            "price": 34511,
            "ISBN": 999,
            "stock": 411,
            "author": "Achit",
            "isDeleted": false,
            "status": "Active",
            "user_id": "5d6bcaea4a15751e48a3d43f",
            "createdAt": "2019-09-01T17:21:59.876Z",
            "__v": 0,
            "seller": {
                "_id": "5d6bcaea4a15751e48a3d43f",
                "first_name": "Archit",
                "last_name": "Singh",
                "email": "architsingh99@gmail.com",
                "password": "$2a$08$RMApD3zFCRQnG33Mfm2lc./pY3rQKDDmweIyfTmajurMalKGReQn6",
                "isEmailVerified": true,
                "verification_code": "",
                "isDeleted": false,
                "isActive": true,
                "createdAt": "2019-09-01T13:43:06.164Z",
                "__v": 0
            }
        }
    ],
    "message": "Book Fetched Successfully."
}
*/

namedRouter.get("api.book.getBookForSale", '/book/getBookForSale', request_param.any(), async (req, res) => {
    try {
        const success = await bookController.activeBooksWithFilter(req, res);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

/**
 * @api {get} /book/getBooksPerSeller/:user_id Get Books of a Seller 
 * @apiVersion 1.0.0
 * @apiGroup Book
 * @apiParam {string} generalSearch Search keyword (Optional)
 * @apiParam {string} user_id Seller id
 * @apiHeader x-access-token User's Access token
 * @apiSuccessExample {json} Success
 * {
    "status": 200,
    "data": [
        {
            "_id": "5d6bfe28a126b3243059d79b",
            "title": "MoodCafe",
            "description": "Mood",
            "price": 34511,
            "ISBN": 888,
            "stock": 411,
            "author": "Achit",
            "isDeleted": false,
            "status": "Active",
            "user_id": "5d6bcaea4a15751e48a3d43f",
            "createdAt": "2019-09-01T17:21:44.099Z",
            "__v": 0,
            "seller": {
                "_id": "5d6bcaea4a15751e48a3d43f",
                "first_name": "Archit",
                "last_name": "Singh",
                "email": "architsingh99@gmail.com",
                "password": "$2a$08$RMApD3zFCRQnG33Mfm2lc./pY3rQKDDmweIyfTmajurMalKGReQn6",
                "isEmailVerified": true,
                "verification_code": "",
                "isDeleted": false,
                "isActive": true,
                "createdAt": "2019-09-01T13:43:06.164Z",
                "__v": 0
            }
        },
        {
            "_id": "5d6bfe37a126b3243059d79c",
            "title": "MoodCafe",
            "description": "Mood",
            "price": 34511,
            "ISBN": 999,
            "stock": 411,
            "author": "Achit",
            "isDeleted": false,
            "status": "Active",
            "user_id": "5d6bcaea4a15751e48a3d43f",
            "createdAt": "2019-09-01T17:21:59.876Z",
            "__v": 0,
            "seller": {
                "_id": "5d6bcaea4a15751e48a3d43f",
                "first_name": "Archit",
                "last_name": "Singh",
                "email": "architsingh99@gmail.com",
                "password": "$2a$08$RMApD3zFCRQnG33Mfm2lc./pY3rQKDDmweIyfTmajurMalKGReQn6",
                "isEmailVerified": true,
                "verification_code": "",
                "isDeleted": false,
                "isActive": true,
                "createdAt": "2019-09-01T13:43:06.164Z",
                "__v": 0
            }
        }
    ],
    "message": "Book Fetched Successfully."
}
*/

namedRouter.get("api.book.getBooksPerSeller", '/book/getBooksPerSeller/:user_id', request_param.any(), async (req, res) => {
    try {
        const success = await bookController.getAllBooksOfASeller(req, res);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

/**
 * @api {post} /book/updateBookStock Increase the stock of a book
 * @apiVersion 1.0.0
 * @apiGroup Book
 * @apiParam {number} stock Increase Number of books
 * @apiParam {string} book_id Book id
 * @apiHeader x-access-token User's Access token
 * @apiSuccessExample {json} Success
 * {
    "status": 200,
    "data": {
        "title": "www",
        "description": "awesome",
        "price": 345,
        "ISBN": 12345,
        "stock": 44,
        "author": "Archit",
        "isDeleted": false,
        "status": "Active",
        "user_id": "5d6bcaea4a15751e48a3d43f",
        "_id": "5d6bfc97ad64e623a48c1621",
        "createdAt": "2019-09-01T17:15:03.530Z",
        "__v": 0
    },
    "message": "Book Stock updated"
}
*/

namedRouter.post("api.book.updateBookStock", '/book/updateBookStock', request_param.any(), async (req, res) => {
    try {
        const success = await bookController.updateBookStock(req, res);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

/**
 * @api {post} /book/deleteBook Delete a book
 * @apiVersion 1.0.0
 * @apiGroup Book
 * @apiParam {string} book_id Book id
 * @apiHeader x-access-token User's Access token
 * @apiSuccessExample {json} Success
 * {
    "status": 200,
    "data": {
        "n": 1,
        "opTime": {
            "ts": "6731757484337266689",
            "t": 1
        },
        "electionId": "7fffffff0000000000000001",
        "ok": 1,
        "operationTime": "6731757484337266689",
        "$clusterTime": {
            "clusterTime": "6731757484337266689",
            "signature": {
                "hash": "OJ22BAjk9I1/JnX6b+exzUu9TCU=",
                "keyId": "6731441172880818177"
            }
        },
        "deletedCount": 1
    },
    "message": "Book Removed Successfully."
}
*/

namedRouter.post("api.book.deleteBook", '/book/deleteBook', request_param.any(), async (req, res) => {
    try {
        const success = await bookController.deleteBook(req, res);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

/**
 * @api {post} /book/statusChange Change Status of a book
 * @apiVersion 1.0.0
 * @apiGroup Book
 * @apiParam {string} book_id Book id
 * @apiParam {string} status New Status of the book [Active, Inactive]
 * @apiHeader x-access-token User's Access token
 * @apiSuccessExample {json} Success
 * {
    "status": 200,
    "data": {
        "title": "www11",
        "description": "awesome11",
        "price": 34511,
        "ISBN": 1234511,
        "stock": 411,
        "author": "Archit11",
        "isDeleted": false,
        "status": "Active",
        "user_id": "5d6bcaea4a15751e48a3d43f",
        "_id": "5d6bfcd6ad64e623a48c1622",
        "createdAt": "2019-09-01T17:16:06.197Z",
        "__v": 0
    },
    "message": "Book Stock updated"
}
*/

namedRouter.post("api.book.statusChange", '/book/statusChange', request_param.any(), async (req, res) => {
    try {
        const success = await bookController.statusChange(req, res);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


// Export the express.Router() instance
module.exports = router;
