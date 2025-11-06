import jsonServer from "json-server";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbFile = path.join(__dirname, "../db.json");

// 1️⃣ Load dữ liệu từ file
let dbData = {};
try {
  dbData = JSON.parse(fs.readFileSync(dbFile, "utf-8"));
} catch (err) {
  console.warn("Không đọc được db.json, dùng dữ liệu mặc định");
  dbData = {
    posts: [],
    comments: [],
    users: [],
    forums: [],
    messages: [],
    schedules: [],
    appointments: [],
    forumRequests: [],
    forumInvitations: [],
  };
}

const server = jsonServer.create();
const router = jsonServer.router(dbData); // in-memory
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Mount router dưới /api
server.use("/api", router);

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      // GET vẫn đọc từ in-memory
      await new Promise((resolve) => server(req, res, resolve));
    } else if (["POST", "PATCH", "DELETE"].includes(req.method)) {
      // POST/PATCH/DELETE chỉ cập nhật in-memory
      await new Promise((resolve) => server(req, res, resolve));
      // Không ghi file → Vercel không lỗi nữa
      console.log(`[${req.method}] ${req.url} => in-memory DB updated`);
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("JSON Server crashed:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
