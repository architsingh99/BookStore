
const nodemailer = require('nodemailer');
// aws.config.update({
//     accessKeyId: config.AWS_ACCESS_KEY,
//     secretAccessKey:  config.AWS_SECRET_KEY,
// });

// s3 = new aws.S3();

const isProd = process.env.NODE_ENV === 'prod';

module.exports = {
    jwtSecret: "MyS3cr3tK3Y",
    jwtSession: {
        session: false
    },
    PAGINATION_PERPAGE: 10,    
    isProd,
    getPort: process.env.PORT || 5000,
    // getAdminFolderName: process.env.ADMIN_FOLDER_NAME || 'admin',
    // getFrontFolderName: process.env.FRONT_FOLDER_NAME || 'front',
     getApiFolderName: process.env.API_FOLDER_NAME || 'api',
    transporter: nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
        }
    }),
    YODLEE_ISSUER_ID: "0098bef0-0c4a15fe-8d06-4ab5-b651-2b9b76fb22ae"
}
