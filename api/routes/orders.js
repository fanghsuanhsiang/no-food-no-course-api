const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// const checkAuth = require('../middleware/check-auth');
const {Expo} = require('expo-server-sdk');

const Order = require('../models/orders');
const Product = require('../models/products');
const User = require('../models/user');
const Vendor = require('../models/vendor');

router.get('/', (req, res, next)=> {
    Order.find()
    .select('status hour minute list _id user vendor')
    .populate('product')
    .exec()
    .then(docs=> {
        res.status(200).json({
            count: docs.length,
            order: docs.map(doc=> {
                return{
                    _id: doc._id,
                    status: doc.status,
                    hour: doc.quantity,
                    minute: doc.minute,
                    list: doc.list,
                    user: doc.user,
                    vendor: doc.vendor,
                    request:{
                        type: "GET",
                        url: "http://localhost:3000/orders/"+ doc._id
                    }
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

router.post('/', (req, res, next)=> {
    User.findById(req.body.userId)
    .then(orders=>{
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            vendor: {
                id: req.body.vendor.vendorId,
                vendorname: req.body.vendor.vendorname
            },
            user: {
                id: req.body.user.userId,
                username: req.body.user.username
            },
            hour: req.body.hour,
            minute: req.body.minute,
            remark: req.body.remark,
            status: req.body.status,
            list: req.body.list,
            total: req.body.total,
            number: req.body.number
        });

        return order
        .save()
        .then(result=> {
            console.log(result);
            res.status(201).json({
                message: 'Order stored',
                createdOrder:{
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity,
                    hour: result.hour,
                    minute: result.minute,
                    remark: result.remark,
                    status: result.status
                },
                request:{
                    type: "GET",
                    url: "http://localhost:3000/orders/"+ result._id
                }
            });
        })
        .catch(err=> {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    })
    .catch(err=> {
        res.status(500).json({
            message: 'Product not found'
        });
    });
});

router.get('/:orderId', (req, res, next)=>{
    Order.findById(req.params.orderId)
    .exec()
    .then(order=> {
        if(!order){
            return res.status(404).json({
                message: "Order not found"
            });
        }
        res.status(200).json({
            order: order,
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

router.get('/user/:userId', (req, res, next)=>{
    User.findById(req.params.userId)
    // const userId = req.params.userId;
    Order.find({"user.id": req.params.userId})
    .populate('order')
    .exec()
    .then(order=> {
        if(!order){
            return res.status(404).json({
                message: "User not found"
            });
        }
        res.status(200).json({
            order: order,
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

router.get('/vendor/:vendorId', (req, res, next)=>{
    Vendor.findById(req.params.vendorId)
    // const userId = req.params.userId;
    Order.find({"vendor.id": req.params.vendorId})
    .populate('order')
    .exec()
    .then(order=> {
        if(!order){
            return res.status(404).json({
                message: "User not found"
            });
        }
        res.status(200).json({
            order: order,
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

router.patch('/:orderId', (req, res, next)=>{
    const id = req.params.orderId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value; 
    }
    Order.update({_id: id}, {$set: updateOps})
    .exec()
    .then(result=> {
        res.status(200).json(result);
    })
    .catch(err=> {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/:orderId', (req, res, next)=>{
    res.status(200).json({
        message: 'order deleted',
        orderId: req.params.orderId
    });
});

module.exports = router;