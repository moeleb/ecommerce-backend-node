const express = require("express");
const dbConnect = require("./config/dbConnect");
const dotenv = require("dotenv").config();
const authRouter = require("./routes/authRoute");
const bodyParser = require("body-parser");
const asyncHandler = require("express-async-handler")
const morgan = require("morgan")
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");
const productRouter = require("./routes/productRoute")
const blogRouter = require("./routes/blogRoute")
const categoryRouter = require("./routes/categoryRoute")
const blogcategoryRouter = require("./routes/blogCategoryRoute")
const brandRouter = require("./routes/brandRouter")
const couponRouter = require("./routes/couponRoute")
const app = express();

// Middleware to parspe request bodies
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/user', authRouter);
app.use('/api/product', productRouter);
app.use('/api/blog', blogRouter);
app.use('/api/category', categoryRouter);
app.use('/api/blogCategory', blogcategoryRouter);
app.use('/api/brand', brandRouter);
app.use('/api/coupon', couponRouter);


const PORT = process.env.PORT || 4000;

app.use(notFound)
app.use(errorHandler)
// Connect to the database
dbConnect();

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});
