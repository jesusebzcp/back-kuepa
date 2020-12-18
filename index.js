const express = require("express");
const connectDb = require("./src/config/db");
const cors = require("cors");
const http = require("http");
const socket = require("socket.io");

//Create server
const app = express();

//Connect mongodb(Database)
connectDb();

app.use(express.json({ extended: true }));

const server = http.Server(app);

//Port
const port = process.env.port || 3001;

const io = socket(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("connection client", (id) => {
    console.log("id user =>", id);
  });

  socket.on("send message", (name, message) => {
    console.log(name, message);
    socket.emit("messages", { name, message });
  });
  socket.on("disconnect", () => {
    io.emit("messages", { server: "server", message: "Finalizo chat" });
  });
});

app.use(cors());

//Import routes
app.use("/api/users", require("./src/routes/users"));
app.use("/api/auth", require("./src/routes/auth"));

//Run server
server.listen(port, "0.0.0.0", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
  console.log(`On server listener port=${port} `);
});
