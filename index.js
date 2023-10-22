const express = require("express");
const mongoose = require("mongoose");

const verifyToken = require("./middleware/auth");

const loginRouter = require("./routers/LoginRouter");
const categoryRouter = require("./routers/CategoryRouter");
const productRouter = require("./routers/ProductRouter");
const companyRouter = require("./routers/CompanyRouter");
const userRouter = require("./routers/UserRouter");
const wishlistRouter = require("./routers/WishListRouter");
const cartRouter = require("./routers/CartRouter");
const checkoutRouter = require("./routers/CheckoutRouter");
const orderRouter = require("./routers/OrderRouter");
const {graphqlHTTP} = require("express-graphql");
const schema = require("./graphql/schema/schema");

require("dotenv").config({path: "./.env"});

const app = express();

mongoose.connect(process.env.DATABASE_URL);
mongoose.connection.on("open", () => console.log("connected"));

app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.get("/", (_req, res) => res.send("Imran Seth"));
app.use("/graphql", graphqlHTTP({schema, graphiql: true}));
app.use("/products", express.static("public/uploads/images/products"));
app.use("/categories", express.static("public/uploads/images/categories"));
app.use("/company", express.static("public/uploads/images/company"));
app.use("/invoice", express.static("views"));
app.use(express.json());
app.use("/login", loginRouter);
app.use(verifyToken);
app.use("/categories", categoryRouter);
app.use("/company", companyRouter);
app.use("/products", productRouter);
app.use("/user", userRouter);
app.use("/wishlist", wishlistRouter);
app.use("/cart", cartRouter);
app.use("/checkout", checkoutRouter);
app.use("/orders", orderRouter);

app.listen(process.env.PORT, () => console.log("listening"));
