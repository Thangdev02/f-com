import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "db.json");

export default function handler(req, res) {
  const db = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  if (req.method === "GET") {
    const { forumId } = req.query;
    let appts = db.appointments || [];
    if (forumId) appts = appts.filter(a => String(a.forumId) === String(forumId));
    res.status(200).json(appts);
  } else if (req.method === "POST") {
    const newAppt = { id: Date.now(), participants: [], ...req.body };
    db.appointments.push(newAppt);
    fs.writeFileSync(filePath, JSON.stringify(db, null, 2));
    res.status(201).json(newAppt);
  } else if (req.method === "PATCH") {
    const { id, updates } = req.body;
    const idx = db.appointments.findIndex(a => String(a.id) === String(id));
    if (idx !== -1) {
      db.appointments[idx] = { ...db.appointments[idx], ...updates };
      fs.writeFileSync(filePath, JSON.stringify(db, null, 2));
      res.status(200).json(db.appointments[idx]);
    } else {
      res.status(404).json({ message: "Appointment not found" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
