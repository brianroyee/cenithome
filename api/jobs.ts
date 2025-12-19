import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAllJobs, createJob, deleteJob, initDatabase } from "./_db";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // Initialize database
    await initDatabase();

    // GET - Fetch all jobs
    if (req.method === "GET") {
      const jobs = await getAllJobs();
      return res.status(200).json(jobs);
    }

    // POST - Create new job
    if (req.method === "POST") {
      const body = req.body;
      const job = await createJob({
        id: body.id || `job-${Date.now()}`,
        title: body.title,
        department: body.department,
        location: body.location,
        type: body.type,
        description: body.description,
      });
      return res.status(201).json(job);
    }

    // DELETE - Delete job
    if (req.method === "DELETE") {
      const { id } = req.query;
      if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "ID required" });
      }
      await deleteJob(id);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Jobs API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
