// node js version 20.7.0
const express = require("express");
const app = express();
const cors = require("cors");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const geoip = require("geoip-lite");
const { getCountries } = require("node-countries");

const allowedDomains = [
  "http://localhost:3000",
  "http://localhost:2008",
  "http://88.222.245.41:2008",
  "http://localhost:2004",

  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",
  "http://localhost:3004",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "https://www.lalonshopbd.com/",
  "https://www.lalonshopbd.com",
  "https://lalonshopbd.com",
  "https://www.admin.lalonshopbd.com",
  "https://admin.lalonshopbd.com",
  process.env.WEB_URL,
  process.env.ADMIN_WEB_URL,
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedDomains.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

// Middlewares
app.use(cors(corsOptions));
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./temp/",
  })
);

app.use("/", (req, res, next) => {
  const ip =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);
  const geo = geoip.lookup(ip)?.country || "BD";
  const country = getCountries().find((c) => {
    if (c?.alpha2?.toLowerCase() === geo?.toLowerCase()) return c;
    else if (c?.alpha3?.toLowerCase() === geo?.toLowerCase()) return c;
    else if (c?.name?.toLowerCase() === geo?.toLowerCase()) return c;
  });
  const countryName = country?.name?.toLowerCase();
  req.country = countryName;
  next();
});

// Routes
app.use("/api/v1", require("./router/v1_route/v1_route"));
app.get("/ip", async (req, res) => {
  try {
    const country = await req.country;
    res.json({ country });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});
app.post("/webhook", async (req, res) => {
  console.log("webhook receive====>>>", req.body);
  res.status(200).send("Webhook received");
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = { app };
