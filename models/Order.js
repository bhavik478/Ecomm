const mongoose = require('mongoose');


const orderSchema  = new mongoose.Schema({
    product : String,
    quantity : Number,
    user_id : {
        type :  mongoose.Schema.Types.ObjectId,
        // ref : "User"
    },
    product_id :{
        type : mongoose.Schema.Types.ObjectId
    }
})


const Order = mongoose.model("Order", orderSchema)


module.exports = Order