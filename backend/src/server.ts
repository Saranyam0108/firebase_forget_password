import "dotenv/config"; 
import express from "express";
import authRouter from "./routes/auth.route";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Backend Running Successfully");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});