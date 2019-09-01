const mongoose = require('mongoose');
const User = require('user/models/user.model');
const perPage = config.PAGINATION_PERPAGE;

const userRepository = {
  getAllUsers: async ( req ) => {
        try {
            var conditions = {};
            var and_clauses = [];

            and_clauses.push({"isDeleted": false});

            if(_.isObject(req.body.query) && _.has(req.body.query, 'generalSearch')){
                and_clauses.push({ $or: [ { 'first_name': { $regex:  req.body.query.generalSearch, $options: 'i'} }, { 'last_name': { $regex:  req.body.query.generalSearch, $options: 'i'} }, { 'email': { $regex:  req.body.query.generalSearch, $options: 'i'} } ] });
            }
            if(_.isObject(req.body.query) && _.has(req.body.query, 'Status')){
                (req.body.query.Status == 'Active') ? and_clauses.push({"isActive": true}) : and_clauses.push({"isActive": false});
                //and_clauses.push({"isActive": req.body.query.Status});
            }

            conditions['$and'] = and_clauses;

            var sortOperator = { "$sort": { } };
            if(_.has(req.body, 'sort')){
                var sortField = req.body.sort.field;
                if(req.body.sort.sort == 'desc'){
                    var sortOrder = -1;
                }else if(req.body.sort.sort == 'asc'){
                    var sortOrder = 1;
                }
                
                sortOperator["$sort"][sortField] = sortOrder;
            }else{
                sortOperator["$sort"]['_id'] = -1;
            }

            var aggregate = User.aggregate([               
                { $match: conditions },
                sortOperator
            ]);

            var options = { page : req.body.pagination.page, limit : req.body.pagination.perpage};
            let allUsers = await User.aggregatePaginate(aggregate, options);
            
            return allUsers;
        } catch(e) {
            throw(e);
        }
    },
  

    getAllByField: async (params) => {
        let user =  await User.find(params).exec(); 
        try{
            if (!user) {
                return null;
            } 
            return user;
    
        }catch(e){
                return e;
        }
    },
 

    delete: async (id) => {
        try { 
                let user = await User.findById(id);
                if(user) {
                        let userDelete = await User.remove({_id:id}).exec();
                        if (!userDelete) {
                            return null;
                        }
                        return userDelete;
                }
        } catch(e){
            return e;
        }
    },

    deleteByField: async (field, fieldValue) => {
        //todo: Implement delete by field
    },


    updateById: async (data, id) =>{
        try {
            let user = await User.findByIdAndUpdate(id, data, { new: true});

            if (!user) {
               return null;
            }
            return user;
         } catch(e) {
            return e;
         }
    },

    updateByField: async (field, fieldValue, data) => {
        try {
            let user = await User.findByIdAndUpdate(fieldValue, field, { new: true});
            if (!user) {
               return null;
            }
            return user;
         } catch(e) {
            return e;
         }
    },

    save: async (data) => {
       try {
            let user = await User.create(data);
         
            if (!user) {
               return null;
            }
            return user;  
         }
         catch (e){
            return e;  
         }     
    },

	forgotPassword: async (params) => {
        try {
            let user = await User.findOne({email: params.email_p_c}).exec();
            if (!user) {
                return null;
            } else if (user) {
               
                let random_pass = Math.random().toString(36).substr(2, 9);
                let readable_pass = random_pass;
                random_pass = user.generateHash(random_pass);

                let user_details = await User.findByIdAndUpdate(user._id, { password: random_pass }).exec();
                if (!user_details) {  
                    return null;
                }  
                return readable_pass;

                   
            }     
       
     } catch(e){
         return e;
     }
    },

    getUser : async(id) =>{
       try{ 
            let user = await User.findOne({id}).exec(); 
            if (!user) {
            return null;
            }
            return user;  
        } catch(e){
            return e;
        }
    },

    getUserByField : async(data) =>{
        try{ 
             let user = await User.findOne(data).exec(); 
             if (!user) {
             return null;
             }
             return user;  
         } catch(e){
             return e;
         }
     },

};

module.exports = userRepository;