
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Ensure upload directory exists
const uploadDir = path.join(__dirname, 'upload');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

app.use(cors());
app.use(bodyParser.json());

// Configure static serving for the upload directory
app.use('/upload', express.static(uploadDir));

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB Limit
});

// --- RFID VERIFICATION MOCK ---
const accessLogs = {};
app.post('/api/verify', (req, res) => {
    const { uid, token } = req.body;
    if (accessLogs[uid] === token) {
        return res.status(409).json({ error: 'TOKEN_EXPIRED' });
    }
    accessLogs[uid] = token;
    res.json({ status: 'success' });
});

// --- FILE UPLOAD ENDPOINT ---
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const fileUrl = `http://localhost:${port}/upload/${req.file.filename}`;
    console.log(`[FILE UPLOAD] Saved: ${req.file.filename} | URL: ${fileUrl}`);
    
    res.json({
        success: true,
        message: 'File uploaded successfully',
        data: {
            filename: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size,
            url: fileUrl
        }
    });
});

app.listen(port, () => {
    console.log('---------------------------------------------------');
    console.log(`HKBR Security Server running at http://localhost:${port}`);
    console.log(`- Upload directory: ${uploadDir}`);
    console.log(`- Static file path: http://localhost:${port}/upload/`);
    console.log('---------------------------------------------------');
});
