import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "db.json");

export default function handler(req, res) {
  const db = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  if (req.method === "GET") {
    res.status(200).json(db.forums || []);
  } else if (req.method === "POST") {
    const newForum = { id: Date.now(), members: [], ...req.body };
    db.forums.push(newForum);
    fs.writeFileSync(filePath, JSON.stringify(db, null, 2));
    res.status(201).json(newForum);
  } else if (req.method === "PATCH") {
    const { id, updates } = req.body;
    const idx = db.forums.findIndex(f => String(f.id) === String(id));
    if (idx !== -1) {
      db.forums[idx] = { ...db.forums[idx], ...updates };
      fs.writeFileSync(filePath, JSON.stringify(db, null, 2));
      res.status(200).json(db.forums[idx]);
    } else {
      res.status(404).json({ message: "Forum not found" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
