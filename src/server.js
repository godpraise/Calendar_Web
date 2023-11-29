import express, { response } from "express";
import morgan from "morgan";

const PORT = 4000;

const app = express();
const logger = morgan("dev");

const handleListening = () =>
  console.log(`✅ Server listenting on port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);
