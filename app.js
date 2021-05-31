const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRoutes = require('./api/routes/user');
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const vendorRoutes = require('./api/routes/vendor');
const pushTokenRoutes = require('./api/routes/pushToken');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// mongoose.connect('mongodb+srv://users:'+process.env.MONGO_ATLAS_PW+'@cluster0-o5sqb.mongodb.net/user?retryWrites=true',
// {useNewUrlParser: true});
// mongoose.set('useCreateIndex', true);

mongoose.connect('mongodb+srv://users:1234@cluster0-o5sqb.mongodb.net/user?retryWrites=true',
{useNewUrlParser: true});
mongoose.set('useCreateIndex', true);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
  });

app.use('/user', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/vendor', vendorRoutes);
app.use('/pushToken', pushTokenRoutes);

app.use((req, res, next) =>{
    const error = new Error('Not found');
    error.status= 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;