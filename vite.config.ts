import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';

// 持久化存储访问日志
const accessLogsPath = path.join(process.cwd(), 'accessLogs.json');

// 加载现有访问日志
let accessLogs: Record<string, string[]> = {};
try {
  if (fs.existsSync(accessLogsPath)) {
    const data = fs.readFileSync(accessLogsPath, 'utf8');
    const loadedData = JSON.parse(data);
    
    // 转换旧格式（字符串）到新格式（数组）
    for (const [uid, value] of Object.entries(loadedData)) {
      if (typeof value === 'string') {
        accessLogs[uid] = [value];
      } else if (Array.isArray(value)) {
        accessLogs[uid] = value;
      } else {
        accessLogs[uid] = [];
      }
    }
  }
} catch (e) {
  console.error('Failed to load access logs:', e);
  accessLogs = {};
}

// 保存访问日志
function saveAccessLogs() {
  try {
    fs.writeFileSync(accessLogsPath, JSON.stringify(accessLogs, null, 2));
  } catch (e) {
    console.error('Failed to save access logs:', e);
  }
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
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
        allowedHosts: ['longyumofa.cn']
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
                console.log('Verification request:', { uid, token });
                // 初始化 UID 的令牌数组（如果不存在）
                if (!accessLogs[uid]) {
                    accessLogs[uid] = [];
                    console.log('Created new UID entry:', uid);
                }
                // 检查令牌是否已存在
                if (accessLogs[uid].includes(token)) {
                    console.log('Duplicate token detected:', { uid, token });
                    return res.status(409).json({ error: 'TOKEN_EXPIRED' });
                }
                // 添加新令牌
                accessLogs[uid].push(token);
                console.log('Added new token:', { uid, token, tokens: accessLogs[uid].length });
                saveAccessLogs(); // 保存到文件
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
