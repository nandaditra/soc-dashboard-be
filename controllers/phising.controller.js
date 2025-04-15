const db = require("../db/connection");


exports.createPhishing = (req, res) => {
  const { name, url, domain } = req.body;

  console.log(name, url, domain)

  if (!name || !url || !domain) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const sql = "INSERT INTO phishing_urls (name, url, domain) VALUES (?, ?, ?)";
  db.query(sql, [name, url, domain], (err, result) => {
    if (err) throw err;
    res.status(201).json({ message: "Phishing entry created", id: result.insertId });
  });
};

exports.getAllPhishing = (req, res) => {
  const sql = "SELECT * FROM phishing_urls ORDER BY created_at DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching phishing entries:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.status(200).json(results);
  });
};