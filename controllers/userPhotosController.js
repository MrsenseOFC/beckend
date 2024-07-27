import pool from '../connect.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../uploads/profile_pictures'),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

export const uploadProfilePicture = (req, res) => {
  upload.single('profilePicture')(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const userId = req.body.user_id;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    const filePath = `/uploads/profile_pictures/${req.file.filename}`;

    try {
      // Check if user_id exists in users table
      const [userResult] = await pool.query('SELECT id FROM users WHERE id = ?', [userId]);
      if (userResult.length === 0) {
        return res.status(400).json({ message: 'User ID does not exist' });
      }

      // Update profile picture in users table
      const updateQuery = 'UPDATE users SET profile_picture_url = ? WHERE id = ?';
      await pool.query(updateQuery, [filePath, userId]);

      // Insert record in user_photos table
      const insertQuery = 'INSERT INTO user_photos (user_id, file_path) VALUES (?, ?)';
      await pool.query(insertQuery, [userId, filePath]);

      res.status(200).json({ message: 'Upload successful!', filePath });
    } catch (error) {
      return res.status(500).json({ message: 'Error saving file path to database.', error: error.message });
    }
  });
};

export const getProfilePicture = async (req, res) => {
  const { userId } = req.params;

  try {
    const query = 'SELECT profile_picture_url FROM users WHERE id = ?';
    const [results] = await pool.query(query, [userId]);

    if (results.length === 0 || !results[0].profile_picture_url) {
      return res.status(404).json({ message: 'Image not found.' });
    }

    const filePath = results[0].profile_picture_url;
    res.json({ filePath });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching profile picture from database.', error: error.message });
  }
};
