import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "db.json");

export default function handler(req, res) {
  const db = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  if (req.method === "GET") {
    res.status(200).json(db.schedules || []);
  } else if (req.method === "POST") {
    const newSchedule = { id: Date.now(), ...req.body };
    db.schedules.push(newSchedule);
    fs.writeFileSync(filePath, JSON.stringify(db, null, 2));
    res.status(201).json(newSchedule);
  } else if (req.method === "DELETE") {
    const { id } = req.query;
    db.schedules = db.schedules.filter(s => String(s.id) !== String(id));
    fs.writeFileSync(filePath, JSON.stringify(db, null, 2));
    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
