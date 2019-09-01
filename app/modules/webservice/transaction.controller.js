const transactionRepo = require('transactions/repositories/transaction.repository');

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


class transactionController {
    constructor() {
        this.transaction = {};
    }

    async store(req, res) {
        try {
                let savetransaction = await transactionRepo.save(req.body);

                        let html = `Hello,<br>
                                Your transaction has been Completed Successfully.<br>
                                -Admin Team transaction Store`;
                    
                        let sendMail = await transporter.sendMail({
                            from: `Admin<${process.env.MAIL_USERNAME}>`,
                            to: req.body.email,
                            subject: 'Transaction Successfull | Book Store',
                            html: html
                        });
                        
                        return { status: 200, data: savetransaction, message: 'transaction saved.' }    
        } catch(e) {
            console.log("47", e)
            return { status: 500, data: [], message: e.message };
        }
    }




}

module.exports = new transactionController();
