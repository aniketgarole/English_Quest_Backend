const express = require("express")
const { BookModel } = require("../model/books.model")


const booksRouter = express.Router()

booksRouter.get("/", async(req,res)=> {
    
   try {
        // Extract filtering and sorting parameters from the query string
        const { filterBy, filterValue, sortBy, old, new: newer } = req.query;

        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

        // Define the base query
        let baseQuery = {};

        // Add filtering if titleFilter is provided
        if (filterBy === "title") {
            baseQuery.title = { $regex: new RegExp(filterValue, 'i') }; 
        }

        if (filterBy === "author") {
            baseQuery.author = { $regex: new RegExp(filterValue, 'i') };

        }

        if (old) {
            const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
            baseQuery.createdAt = { $lt: tenMinutesAgo };
        }

        if (newer) {
            const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
            baseQuery.createdAt = { $gte: tenMinutesAgo };
        }


        // Get books based on the query and apply sorting
        const books = await BookModel.find(baseQuery).sort(sortBy === 'oldest' ? '-createdAt' : 'createdAt');

        res.status(200).json({ "msg": "Books retrieved successfully", "books": books });
    } catch (error) {
        res.status(500).json({ "err": error.message });
    }
})


booksRouter.post("/create", async(req, res) => {
    try {
        const reqBody = req.body
        const bookToAdd = {}
        bookToAdd.title = reqBody.title
        bookToAdd.author = reqBody.author
        const role = req.body.role
        console.log("role", role)

        if (role === "CREATOR") {
            const book = new BookModel(bookToAdd)
            await book.save()
            res.status(200).json({"msg": "New book has been added to library"})
        } else {
            res.status(403).json({ message: 'You are not authorized to add book to library' });
        }
    } catch (error) {
        res.status(400).json({"error": error.message})
    }
})


booksRouter.delete("/delete/:id", async(req, res) => {
    try {
        const role = req.body.role
        const {id} = req.params
        if (role === "CREATOR") {
            await BookModel.findByIdAndDelete(id);
            res.status(200).json({ "msg": 'Book deleted successfully' });

        } else {
            res.status(401).json({"msg": "You are not authorized to delete this book."})
        }
    } catch (error) {
        res.status(400).json({"error": error.message})
    }
})





module.exports = {booksRouter}