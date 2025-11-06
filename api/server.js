import jsonServer from "json-server";

const server = jsonServer.create();
const router = jsonServer.router({
  posts: [],
  comments: [],
  users: [],
  forums: [],
  messages: [],
  schedules: [],
  appointments: [],
  forumRequests: [],
  forumInvitations: [],
}); // DB in-memory
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Mount router dưới /api
server.use("/api", router);

export default async function handler(req, res) {
  try {
    await new Promise((resolve) => server(req, res, resolve));
  } catch (error) {
    console.error("JSON Server crashed:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
