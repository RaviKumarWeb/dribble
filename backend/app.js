import express from "express";
import dotenv from "dotenv";
import { connect } from "mongoose";
import upload from "express-fileupload";
import cors from "cors";
import user from "./routes/userRoute.js";
import { fileURLToPath } from "url";
import path from "path";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
app.use(cors());
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(upload());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(
  cors({
    origin: "https://dribble-delta.vercel.app/",
  })
);

app.use("/api/user/", user);

connect(process.env.MONGODB_URL)
  .then(
    app.listen(process.env.PORT || 5000, () => {
      console.log(
        `Server Started on Port ${process.env.PORT} And Data base is Active`
      );
    })
  )
  .catch((error) => console.log(error));
