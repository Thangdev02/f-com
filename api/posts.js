import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  const filePath = path.join(process.cwd(), "db.json");
  const db = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  if (req.method === "GET") {
    res.status(200).json(db.posts || []);
  } else if (req.method === "POST") {
    const newPost = req.body;
    db.posts.push(newPost);
    fs.writeFileSync(filePath, JSON.stringify(db, null, 2));
    res.status(201).json(newPost);
  } else if (req.method === "PATCH") {
    const { id, updates } = req.body;
    const postIndex = db.posts.findIndex((p) => String(p.id) === String(id));
    if (postIndex !== -1) {
      db.posts[postIndex] = { ...db.posts[postIndex], ...updates };
      fs.writeFileSync(filePath, JSON.stringify(db, null, 2));
      res.status(200).json(db.posts[postIndex]);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
