const db = require("../db/connection");
const { v4: uuidv4 } = require("uuid");

exports.createPhishing = (req, res) => {
  const { 
    url, 
    registrar_reported,
    registrar_resolved,  
    safebrowsing_reported,  
    safebrowsing_resolved, 
    takedown_reported,  
    takedown_resolved,  
    ddos_reported,  
    ddos_resolved,  
    komdigi_reported,  
    komdigi_resolved 
  } = req.body;

  const uid = uuidv4();

  if (!url) {
    return res.status(400).json({ message: "Please insert url" });
  }

  const sql = `
    INSERT INTO phishing_reports (
      id, url, 
      registrar_reported, registrar_resolved, 
      safebrowsing_reported, safebrowsing_resolved, 
      takedown_reported, takedown_resolved, 
      ddos_reported, ddos_resolved, 
      komdigi_reported, komdigi_resolved
    ) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql, [
      uid,
      url,
      registrar_reported,
      registrar_resolved,  
      safebrowsing_reported,  
      safebrowsing_resolved, 
      takedown_reported,  
      takedown_resolved,  
      ddos_reported,  
      ddos_resolved,  
      komdigi_reported,  
      komdigi_resolved
    ], 
    (err, result) => {
      if (err) {
        console.error("Database insert error:", err);
        return res.status(500).json({ message: "Server error", error: err });
      }
      res.status(201).json({ message: "Phishing URL entry created", id: uid });
    }
  );
};

exports.getAllPhishing = (req, res) => {
  const page = parseInt(req.query.page) || 1; // Get current page, default to 1
  const limit = 10;                           // Items per page
  const offset = (page - 1) * limit;          // Calculate offset

  const sql = "SELECT * FROM phishing_reports ORDER BY created_at DESC LIMIT ? OFFSET ?";
  db.query(sql, [limit, offset], (err, results) => {
    if (err) {
      console.error("Error fetching phishing entries:", err);
      return res.status(500).json({ message: "Server error" });
    }

    // Optionally, get total count for frontend to calculate total pages
    db.query("SELECT COUNT(*) AS count FROM phishing_reports", (err, countResult) => {
      if (err) return res.status(500).json({ message: "Count error" });

      const totalItems = countResult[0].count;
      const totalPages = Math.ceil(totalItems / limit);

      res.status(200).json({
        data: results,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems,
        },
      });
    });
  });
};

exports.getPhishingById = (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM phishing_reports WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error fetching phishing entry:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Entry not found" });
    }

    res.status(200).json(results[0]);
  });
};

exports.searchPhishing = (req, res) => {
  const keyword = req.query.keyword?.trim() || "";
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  const searchQuery = `%${keyword}%`;

  const sql = `
    SELECT * FROM phishing_reports
    WHERE url LIKE ?
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `;

  db.query(sql, [searchQuery, limit, offset], (err, results) => {
    if (err) {
      console.error("Error in search query:", err);
      return res.status(500).json({ message: "Search error", error: err });
    }

    const countSql = `
      SELECT COUNT(*) AS total FROM phishing_reports
      WHERE url LIKE ?
    `;

    db.query(countSql, [searchQuery], (err, countResults) => {
      if (err) {
        console.error("Error in count query:", err);
        return res.status(500).json({ message: "Count error", error: err });
      }

      const totalItems = countResults[0].total;
      const totalPages = Math.ceil(totalItems / limit);

      res.status(200).json({
        data: results,
        pagination: {
          totalItems,
          totalPages,
          currentPage: page,
        },
      });
    });
  });
};

exports.updatePhishing = (req, res) => {
  const { id } = req.params;
  const { 
    url, 
    registrar_reported,
    registrar_resolved,  
    safebrowsing_reported,  
    safebrowsing_resolved, 
    takedown_reported,  
    takedown_resolved,  
    ddos_reported,  
    ddos_resolved,  
    komdigi_reported,  
    komdigi_resolved 
  } = req.body;
  
  // Proper field validation using OR (||)
  if (!url || !registrar_reported || !registrar_resolved || !safebrowsing_reported || !safebrowsing_resolved ||
      !takedown_reported || !takedown_resolved || !ddos_reported || !ddos_resolved ||
      !komdigi_reported || !komdigi_resolved) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const sql = `
    UPDATE phishing_reports 
    SET 
      url = ?,
      registrar_reported = ?, 
      registrar_resolved = ?, 
      safebrowsing_reported = ?, 
      safebrowsing_resolved = ?, 
      takedown_reported = ?, 
      takedown_resolved = ?, 
      ddos_reported = ?,
      ddos_resolved = ?,
      komdigi_reported = ?,
      komdigi_resolved = ?
    WHERE id = ?
  `;

  db.query(sql, [
    url,
    registrar_reported,
    registrar_resolved,  
    safebrowsing_reported,  
    safebrowsing_resolved, 
    takedown_reported,  
    takedown_resolved,  
    ddos_reported,  
    ddos_resolved,  
    komdigi_reported,  
    komdigi_resolved,
    id
  ], (err, _) => {
    if (err) return res.status(500).json({ message: "Server error", error: err });
    res.status(200).json({ message: "Phishing entry updated successfully" });
  });
};

exports.deletePhishing = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM phishing_reports WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting entry:", err);
      return res.status(500).json({ message: "Server error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Phishing entry not found" });
    }
    res.status(200).json({ message: "Phishing entry deleted" });
  });
};