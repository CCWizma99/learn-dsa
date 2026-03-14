const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = 5001;
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const MAX_STORAGE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(UPLOADS_DIR));

// Helper to get total size of the uploads directory
async function getUploadsSize() {
  try {
    const files = await fs.readdir(UPLOADS_DIR);
    let totalSize = 0;
    for (const file of files) {
      const stats = await fs.stat(path.join(UPLOADS_DIR, file));
      totalSize += stats.size;
    }
    return totalSize;
  } catch (err) {
    return 0;
  }
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB individual file limit
});

// API Routes
app.get('/api/papers', async (req, res) => {
  try {
    const files = await fs.readdir(UPLOADS_DIR);
    const papers = await Promise.all(files.map(async (file) => {
      const stats = await fs.stat(path.join(UPLOADS_DIR, file));
      return {
        name: file,
        size: stats.size,
        url: `http://localhost:${PORT}/uploads/${file}`,
        uploadedAt: stats.birthtime
      };
    }));
    const totalSize = papers.reduce((acc, curr) => acc + curr.size, 0);
    res.json({ papers, totalSize, maxSize: MAX_STORAGE_SIZE });
  } catch (err) {
    res.status(500).json({ error: 'Failed to list papers' });
  }
});

app.post('/api/upload', async (req, res) => {
  const currentSize = await getUploadsSize();
  
  if (currentSize >= MAX_STORAGE_SIZE) {
    return res.status(400).json({ error: 'cannot upload more, delete first' });
  }

  upload.single('paper')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    
    // Check size AGAIN after upload (to be safe with concurrent uploads)
    const newSize = await getUploadsSize();
    if (newSize > MAX_STORAGE_SIZE) {
      // Revert upload if limit exceeded
      await fs.remove(req.file.path);
      return res.status(400).json({ error: 'cannot upload more, delete first' });
    }

    res.json({ message: 'Upload successful', file: req.file });
  });
});

app.delete('/api/papers/:filename', async (req, res) => {
  try {
    const filePath = path.join(UPLOADS_DIR, req.params.filename);
    await fs.remove(filePath);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
