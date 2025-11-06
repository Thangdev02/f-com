import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "db.json");

export default function handler(req, res) {
  const db = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  if (req.method === "GET") {
    const { postId } = req.query;
    const comments = postId ? db.comments.filter(c => String(c.postId) === String(postId)) : db.comments;
    res.status(200).json(comments || []);
  } else if (req.method === "POST") {
    const newComment = { id: Date.now(), ...req.body };
    db.comments.push(newComment);
    fs.writeFileSync(filePath, JSON.stringify(db, null, 2));
    res.status(201).json(newComment);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
