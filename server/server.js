require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./dbConnection/db')


const app = express();

//All Admin routes 
const AdminRoute = require('./routes/Admin/adminRoute')
const AdminCategoryRoute = require('./routes/Admin/categoryRoute')
const AdminProductRoute = require('./routes/Admin/productRoute')

// all static folder access 
app.use('/cats', express.static('categories'));
app.use('/pros', express.static('products'));


app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Admin Route
app.use('/admin', AdminRoute)
app.use('/adminCategory', AdminCategoryRoute)
app.use('/adminProduct', AdminProductRoute)


const port = process.env.PORT;
app.listen(port, () => {
    console.log(`listening on ${port}`);
})