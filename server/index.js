const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const app = express();
const authRouter = require("./routers/auth");
const userRouter = require("./routers/user");
const categoryRouter = require("./routers/category");
const roleRouter = require("./routers/role");
const postRouter = require("./routers/post");
const productRouter = require("./routers/product");
const helperRouter = require("./routers/helper");
const cookingRecipeRouter = require("./routers/cookingRecipe");
const contactRouter = require("./routers/contact");
const chatRouter = require("./routers/chat");
const electricityWaterRouter = require("./routers/electricity-water");
const liveStreamRouter = require("./routers/live-stream");

const cors = require("cors");
const http = require("http");
const { getUserChatMessage } = require("./models/chat");
const server = http.createServer(app);

const socketIo = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
// nhớ thêm cái cors này để tránh bị Exception nhé :D  ở đây mình làm nhanh nên cho phép tất cả các trang đều cors được.
socketIo.on("connection", (socket) => {
  ///Handle khi có connect từ client tới
  console.log("New client connected" + socket.id);

  socket.on("sendDataClient", async function (data) {
    // Handle khi có sự kiện tên là sendDataClient từ phía client
    const chatData = await getUserChatMessage(data);
    chatData.sort(function (x, y) {
      return x.created_day - y.created_day;
    });
    socketIo.emit("sendDataServer", { data: chatData }); // phát sự kiện  có tên sendDataServer cùng với dữ liệu tin nhắn từ phía server
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected"); // Khi client disconnect thì log ra terminal.
  });
});

app.use(
  cookieSession({
    name: "session",
    keys: [process.env.COOKIE_KEY || "DOAN"],
    maxAge: 4 * 7 * 24 * 60 * 60 * 1000,
  })
);

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(cors());
require("dotenv").config();
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/role", roleRouter);
app.use("/api/post", postRouter);
app.use("/api/product", productRouter);
app.use("/api/helper", helperRouter);
app.use("/api/cooking-recipe", cookingRecipeRouter);
app.use("/api/contact", contactRouter);
app.use("/api/chat", chatRouter);
app.use("/api/electricity-water", electricityWaterRouter);
app.use("/api/livestream", liveStreamRouter);

let PORT = process.env.PORT || 5004;
server.listen(PORT, () => console.log(`App running on port: ${PORT}`));
