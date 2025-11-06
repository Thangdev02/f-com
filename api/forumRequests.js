import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "db.json");

export default function handler(req, res) {
  const db = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  if (req.method === "GET") {
    const { forumId, userId } = req.query;
    let requests = db.forumRequests || [];
    if (forumId) requests = requests.filter(r => String(r.forumId) === String(forumId));
    if (userId) requests = requests.filter(r => String(r.userId) === String(userId));
    res.status(200).json(requests);
  } else if (req.method === "POST") {
    const newRequest = { id: Date.now(), status: "pending", createdAt: new Date().toISOString(), ...req.body };
    db.forumRequests.push(newRequest);
    fs.writeFileSync(filePath, JSON.stringify(db, null, 2));
    res.status(201).json(newRequest);
  } else if (req.method === "PATCH") {
    const { id, updates } = req.body;
    const idx = db.forumRequests.findIndex(r => String(r.id) === String(id));
    if (idx !== -1) {
      db.forumRequests[idx] = { ...db.forumRequests[idx], ...updates };
      fs.writeFileSync(filePath, JSON.stringify(db, null, 2));
      res.status(200).json(db.forumRequests[idx]);
    } else {
      res.status(404).json({ message: "Request not found" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
