import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route to dump agent outputs to a folder
  app.post("/api/dump", (req, res) => {
    try {
      const { outputs } = req.body;
      if (!outputs || Object.keys(outputs).length === 0) {
        return res.status(400).json({ error: "No outputs to dump" });
      }

      const dumpDir = path.join(process.cwd(), 'agent_outputs');
      
      if (!fs.existsSync(dumpDir)) {
        fs.mkdirSync(dumpDir);
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] + '_' + new Date().getTime();
      const sessionDir = path.join(dumpDir, `dump_${timestamp}`);
      fs.mkdirSync(sessionDir);

      const filesCreated: string[] = [];

      if (outputs.BA) {
        fs.writeFileSync(path.join(sessionDir, '1_BA_Requirements.md'), outputs.BA);
        filesCreated.push('1_BA_Requirements.md');
      }
      if (outputs.Dev) {
        fs.writeFileSync(path.join(sessionDir, '2_Dev_Code.md'), outputs.Dev);
        filesCreated.push('2_Dev_Code.md');
      }
      if (outputs.QA) {
        fs.writeFileSync(path.join(sessionDir, '3_QA_Tests.md'), outputs.QA);
        filesCreated.push('3_QA_Tests.md');
      }

      console.log(`[DUMP] Outputs saved to ${sessionDir}`);
      res.json({ 
        success: true, 
        message: "Outputs dumped successfully", 
        directory: sessionDir,
        files: filesCreated
      });
    } catch (error) {
      console.error("[DUMP ERROR]", error);
      res.status(500).json({ error: "Failed to dump outputs" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
