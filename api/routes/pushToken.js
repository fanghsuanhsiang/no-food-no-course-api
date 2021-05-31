const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// const checkAuth = require('../middleware/check-auth');
const {Expo} = require('expo-server-sdk');

const PushToken = require('../models/pushToken');
const Vendor = require('../models/vendor');

router.post('/', (req, res, next)=>{
    PushToken.find({"vendor.vendorId": req.body.vendorId})
    .exec()
    .then(pushToken=> {
        if(pushToken.length >= 1){
            return res.status(409).json({
                message: 'pushToken exists'
            });
        } else{
            const pushToken = new PushToken({
                pushToken: req.body.pushToken,
                vendor: {
                    id: req.body.vendor.vendorId,
                    vendorname: req.body.vendor.vendorname
                }
            });
            pushToken.save()
            .then(result=> {
                console.log(result);
                res.status(201).json({
                    message: 'post to /pushToken'
                });
            })
            .catch(err=> {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            })
        }
    })
});

router.get('/:vendorId', (req, res, next)=>{
    Vendor.findById(req.params.vendorId)
    PushToken.find({"vendor.id": req.params.vendorId})
    .populate('pushToken')
    .exec()
    .then(pushToken=> {
        if(!pushToken){
            return res.status(404).json({
                message: "Token not found"
            });
        }
        res.status(200).json({
            pushToken: pushToken
        });
        let messages = [];

        // Construct a message (see https://docs.expo.io/versions/latest/guides/push-notifications.html)
        messages.push({
            to: pushToken,
            sound: 'default',
            body: '您有新訂單',
            data: { withSome: 'data' },
        })
    })
    .catch(err=> {
        res.status(500).json({
            error: err
        });
    })
});

module.exports = router;