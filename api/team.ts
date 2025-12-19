import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  getAllTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  initDatabase,
} from "./_db";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // Initialize database
    await initDatabase();

    // GET - Fetch all team members
    if (req.method === "GET") {
      const members = await getAllTeamMembers();
      return res.status(200).json(members);
    }

    // POST - Create new team member
    if (req.method === "POST") {
      const body = req.body;
      const member = await createTeamMember({
        id: body.id || `member-${Date.now()}`,
        name: body.name,
        role: body.role,
        bio: body.bio,
        imageUrl: body.imageUrl,
        linkedin: body.linkedin,
        group: body.group,
      });
      return res.status(201).json(member);
    }

    // PUT - Update team member
    if (req.method === "PUT") {
      const { id } = req.query;
      if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "ID required" });
      }
      const body = req.body;
      const member = await updateTeamMember(id, {
        name: body.name,
        role: body.role,
        bio: body.bio,
        imageUrl: body.imageUrl,
        linkedin: body.linkedin,
        group: body.group,
      });
      return res.status(200).json(member);
    }

    // DELETE - Delete team member
    if (req.method === "DELETE") {
      const { id } = req.query;
      if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "ID required" });
      }
      await deleteTeamMember(id);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Team API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
