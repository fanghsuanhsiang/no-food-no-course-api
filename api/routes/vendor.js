const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const multer = require('multer');
// const jwt = require('jsonwebtoken');

const Vendor = require('../models/vendor');
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

router.get('/', (req, res, next)=> {
    Vendor.find()
    .select('vendorname phone opening description _id')
    .exec()
    .then(docs=> {
        res.status(200).json({
            count: docs.length,
            vendor: docs.map(doc=> {
                return{
                    _id: doc._id,
                    vendorname: doc.vendorname,
                    phone: doc.phone,
                    opening: doc.opening,
                    description: doc.description
                }
            })
        });
    })
    .catch(err=> {
        res.status(500).json({
            error: err
        })
    });
});

router.get('/:vendorId', (req, res, next)=>{
    Vendor.findById(req.params.vendorId)
    .exec()
    .then(vendor=> {
        if(!vendor){
            return res.status(404).json({
                message: "Vendor not found"
            });
        }
        res.status(200).json({
            user: vendor,
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

router.post('/signup', upload.single('vendorImage'), (req, res, next)=>{
    Vendor.find({email: req.body.email})
    .exec()
    .then(vendor=> {
        if(vendor.length >= 1){
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
                    const vendor = new Vendor({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash,
                        vendorname: req.body.vendorname,
                        phone: req.body.phone,
                        opening: req.body.opening,
                        description: req.body.description,
                        // vendorImage: req.file.path
                    });
                    vendor
                    .save()
                    .then(result=> {
                        console.log(result);
                        res.status(201).json({
                            message: 'Vendor created'
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
    Vendor.find({email: req.body.email})
    .exec()
    .then(vendor=> {
        if(vendor.length < 1){
            return res.status(401).json({
                message: 'Auth failed'
            });
        }
        bcrypt.compare(req.body.password, vendor[0].password, (err,result)=>{
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
                    // token: token,
                    user: vendor
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

router.delete('/:vendorId', (req, res, next)=>{
    Vendor.remove({_id: req.params.vendorId})
    .exec()
    .then(result=> {
        res.status(200).json({
            message: 'Vendor deleted'
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