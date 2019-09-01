const bookRepo = require('book/repositories/book.repository');

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


class bookController {
    constructor() {
        this.book = {};
    }

    async store(req, res) {
        try {
            let bookData = await bookRepo.getByField({ISBN:req.body.ISBN});
            if(!bookData)
            {
                req.body.user_id = req.user._id;
                let savebook = await bookRepo.save(req.body);

                        let html = `Hello ${req.user.first_name} ${req.user.last_name},<br>
                                Your book has been Registered Successfully to Book Store<br>
                                -Admin Team Book Store`;
                    
                        let sendMail = await transporter.sendMail({
                            from: `Admin<${process.env.MAIL_USERNAME}>`,
                            to: req.user.email,
                            subject: 'New book | Book Store',
                            html: html
                        });
                        
                        return { status: 200, data: savebook, message: 'Book saved.' };
                    }
                    else
                    {
                        return { status: 201, data: [], message: 'Book Already Exists.' };
                    }    
        } catch(e) {
            console.log("47", e)
            return { status: 500, data: [], message: e.message };
        }
    }

    async activeBooksWithFilter(req, res) {
        try {
                let books = await bookRepo.getAllbooks(req);
                        return { status: 200, data: books, message: 'Book Fetched Successfully.' };    
        } catch(e) {
            return { status: 500, data: [], message: e.message };
        }
    }

    async getAllBooksOfASeller(req, res) {
        try {
                let books = await bookRepo.getAllbooksUser(req);
                        return { status: 200, data: books, message: 'Book Fetched Successfully.' };    
        } catch(e) {
            return { status: 500, data: [], message: e.message };
        }
    }

    async updateBookStock(req, res) {
        try {
            let bookData = await bookRepo.getById(req.body.book_id);
            if(!bookData)
            {
                let savebook = await bookRepo.save(req.body);

                        let html = `Hello ${req.user.first_name} ${req.user.last_name},<br>
                                Your book has been Registered Successfully to Book Store<br>
                                -Admin Team Book Store`;
                    
                        let sendMail = await transporter.sendMail({
                            from: `Admin<${process.env.MAIL_USERNAME}>`,
                            to: req.user.email,
                            subject: 'New book | Book Store',
                            html: html
                        });
                        
                        return { status: 200, data: savebook, message: 'Book Saved Successfully.' };
                    }
                    else
                    {
                        let newStock = (bookData.stock + Number(req.body.stock));
                        let updateBook = await bookRepo.updateById({"stock": newStock}, bookData._id);
                        return { status: 200, data: updateBook, message: 'Book Stock updated' };
                    }    
        } catch(e) {
            return { status: 500, data: [], message: e.message };
        }
    }

    async deleteBook(req, res) {
        try {
            let bookData = await bookRepo.getById(req.body.book_id);
            if(bookData)
            {
                let removebook = await bookRepo.delete(req.body.book_id);
                        return { status: 200, data: removebook, message: 'Book Removed Successfully.' };
                    }
                    else
                    {
                        return { status: 201, message: 'Book Not Found' };
                    }    
        } catch(e) {
            return { status: 500, data: [], message: e.message };
        }
    }

    async statusChange(req, res) {
        try {
            let bookData = await bookRepo.getById(req.body.book_id);
            if(bookData)
            {
                let updateBook = await bookRepo.updateById({"status": req.body.status}, req.body.book_id);
                return { status: 200, data: updateBook, message: 'Book Stock updated' };
                    }
                    else
                    {
                        return { status: 201, message: 'Book Not Found' };
                    }    
        } catch(e) {
            return { status: 500, data: [], message: e.message };
        }
    }


}

module.exports = new bookController();
