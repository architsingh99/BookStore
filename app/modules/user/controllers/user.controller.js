const mongoose = require('mongoose');
const UserModel = require('user/models/user.model');
const userRepo = require('user/repositories/user.repository');
const roleRepo = require('role/repositories/role.repository');
const worker_payment_preferenceRepo = require('worker_payment_preference/repositories/worker_payment_preference.repository');
const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const querystring = require('querystring');
const gm = require('gm').subClass({ imageMagick: true });
const fs = require('fs');
const jwt = require('jsonwebtoken');
//mail send 
const { join } = require('path');
const ejs = require('ejs');
const { readFile } = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(readFile);


class UserController {
    constructor() {
        this.users = [];

    }

    /* @Method: login
    // @Description: user Login Render
    */
    async login(req, res) {
        res.render('user/views/login.ejs');
    };

    /* @Method: signin
    // @Description: user Login
    */
    async signin(req, res) {
        try {

            let userData = await userRepo.fineOneWithRole(req.body);
            if (userData.status == 500) {
                return res.status(201).send({ "result":[],"message":userData.message, "status":false });
                //req.flash('error', userData.message);
                //return res.redirect(namedRouter.urlFor('user.login'));
            }
            
            let user = userData.data;
            if (!_.isEmpty(user.role) && user.role.role == 'admin') {
                
                const payload = {
                    id: user._id
                };

                let token = jwt.sign(payload, config.jwtSecret, {
                    expiresIn: 86400 // expires in 24 hours
                });
                req.session.token = token;
                req.user = user;
                let user_details = {};
                user_details.id = user._id;
                user_details.name = user.name;
                user_details.email = user.email;
                // return the information including token as JSON
                return res.status(200).send({ "result":user_details,"message":"You have successfully logged in", "status":true });
                // req.flash('success', "You have successfully logged in");
                
                // res.redirect(namedRouter.urlFor('admin.user.dashboard'));
            } else {
                return res.status(201).send({ "result":[],"message":"Incorrect username or password. Please try again.", "status":false });
                // req.flash('error', 'Authentication failed. Wrong credentials.');
                // res.redirect(namedRouter.urlFor('user.login'));
            }

        } catch (e) {
            
            return res.status(500).send({ message: e.message });
        }
    };

    /* @Method: signup
    // @Description: user Signup
    */
    async signup(req, res) {
        try {
            
            var roleDetails = await roleRepo.getByField({'role': 'users'});
                            
            if (!_.isEmpty(roleDetails)) {
            
                const userDetails = await userRepo.getByField({
                    'email': req.body.user_email
                });

                if (_.isEmpty(userDetails) || _.isNull(userDetails)) {
                    
                    req.body.role = roleDetails._id
                    
                    const User = new UserModel();
                    req.body.password = User.generateHash(req.body.password);
                    req.body.email = req.body.user_email;
                    req.body.full_name = req.body.hdn_full_name;
                    req.body.company_name = req.body.hdn_company_name;
                    req.body.country = req.body.hdn_country;
                    req.body.phone = req.body.hdn_phone;

                    const saveUser = await userRepo.save(req.body);
                    
                    return res.status(200).send({ "result":saveUser,"message":"Registration successfull", "status":true });
                } else {
                    return res.status(201).send({ "result":{},"message":"Email already Exists", "status":false });
                }
            } else {
                throw new Error("Invalid User type");
            }
        } catch (error) {
            throw error.message;
        }
    };

    /* @Method: create
    // @Description: user create view render
    */
    async create(req, res) {
        try {
            let success = {};
            let role = await roleRepo.getAll({});
            success.data = role;
            let country = await countryRepo.getAllByField({ isActive: true });
            success.country = country;

            res.render('user/views/add.ejs', {
                page_name: 'user-management',
                page_title: 'Create Vehicle Owner',
                user: req.user,
                response: success
            });
        } catch (e) {
            return res.status(500).send({ message: e.message });
        }
    };    

    
    /* @Method: Dashboard
    // @Description: User Dashboard
    */
    async dashboard(req, res) {
        try {
            let relsultall = {};
            let user = await userRepo.getLimitUserByField({'isDeleted':false,_id:{$ne:mongoose.Types.ObjectId(req.user._id)}});
            relsultall.user = user;
           
            //////////////////////////
            res.render('user/views/dashboard.ejs', {
                page_name: 'user-dashboard',
                page_title: 'Dashboard',
                user: req.user,
                response: []                    
            });
            
        } catch (e) {
            throw (e);
        }
    };

    /* @Method: Logout
    // @Description: User Logout
    */
    async logout(req, res) {
        req.session.destroy(function (err) {
            //res.redirect('/' + process.env.ADMIN_FOLDER_NAME);
            res.redirect('/admin');
        });
        // req.session.token = "";
        // req.session.destroy();
        // return res.redirect('/');
    };

    async adminChangePassword(req, res) {
        try {
            res.render('user/views/change_password.ejs', {
                page_name: 'change-password',
                page_title: 'Change Password',
                user: req.user,
            });
            // return { status: 200, data: [], message: 'Change Password ' }
        } catch(e) {
            throw ({message: e.message});
        }
    }

    async dashboardCounts(req, res) {
        try {
            let customers = await userRepo.getAllActiveUsersByRole('customer');
            let boosters = await userRepo.getAllActiveUsersByRole('booster');
            let managers = await userRepo.getAllActiveUsersByRole('manager');
            let assistants = await userRepo.getAllActiveUsersByRole('assistant');;
            return { status: 200, data: { customers: customers.length, boosters: boosters.length, managers: managers.length, assistants: assistants.length}, message: 'Data Fetched Successfully' };
        } catch(e) {
            throw ({ message: e.message });
        }
    }

    async resetUserPassword(req, res) {
        try {
            let user = await userRepo.getById(req.params.id);
            if(user){
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
                        subject: 'Reset Password | Game Boosting',
                        html: `Hello ${user.first_name} ${user.last_name},<br>
                                We have received your Password Reset request.<br>
                                Here is your New Password: <b>${readable_pass}</b><br>
                                -Game Boosting Admin Team`
                };
                let sendEmail = await transporter.sendMail(mailOptions);
                req.flash('success', 'Password Reset Successful, Email sent containing password');
                res.redirect(namedRouter.urlFor('admin.managers'));

            } else {
                req.flash('error', 'User not Found');
                res.redirect(namedRouter.urlFor('admin.managers'));
            }
        } catch(e) {
            throw ({message: e.message});
        }
    }

    // Managers Module Starts
    async managersList(req, res) {
        try {
            res.render('user/views/managers-list.ejs', {
                page_name: 'users-mgmt',
                page_title: 'Managers List',
                user: req.user,
                response: []
            });
        } catch(e) {
            throw ({message: e.message});
        }
    }

    async allManagers(req, res) {
        try {
            req.body.role = 'manager';
            if(_.has(req.body, 'sort')){
                var sortOrder = req.body.sort.sort;
                var sortField = req.body.sort.field;
            }else{
                var sortOrder = -1;
                var sortField = '_id';
            }

            if(!_.has(req.body, 'pagination')){
                req.body.pagination.page = 1;
                req.body.pagination.perpage = config.PAGINATION_PERPAGE
            }
            let managers = await userRepo.getUsersListByRole(req);
            let meta = {"page": req.body.pagination.page, "pages": managers.pageCount, "perpage": req.body.pagination.perpage, "total": managers.totalCount, "sort": sortOrder, "field": sortField}; 

            return {status: 200, meta: meta, data:managers.data, message: `Data fetched succesfully.`};
        } catch(e) {
            throw({message: e.message});
        }
    }
    
    async createManager(req, res) {
        try {
            res.render('user/views/add-manager.ejs', {
                page_name: 'users-mgmt',
                page_title: 'Create Manager',
                user: req.user,
            });
        } catch(e) {
            throw ({ message: e.message });
        }
    }

    async storeManager(req, res) {
        try {
            let managerRole = await roleRepo.getByField({role: 'manager'});
            req.body.role = managerRole._id;
            const User = new UserModel();
            req.body.password = User.generateHash(req.body.password);
            let manager = await userRepo.save(req.body);
            req.flash('success', 'Manager Created Successfully');
            res.redirect(namedRouter.urlFor('admin.managers'));
        } catch(e) {
            throw ({ message: e.message });
        }
    }

    async changeManagerStatus(req, res) {
        try {
            let manager = await userRepo.getById(req.params.id);
            if(!_.isEmpty(manager)) {
                let status = (manager.isActive == true)? false : true;
                let managerUpdate = await userRepo.updateById({ isActive: status }, req.params.id);
                req.flash('success', 'Manager Status Updated Successfully');
                res.redirect(namedRouter.urlFor('admin.managers'));
                // return { status: 200, data: managerUpdate, message: 'Status changed Successfully' };
            } else {
                throw ({ message: 'Invalid Manager selected' });
            }
        } catch(e) {
            throw({ message: e.message });
        }
    }

    async editManager(req,res) {
        try {
            let manager = await userRepo.getById(req.params.id);
            if (!_.isEmpty(manager)) {
                res.render('user/views/edit-manager.ejs', {
                    page_name: 'users-mgmt',
                    page_title: 'View Manager',
                    user: req.user,
                    response: manager
                });
            }
        } catch(e) {
            throw({message: e.message});
        }
    }

    // async updateManager(req, res) {
    //     try {
    //         return { status: 200, data: [], message: 'Data updatedSuccessfully' };
    //     } catch(e) {
    //         throw({message: e.message});
    //     }
    // }

    async deleteManager(req, res) {
        try {
            let manager = await userRepo.updateById({isDeleted: true}, req.params.id);
            req.flash('success', 'Manager Deleted Successfully');
            res.redirect(namedRouter.urlFor('admin.managers'));
        } catch(e) {
            throw({message: e.message});
        }
    }
    // Manager Module Ends

    // Customers Module Starts
    async customersList(req, res) {
        try {
            res.render('user/views/customers-list.ejs', {
                page_name: 'users-mgmt',
                page_title: 'Customers List',
                user: req.user,
                response: []
            });
        } catch(e) {
            throw ({message: e.message});
        }
    }

    async allCustomers(req, res) {
        try {
            req.body.role = 'customer';
            if(_.has(req.body, 'sort')){
                var sortOrder = req.body.sort.sort;
                var sortField = req.body.sort.field;
            }else{
                var sortOrder = -1;
                var sortField = '_id';
            }

            if(!_.has(req.body, 'pagination')){
                req.body.pagination.page = 1;
                req.body.pagination.perpage = config.PAGINATION_PERPAGE
            }
            let customers = await userRepo.getUsersListByRole(req);
            let meta = {"page": req.body.pagination.page, "pages": customers.pageCount, "perpage": req.body.pagination.perpage, "total": customers.totalCount, "sort": sortOrder, "field": sortField}; 

            return {status: 200, meta: meta, data:customers.data, message: `Data fetched succesfully.`};
        } catch(e) {
            throw({message: e.message});
        }
    }
    
    async createCustomer(req, res) {
        try {
            res.render('user/views/add-customer.ejs', {
                page_name: 'users-mgmt',
                page_title: 'Create Customer',
                user: req.user,
            });
        } catch(e) {
            throw ({ message: e.message });
        }
    }

    async storeCustomer(req, res) {
        try {
            let managerRole = await roleRepo.getByField({role: 'customer'});
            req.body.role = managerRole._id;
            const User = new UserModel();
            req.body.password = User.generateHash(req.body.password);
            let manager = await userRepo.save(req.body);
            req.flash('success', 'Customer Created Successfully');
            res.redirect(namedRouter.urlFor('admin.customers'));
        } catch(e) {
            throw ({ message: e.message });
        }
    }

    async changeCustomerStatus(req, res) {
        try {
            let customer = await userRepo.getById(req.params.id);
            if(!_.isEmpty(customer)) {
                let status = (customer.isActive == true)? false : true;
                let customerUpdate = await userRepo.updateById({ isActive: status }, req.params.id);
                req.flash('success', 'Customer Status Updated Successfully');
                res.redirect(namedRouter.urlFor('admin.customers'));
                // return { status: 200, data: customerUpdate, message: 'Status changed Successfully' };
            } else {
                throw ({ message: 'Invalid Customer selected' });
            }
        } catch(e) {
            throw({ message: e.message });
        }
    }

    async editCustomer(req,res) {
        try {
            let manager = await userRepo.getById(req.params.id);
            if (!_.isEmpty(manager)) {
                res.render('user/views/edit-manager.ejs', {
                    page_name: 'users-mgmt',
                    page_title: 'View Customer',
                    user: req.user,
                    response: manager
                });
            }
        } catch(e) {
            throw({message: e.message});
        }
    }

    // async updateManager(req, res) {
    //     try {
    //         return { status: 200, data: [], message: 'Data updatedSuccessfully' };
    //     } catch(e) {
    //         throw({message: e.message});
    //     }
    // }

    async deleteCustomer(req, res) {
        try {
            let manager = await userRepo.updateById({isDeleted: true}, req.params.id);
            req.flash('success', 'Customer Deleted Successfully');
            res.redirect(namedRouter.urlFor('admin.customers'));
        } catch(e) {
            throw({message: e.message});
        }
    }
    // Customers Module Ends

    // Booster Module Starts
    async boostersList(req, res) {
        try {
            req.body.role = 'manager';
            let managers = await userRepo.getAllUsersByRole(req);
            res.render('user/views/boosters-list.ejs', {
                page_name: 'users-mgmt',
                page_title: 'Booster List',
                user: req.user,
                response: [],
                managers
            });
        } catch(e) {
            throw ({message: e.message});
        }
    }

    async allBoosters(req, res) {
        try {
            req.body.role = 'booster';
            if(_.has(req.body, 'sort')){
                var sortOrder = req.body.sort.sort;
                var sortField = req.body.sort.field;
            }else{
                var sortOrder = -1;
                var sortField = '_id';
            }

            if(!_.has(req.body, 'pagination')){
                req.body.pagination.page = 1;
                eq.body.pagination.perpage = config.PAGINATION_PERPAGE
            }
            let boosters = await userRepo.getUsersListByRole(req);
            let meta = {"page": req.body.pagination.page, "pages": boosters.pageCount, "perpage": req.body.pagination.perpage, "total": boosters.totalCount, "sort": sortOrder, "field": sortField}; 

            return {status: 200, meta: meta, data:boosters.data, message: `Data fetched succesfully.`};
        } catch(e) {
            throw({message: e.message});
        }
    }
    
    async createBooster(req, res) {
        try {
            req.body.role = 'manager';
            let managers = await userRepo.getAllUsersByRole(req);
            console.log('515', managers);
            res.render('user/views/add-booster.ejs', {
                page_name: 'users-mgmt',
                page_title: 'Create Booster',
                user: req.user,
                managers,
            });
        } catch(e) {
            console.log('523', e);
            throw ({ message: e.message });
        }
    }

    async storeBooster(req, res) {
        try {
            let boosterRole = await roleRepo.getByField({role: 'booster'});
            req.body.role = boosterRole._id;
            const User = new UserModel();
            req.body.password = User.generateHash(req.body.password);
            let booster = await userRepo.save(req.body);
            let boosterData = {worker_id: booster._id, paypal_email: req.body.paypal_email};
            let boosterPreference = worker_payment_preferenceRepo.save(boosterData);
            req.flash('success', 'Booster Created Successfully');
            res.redirect(namedRouter.urlFor('admin.boosters'));
        } catch(e) {
            throw ({ message: e.message });
        }
    }

    async changeBoosterStatus(req, res) {
        try {
            let booster = await userRepo.getById(req.params.id);
            if(!_.isEmpty(booster)) {
                let status = (booster.isActive == true)? false : true;
                let boosterUpdate = await userRepo.updateById({ isActive: status }, req.params.id);
                req.flash('success', 'Booster Status Updated Successfully');
                res.redirect(namedRouter.urlFor('admin.boosters'));
                // return { status: 200, data: managerUpdate, message: 'Status changed Successfully' };
            } else {
                throw ({ message: 'Invalid Booster selected' });
            }
        } catch(e) {
            throw({ message: e.message });
        }
    }

    async editBooster(req,res) {
        try {
            req.body.role = 'manager';
            let managers = await userRepo.getAllUsersByRole(req);
            let booster = await userRepo.getById(req.params.id);
            booster = booster.toObject();
            let boosterWorkerPayment = await worker_payment_preferenceRepo.getByField({worker_id:mongoose.Types.ObjectId(booster._id)});
            
            booster['payment_percentage'] = boosterWorkerPayment;
            
            if (!_.isEmpty(booster)) {
                res.render('user/views/edit-booster.ejs', {
                    page_name: 'users-mgmt',
                    page_title: 'View Booster',
                    user: req.user,
                    response: booster,
                    managers,
                });
            }
        } catch(e) {
            throw({message: e.message});
        }
    }

    // async updateManager(req, res) {
    //     try {
    //         return { status: 200, data: [], message: 'Data updatedSuccessfully' };
    //     } catch(e) {
    //         throw({message: e.message});
    //     }
    // }

    async deleteBooster(req, res) {
        try {
            let booster = await userRepo.updateById({isDeleted: true}, req.params.id);
            req.flash('success', 'Booster Deleted Successfully');
            res.redirect(namedRouter.urlFor('admin.boosters'));
        } catch(e) {
            throw({message: e.message});
        }
    }
    // Booster Module Ends

    // Assistant Module Starts
    async assistantsList(req, res) {
        try {
            req.body.role = 'manager';
            let managers = await userRepo.getAllUsersByRole(req);
            res.render('user/views/assistants-list.ejs', {
                page_name: 'users-mgmt',
                page_title: 'Assistant List',
                user: req.user,
                response: [],
                managers
            });
        } catch(e) {
            throw ({message: e.message});
        }
    }

    async allAssistants(req, res) {
        try {
            req.body.role = 'assistant';
            if(_.has(req.body, 'sort')){
                var sortOrder = req.body.sort.sort;
                var sortField = req.body.sort.field;
            }else{
                var sortOrder = -1;
                var sortField = '_id';
            }

            if(!_.has(req.body, 'pagination')){
                req.body.pagination.page = 1;
                eq.body.pagination.perpage = config.PAGINATION_PERPAGE
            }
            let assistants = await userRepo.getUsersListByRole(req);
            let meta = {"page": req.body.pagination.page, "pages": assistants.pageCount, "perpage": req.body.pagination.perpage, "total": assistants.totalCount, "sort": sortOrder, "field": sortField}; 

            return {status: 200, meta: meta, data:assistants.data, message: `Data fetched succesfully.`};
        } catch(e) {
            throw({message: e.message});
        }
    }
    
    async createAssistant(req, res) {
        try {
            req.body.role = 'manager';
            let managers = await userRepo.getAllUsersByRole(req);
            res.render('user/views/add-assistant.ejs', {
                page_name: 'users-mgmt',
                page_title: 'Create Assistant',
                user: req.user,
                managers,
            });
        } catch(e) {
            throw ({ message: e.message });
        }
    }

    async storeAssistant(req, res) {
        try {
            let assistantRole = await roleRepo.getByField({role: 'assistant'});
            req.body.role = assistantRole._id;
            const User = new UserModel();
            req.body.password = User.generateHash(req.body.password);
            let assistant = await userRepo.save(req.body);
            let assistantData = {worker_id: assistant._id, paypal_email: req.body.paypal_email};
            let assistantPreference = worker_payment_preferenceRepo.save(assistantData);
            req.flash('success', 'Assistant Created Successfully');
            res.redirect(namedRouter.urlFor('admin.assistants'));
        } catch(e) {
            throw ({ message: e.message });
        }
    }

    async changeAssistantStatus(req, res) {
        try {
            let assistant = await userRepo.getById(req.params.id);
            if(!_.isEmpty(assistant)) {
                let status = (assistant.isActive == true)? false : true;
                let assistantUpdate = await userRepo.updateById({ isActive: status }, req.params.id);
                req.flash('success', 'Assistant Status Updated Successfully');
                res.redirect(namedRouter.urlFor('admin.assistants'));
                // return { status: 200, data: managerUpdate, message: 'Status changed Successfully' };
            } else {
                throw ({ message: 'Invalid Assistant selected' });
            }
        } catch(e) {
            throw({ message: e.message });
        }
    }

    async editAssistant(req,res) {
        try {
            req.body.role = 'manager';
            let managers = await userRepo.getAllUsersByRole(req);
            let assistant = await userRepo.getById(req.params.id);
            assistant = assistant.toObject();
            let assistantWorkerPayment = await worker_payment_preferenceRepo.getByField({worker_id:mongoose.Types.ObjectId(assistant._id)});
            
            assistant['payment_percentage'] = assistantWorkerPayment;
            
            if (!_.isEmpty(assistant)) {
                res.render('user/views/edit-assistant.ejs', {
                    page_name: 'users-mgmt',
                    page_title: 'View Assistant',
                    user: req.user,
                    response: assistant,
                    managers,
                });
            }
        } catch(e) {
            throw({message: e.message});
        }
    }

    // async updateManager(req, res) {
    //     try {
    //         return { status: 200, data: [], message: 'Data updatedSuccessfully' };
    //     } catch(e) {
    //         throw({message: e.message});
    //     }
    // }

    async deleteAssistant(req, res) {
        try {
            let assistant = await userRepo.updateById({isDeleted: true}, req.params.id);
            req.flash('success', 'Assistant Deleted Successfully');
            res.redirect(namedRouter.urlFor('admin.assistants'));
        } catch(e) {
            throw({message: e.message});
        }
    }
    // Booster Module Ends

    /* @Method: viewmyprofile
    // @Description: To get Profile Info from db
    */
    async viewmyprofile(req, res) {
        try {
            const id = req.params.id;
            let user = await userRepo.getById(id)
            if (!_.isEmpty(user)) {
                res.render('user/views/myprofile.ejs', {
                    page_name: 'user-profile',
                    page_title: 'My Profile',
                    user: req.user,
                    response: user
                });

            }
        } catch (e) {
            throw(e.message);
            return res.status(500).send({ message: e.message });
        }
    }

    /* @Method: updateprofile
    // @Description: Update My Profile 
    */
    async updateprofile(req, res) {
        try {
            const id = req.body.id;
            let userUpdate = await userRepo.updateById(req.body, id)
            if (!_.isEmpty(userUpdate)) {
                req.flash('success', "Profile updated successfully.");
                res.redirect(namedRouter.urlFor('admin.profile', { id: id }));
            }
        } catch (e) {
            return res.status(500).send({ message: e.message });
        }
    };

    /*
    // @Method: status_change
    // @Description: User status change action
    */
    async statusChange(req, res) {

        try {
            let user = await userRepo.getById(req.body.id)
            if (!_.isEmpty(user)) {
                let userStatus = (user.isActive == true) ? false : true;
                let userUpdate = userRepo.updateById({ 'isActive': userStatus }, req.body.id);
                req.flash('success', "User status has changed successfully.");
                res.send(userUpdate);
            } else {
                req.flash('error', "sorry user not found");
                res.redirect(namedRouter.urlFor('user.list'));
            }
        } catch (e) {
            return res.status(500).send({ message: e.message });
        }
    };

    /* @Method: changepassword
    // @Description: user changepassword Render
    */
    async changePassword(req, res) {
        var vehicleOwner = await userRepo.getById(req.user._id);
        if (vehicleOwner) {
            res.render('user/views/change_password.ejs', {
                page_name: 'user-changepassword',
                page_title: 'Change Password',
                response: vehicleOwner,
                user: req.user
            });
        } else {
            req.flash('error', "sorry vehicle owner not found.");
            res.redirect(namedRouter.urlFor('user.dashboard'));
        }

    };

    /*
    // @Method: updatepassword
    // @Description: User password change
    */

    async adminUpdatePassword(req, res) {
        try {
            let user = await userRepo.getById(req.user._id);
            if (!_.isEmpty(user)) {
                // check if password matches

                if (!user.validPassword(req.body.old_password, user.password)) {
                    req.flash('error', "Sorry old password mismatch!");
                    res.redirect(namedRouter.urlFor('admin.changepassword'));
                } else {
                    // if user is found and password is right, check if he is an admin

                    let new_password = req.user.generateHash(req.body.password);
                    let userUpdate = await userRepo.updateById({ "password": new_password }, req.body.id)
                    if (!_.isEmpty(user)) {
                        req.flash('success', "Your password has been changed successfully.");
                        res.redirect(namedRouter.urlFor('admin.user.dashboard'));
                    }
                }
            } else {
                req.flash('error', "Authentication failed. Wrong credentials.");
                res.redirect(namedRouter.urlFor('admin.changepassword'));
            }
        } catch (e) {
            return res.status(500).send({ message: e.message });
        }
    };

    /*
    // @Method: forgotPassword
    // @Description: User forgotPassword
    */

    async forgotPassword(req, res) {
        try {
            let result = await userRepo.forgotPassword(req.body)
            if (!_.isEmpty(result)) {
                let locals = { password: result };
                let isMailSend = await mailer.sendMail('Admin<smith.williams0910@gmail.com>', req.body.email_p_c, 'Node latest structure New Password', 'forgot-password', locals);
                if (isMailSend) {
                    req.flash('success', "Chechk Email For New Password");
                    res.redirect(namedRouter.urlFor('user.login'));
                } else {
                    req.flash('error', "Sorry unable to send mail");
                    res.redirect(namedRouter.urlFor('user.login'));
                }
            } else {
                req.flash('error', "Sorry user not found");
                res.redirect(namedRouter.urlFor('user.login'));
            }

        } catch (e) {
            req.flash('error', e.message);
            res.redirect(namedRouter.urlFor('user.login'));
        }
    };
    async getAllUserCount(req, res){
        try {
            let userCount = await userRepo.getUsersCount(req);
            return userCount;
        } catch (e) {
            return res.status(500).send({ message: e.message });
        }
    }

    async stripePaymentHistory(req, res){
        try {
            const stripe = require("stripe")("sk_test_wp24J6RcHdkR9LEgHawYhDQv");

            stripe.charges.list(
            // { limit: 3 },
            function(err, charges) {
                console.log(charges)
                return charges;
            }
            );
            
        } catch (e) {
            return res.status(500).send({ message: e.message });
        }
    }

}

module.exports = new UserController();