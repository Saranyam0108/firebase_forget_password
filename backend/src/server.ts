import express from "express";
import authRouter from "./routes/auth.route";

const app = express();

app.use(express.json());

// Routes
app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Backend Running Successfully");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});