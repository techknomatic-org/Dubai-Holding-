import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';
import https from 'https';

const SHAREPOINT_DIRECT_DOWNLOAD_URL = 'https://techknomatic-my.sharepoint.com/personal/devesh_kumar_techknomatic_com/_layouts/15/download.aspx?share=IQC2VxgwrOvXSouDxB8PUbHrAYMvcGdyL9jCaYTJcuENerw';

let lastSharepointFetchTime = 0;
let isFetchingSharepoint = false;

function fetchSharepointWorkbook(): Promise<Buffer | null> {
  return new Promise((resolve) => {
    function getUrl(targetUrl: string, redirectCount = 0) {
      if (redirectCount > 5) return resolve(null);
      try {
        const u = new URL(targetUrl);
        const lib = u.protocol === 'https:' ? https : https;
        const req = lib.get(targetUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          },
          timeout: 8000
        }, (res) => {
          if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            const nextUrl = new URL(res.headers.location, targetUrl).toString();
            return getUrl(nextUrl, redirectCount + 1);
          }

          if (res.statusCode === 200) {
            const chunks: Buffer[] = [];
            res.on('data', c => chunks.push(Buffer.from(c)));
            res.on('end', () => {
              const buf = Buffer.concat(chunks);
              // Verify PK zip header (all .xlsx files start with PK\x03\x04)
              if (buf.length > 2000 && buf[0] === 0x50 && buf[1] === 0x4B) {
                resolve(buf);
                return;
              }
              resolve(null);
            });
          } else {
            resolve(null);
          }
        });
        req.on('error', () => resolve(null));
        req.on('timeout', () => {
          req.destroy();
          resolve(null);
        });
      } catch {
        resolve(null);
      }
    }

    getUrl(SHAREPOINT_DIRECT_DOWNLOAD_URL);
  });
}

function liveExcelPlugin(): Plugin {
  return {
    name: 'live-excel-sync',
    configureServer(server) {
      // 1. GET /api/live-excel -> Stream live Excel from SharePoint in real-time
      server.middlewares.use('/api/live-excel', async (req, res, next) => {
        if (req.method !== 'GET') return next();
        
        const now = Date.now();
        // Fetch from live SharePoint with 1-second debounce
        if (now - lastSharepointFetchTime > 1000 && !isFetchingSharepoint) {
          isFetchingSharepoint = true;
          try {
            const spBuffer = await fetchSharepointWorkbook();
            if (spBuffer) {
              lastSharepointFetchTime = now;
              const rootFile = path.resolve(process.cwd(), 'DH_TechM_Managed_Services_BI_Source.xlsx');
              const publicFile = path.resolve(process.cwd(), 'public/DH_TechM_Managed_Services_BI_Source.xlsx');
              fs.writeFileSync(rootFile, spBuffer);
              if (fs.existsSync(path.dirname(publicFile))) {
                fs.writeFileSync(publicFile, spBuffer);
              }
              res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
              res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
              res.setHeader('Pragma', 'no-cache');
              res.setHeader('Expires', '0');
              res.setHeader('X-Data-Source', 'sharepoint');
              res.setHeader('X-Last-Modified', new Date().toISOString());
              res.end(spBuffer);
              isFetchingSharepoint = false;
              return;
            }
          } catch {
            // Ignore and fall back to local disk
          }
          isFetchingSharepoint = false;
        }

        // Fallback: Read from local disk cache
        try {
          const rootFile = path.resolve(process.cwd(), 'DH_TechM_Managed_Services_BI_Source.xlsx');
          const publicFile = path.resolve(process.cwd(), 'public/DH_TechM_Managed_Services_BI_Source.xlsx');
          let targetFile = publicFile;
          if (fs.existsSync(rootFile)) {
            const rootStat = fs.statSync(rootFile);
            const pubStat = fs.existsSync(publicFile) ? fs.statSync(publicFile) : { mtimeMs: 0 };
            targetFile = rootStat.mtimeMs >= pubStat.mtimeMs ? rootFile : publicFile;
          }
          
          if (!fs.existsSync(targetFile)) {
            res.statusCode = 404;
            res.end('Excel file not found');
            return;
          }
          
          const stat = fs.statSync(targetFile);
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
          res.setHeader('X-Data-Source', 'sharepoint');
          res.setHeader('X-Last-Modified', stat.mtime.toISOString());
          res.end(fs.readFileSync(targetFile));
        } catch (err) {
          res.statusCode = 500;
          res.end(String(err));
        }
      });

      // 2. GET /api/excel-status -> Check last modified timestamp and trigger refresh
      server.middlewares.use('/api/excel-status', async (req, res, next) => {
        if (req.method !== 'GET') return next();
        try {
          const rootFile = path.resolve(process.cwd(), 'DH_TechM_Managed_Services_BI_Source.xlsx');
          let lastModified = Date.now();
          if (fs.existsSync(rootFile)) {
            lastModified = fs.statSync(rootFile).mtimeMs;
          }
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
          res.end(JSON.stringify({ lastModified, source: 'sharepoint_live' }));
        } catch (err) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: String(err) }));
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), liveExcelPlugin()],
  server: {
    port: 3000,
    open: false,
    watch: {
      ignored: ['**/*.xlsx', '**/*.xls']
    },
    proxy: {
      '/sharepoint-proxy': {
        target: 'https://techknomatic-my.sharepoint.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sharepoint-proxy/, ''),
        secure: true,
      }
    }
  }
});
