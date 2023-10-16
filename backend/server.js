import path from "path";
import connectDB from "./config/db.js";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { errorHanler, notFound } from "./middleware/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/users", userRoutes);

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "frontend/dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
  );
} else {
  // dev
}

app.use([notFound, errorHanler]);

try {
  await connectDB();
  app.listen(port, () => {
    console.log(`server running on port: ${port}`);
  });
} catch (error) {
  console.error(`Error: ${error.message}`);
}
