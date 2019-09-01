const mongoose = require('mongoose');
const book = require('book/models/book.model');
const perPage = config.PAGINATION_PERPAGE;

const bookRepository = {
 

    getAllbooks: async ( req ) => {
        try {
            var conditions = {};
            var and_clauses = [];

            and_clauses.push({"isDeleted": false});
            and_clauses.push({"status": "Active"});

            if (_.isObject(req.query) && _.has(req.query, 'generalSearch')) {
                and_clauses.push({
                    $or: [
                        { 'title': { $regex: req.query.generalSearch, $options: 'i' } },
                        { 'description': { $regex: req.query.generalSearch, $options: 'i' } },
                        { 'price': { $regex: req.query.generalSearch, $options: 'i' } },
                        { 'ISBN': { $regex: req.query.generalSearch, $options: 'i' } },
                        { 'author': { $regex: req.query.generalSearch, $options: 'i' } }
                    ]
                });
            }

            conditions['$and'] = and_clauses;

            var aggregate = book.aggregate([
                {
                    $lookup:{
                    "from": "users",
                    "localField": "user_id",
                    "foreignField": "_id",
                    "as": "seller"
                    }
                },
                { "$unwind": "$seller" },                
                { $match: conditions },
            ]);
            
            return aggregate;
        } catch(e) {
            throw(e);
        }
    },

    getAllbooksUser: async ( req ) => {
        try {
            var conditions = {};
            var and_clauses = [];

            and_clauses.push({"isDeleted": false});
            and_clauses.push({"seller._id": mongoose.Types.ObjectId(req.params.user_id)});

            if (_.isObject(req.query) && _.has(req.query, 'generalSearch')) {
                and_clauses.push({
                    $or: [
                        { 'title': { $regex: req.query.generalSearch, $options: 'i' } },
                        { 'description': { $regex: req.query.generalSearch, $options: 'i' } },
                        { 'price': { $regex: req.query.generalSearch, $options: 'i' } },
                        { 'ISBN': { $regex: req.query.generalSearch, $options: 'i' } },
                        { 'author': { $regex: req.query.generalSearch, $options: 'i' } }
                    ]
                });
            }

            conditions['$and'] = and_clauses;

            var aggregate = book.aggregate([
                {
                    $lookup:{
                    "from": "users",
                    "localField": "user_id",
                    "foreignField": "_id",
                    "as": "seller"
                    }
                },
                { "$unwind": "$seller" },                
                { $match: conditions },
            ]);
            
            return aggregate;
        } catch(e) {
            throw(e);
        }
    },

    getById: async (id) => {
       let books = await book.findById(id).exec();
       try{
        if (!books) {
            return null;
        } 
        return books;

       }catch(e){
            return e;
       }
    },

    getByIdWithUser: async (id) => {
        let books = await book.findById(id).populate('user_id').exec();
        try{
         if (!books) {
             return null;
         } 
         return books;
 
        }catch(e){
             return e;
        }
     },

    getByField: async (params) => {

        let books =  await book.findOne(params).exec();
        try{
            if (!books) {
                return null;
            } 
            return books;
    
        }catch(e){
                return e;
        }
    },

    getByFieldWithUser: async (params) => {

        let books =  await book.findOne(params).populate('user_id').exec();
        try{
            if (!books) {
                return null;
            } 
            return books;
    
        }catch(e){
                return e;
        }
    },

    getAllByField: async (params) => {
        let books =  await book.find(params).exec(); 
        try{
            if (!books) {
                return null;
            } 
            return books;
    
        }catch(e){
                return e;
        }
    },

    

    delete: async (id) => {
        try { 
                        let bookDelete = await book.remove({_id:id}).exec();
                        if (!bookDelete) {
                            return null;
                        }
                        return bookDelete;
                
        } catch(e){
            return e;
        }
    },

    deleteByField: async (field, fieldValue) => {
        //todo: Implement delete by field
    },


    updateById: async (data, id) =>{
        try {
            let books = await book.findByIdAndUpdate(id, data, { new: true});

            if (!books) {
               return null;
            }
            return books;
         } catch(e) {
            return e;
         }
    },

    updateByField: async (field, fieldValue, data) => {
        try {
            let books = await book.findByIdAndUpdate(fieldValue, field, { new: true});
            if (!books) {
               return null;
            }
            return books;
         } catch(e) {
            return e;
         }
    },

    save: async (data) => {
       try {
            let books = await book.create(data);
         
            if (!books) {
               return null;
            }
            return books;  
         }
         catch (e){
            return e;  
         }     
    },

};

module.exports = bookRepository;