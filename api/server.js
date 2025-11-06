import jsonServer from "json-server";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "../db.json")); // db.json phải tồn tại
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Mount router dưới /api
server.use("/api", router);

// Export server cho Vercel
export default async function handler(req, res) {
  try {
    // Chỉ GET hoạt động bình thường trên Vercel
    if (req.method === "GET") {
      await new Promise((resolve) => server(req, res, resolve));
    } else {
      res.status(501).json({ error: "Write operations not supported on Vercel" });
    }
  } catch (error) {
    console.error("JSON Server crashed:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
