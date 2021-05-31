const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/products');
const Vendor = require('../models/vendor');

router.get('/', (req, res, next)=> {
    Product.find()
    .select('name price _id vendorname')
    .exec()
    .then(docs=> {
        const response = {
            count: docs.length,
            products: docs
        };
        res.status(200).json(response);
    })
    .catch(err=> {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.post('/', (req, res, next)=> {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        vendor: {
            id: req.body.vendor.vendorId,
            vendorname: req.body.vendor.vendorname
        }
    });
    product
    .save()
    .then(result=> {
        console.log(result);
        res.status(201).json({
            message: 'post to /products',
            createdProduct: product
        });
    })
    .catch(err=> {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.get('/:vendorId', (req, res, next)=>{
    Vendor.findById(req.params.vendorId)
    const id = req.params.productId;
    Product.find({"vendor.id": req.params.vendorId})
    .populate('product')
    .exec()
    .then(doc=> {
        console.log(doc);
        if (doc){
            res.status(200).json(doc);
        } else{
            res.status(404).json({
                message: 'No valid entry'
            });
        }
    })
    .catch(err=> {
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.patch('/:productId', (req, res, next)=>{
    const id = req.params.productId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id: id}, {$set: updateOps})
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

router.delete('/:productId', (req, res, next)=>{
    const id = req.params.productId;
    Product.remove({_id: id})
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

module.exports = router;