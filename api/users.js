import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "db.json");

export default function handler(req, res) {
  const db = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  if (req.method === "GET") {
    const { id } = req.query;
    if (id) {
      const user = db.users.find(u => String(u.id) === String(id));
      res.status(200).json(user || null);
    } else {
      res.status(200).json(db.users || []);
    }
  } else if (req.method === "POST") {
    const newUser = { id: Date.now(), role: "student", createdAt: new Date().toISOString(), ...req.body };
    db.users.push(newUser);
    fs.writeFileSync(filePath, JSON.stringify(db, null, 2));
    res.status(201).json(newUser);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
