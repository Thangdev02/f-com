import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "db.json");

export default function handler(req, res) {
  const db = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  if (req.method === "GET") {
    const { forumId } = req.query;
    let messages = db.messages || [];
    if (forumId) messages = messages.filter(m => String(m.forumId) === String(forumId));
    res.status(200).json(messages);
  } else if (req.method === "POST") {
    const newMessage = { id: Date.now(), ...req.body };
    db.messages.push(newMessage);
    fs.writeFileSync(filePath, JSON.stringify(db, null, 2));
    res.status(201).json(newMessage);
  } else if (req.method === "DELETE") {
    const { id } = req.query;
    db.messages = db.messages.filter(m => String(m.id) !== String(id));
    fs.writeFileSync(filePath, JSON.stringify(db, null, 2));
    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
