const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const multer = require('multer');
// const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Product = require('../models/products');
const Order = require('../models/orders');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb){
        cb(null,  file.originalname);
    }
});
const fileFilter = (req, file ,cb)=> {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    } else{
        cb(null, false);
    }
};
const upload = multer({
    storage: storage,
    limits:{
    fileSize: 1024*1024*5
    },
    fileFilter: fileFilter
});

router.get('/:userId', (req, res, next)=>{
    User.find(req.params.userId)
    .exec()
    .then(user=> {
        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        }
        res.status(200).json({
            user: user,
            request: {
                type: "GET",
                url: "http://localhost:3000/orders/"
            }
        });
    })
    .catch(err=> {
        res.status(500).json({
            error: err
        });
    })
});

router.post('/signup', upload.single('userImage'), (req, res, next)=>{
    User.find({email: req.body.email})
    .exec()
    .then(user=> {
        if(user.length >= 1){
            return res.status(409).json({
                message: 'Mail exists'
            });
        } else{
            bcrypt.hash(req.body.password, 10, (err,hash)=>{
                if(err){
                    return res.status(500).json({
                        error: err
                    });
                } else{
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash,
                        username: req.body.username,
                        phone: req.body.phone,
                        easycard_number: req.body.easycard_number,
                        balance: req.body.balance,
                        userImage: req.file.path,
                        studentId: req.body.studentId
                    });
                    user
                    .save()
                    .then(result=> {
                        console.log(result);
                        res.status(201).json({
                            message: 'User created'
                        });
                    })
                    .catch(err=> {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
                }
            });
        }
    });
});

router.post('/login', (req, res, next)=>{
    User.find({email: req.body.email})
    .exec()
    .then(user=> {
        if(user.length < 1){
            return res.status(401).json({
                message: 'Auth failed'
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err,result)=>{
            if(err){
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            if(result){
                // const token = jwt.sign({
                //     email: user[0].email,
                //     userId: user[0]._id
                // }, 
                // process.env.JWT_KEY, 
                // {
                //     expiresIn: '1h'
                // }
                // );
                return res.status(200).json({
                    message: 'Auth successful',
                    // token: token
                    user: user[0]
                });
            }
            res.status(401).json({
                message: 'Auth failed'
            });
        });
    })
    .catch(err=> {
        console.log(err);
        res.status(500).json({
            error: err
        });
    })
});

router.patch('/:userId', (req, res, next)=>{
    const id = req.params.userId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    User.update({_id: id}, {$set: updateOps})
    .exec()
    .then(result=> {
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err=> {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/:userId', (req, res, next)=>{
    User.remove({_id: req.params.userId})
    .exec()
    .then(result=> {
        res.status(200).json({
            message: 'User deleted'
        });
    })
    .catch(err=> {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;