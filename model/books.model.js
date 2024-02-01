const mongoose = require("mongoose")

const bookSchema = mongoose.Schema({
    title: {type: String, required: true},
    author: {type: String, required: true},
    createdAt: { type: Date, default: Date.now },
    userId: {type:String, required: true},

}, 
{
    versionKey: false
})



const BookModel = mongoose.model("book", bookSchema)


module.exports = {BookModel}