const mongoose = require('mongoose');
const transaction = require('transactions/models/transaction.model');
const perPage = config.PAGINATION_PERPAGE;

const transactionRepository = {

    getById: async (id) => {
       let transactions = await transaction.findById(id).exec();
       try{
        if (!transactions) {
            return null;
        } 
        return transactions;

       }catch(e){
            return e;
       }
    },

    getByIdWithBook: async (id) => {
        let transactions = await transaction.findById(id).populate('book_id').exec();
        try{
         if (!transactions) {
             return null;
         } 
         return transactions;
 
        }catch(e){
             return e;
        }
     },

    getByField: async (params) => {

        let transactions =  await transaction.findOne(params).exec();
        try{
            if (!transactions) {
                return null;
            } 
            return transactions;
    
        }catch(e){
                return e;
        }
    },

    getByFieldWithBook: async (params) => {

        let transactions =  await transaction.findOne(params).populate('book_id').exec();
        try{
            if (!transactions) {
                return null;
            } 
            return transactions;
    
        }catch(e){
                return e;
        }
    },

    getAllByField: async (params) => {
        let transactions =  await transaction.find(params).exec(); 
        try{
            if (!transactions) {
                return null;
            } 
            return transactions;
    
        }catch(e){
                return e;
        }
    },

    

    delete: async (id) => {
        try { 
                        let transactionDelete = await transaction.remove({_id:id}).exec();
                        if (!transactionDelete) {
                            return null;
                        }
                        return transactionDelete;
                
        } catch(e){
            return e;
        }
    },

    deleteByField: async (field, fieldValue) => {
        //todo: Implement delete by field
    },


    updateById: async (data, id) =>{
        try {
            let transactions = await transaction.findByIdAndUpdate(id, data, { new: true});

            if (!transactions) {
               return null;
            }
            return transactions;
         } catch(e) {
            return e;
         }
    },

    updateByField: async (field, fieldValue, data) => {
        try {
            let transactions = await transaction.findByIdAndUpdate(fieldValue, field, { new: true});
            if (!transactions) {
               return null;
            }
            return transactions;
         } catch(e) {
            return e;
         }
    },

    save: async (data) => {
       try {
            let transactions = await transaction.create(data);
         
            if (!transactions) {
               return null;
            }
            return transactions;  
         }
         catch (e){
            return e;  
         }     
    },

};

module.exports = transactionRepository;