const express = require("express")
require("dotenv").config()
const cors = require('cors');
const {connection} = require("./connect")
const { auth } = require("./middlewares/auth.middleware");
const { userRouter } = require("./routes/users.routes");
const { booksRouter } = require("./routes/books.routes");



const app = express()
const PORT = process.env.PORT || 3000;


app.use(express.json())
app.use(cors())

app.use("/users", userRouter)

app.use(auth)

app.use("/books", booksRouter)



const startServer = async () => {
    try {
        await connection
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
          });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }

}

startServer()