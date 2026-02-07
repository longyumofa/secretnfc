import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    const accessLogs = {};
    
    const uploadDir = path.join(process.cwd(), 'upload');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }

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
        limits: { fileSize: 10 * 1024 * 1024 }
    });

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        {
          name: 'express-api',
          configureServer(server) {
            const app = express();
            
            app.use(cors());
            app.use(express.json());
            app.use('/upload', express.static(uploadDir));

            app.post('/api/verify', (req, res) => {
                const { uid, token } = req.body;
                if (accessLogs[uid] === token) {
                    return res.status(409).json({ error: 'TOKEN_EXPIRED' });
                }
                accessLogs[uid] = token;
                res.json({ status: 'success' });
            });

            app.post('/api/upload', upload.single('file'), (req, res) => {
                if (!req.file) {
                    return res.status(400).json({ error: 'No file uploaded' });
                }
                
                const fileUrl = `http://localhost:3000/upload/${req.file.filename}`;
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

            server.middlewares.use(app);
          }
        }
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
