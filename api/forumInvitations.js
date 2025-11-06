import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "db.json");

export default function handler(req, res) {
  const db = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  if (req.method === "GET") {
    const { studentEmail } = req.query;
    let invitations = db.forumInvitations || [];
    if (studentEmail) invitations = invitations.filter(i => i.studentEmail === studentEmail);
    res.status(200).json(invitations);
  } else if (req.method === "POST") {
    const newInvitation = { id: Date.now(), status: "pending", createdAt: new Date().toISOString(), ...req.body };
    db.forumInvitations.push(newInvitation);
    fs.writeFileSync(filePath, JSON.stringify(db, null, 2));
    res.status(201).json(newInvitation);
  } else if (req.method === "PATCH") {
    const { id, updates } = req.body;
    const idx = db.forumInvitations.findIndex(i => String(i.id) === String(id));
    if (idx !== -1) {
      db.forumInvitations[idx] = { ...db.forumInvitations[idx], ...updates };
      fs.writeFileSync(filePath, JSON.stringify(db, null, 2));
      res.status(200).json(db.forumInvitations[idx]);
    } else {
      res.status(404).json({ message: "Invitation not found" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
