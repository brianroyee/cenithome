import * as dotenv from "dotenv";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { v2 as cloudinary } from "cloudinary";
import {
  initDatabase,
  getAllTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getAllJobs,
  createJob,
  deleteJob,
} from "./db";

// Load environment variables
dotenv.config();

const app = new Hono();

// Debug: Check if env vars are loaded
console.log(
  "📦 Env check - CLOUDINARY_CLOUD_NAME:",
  process.env.CLOUDINARY_CLOUD_NAME ? "✓ Set" : "✗ Not set"
);

// Configure Cloudinary (only if env vars are set)
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log("☁️  Cloudinary configured successfully");
}

// Enable CORS for frontend
app.use(
  "/*",
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      process.env.FRONTEND_URL || "",
    ],
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    allowHeaders: ["Content-Type"],
  })
);

// Health check
app.get("/api/health", (c) => c.json({ status: "ok" }));

// File Upload API - Cloudinary or Base64 fallback
app.post("/api/upload", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return c.json({ error: "No file provided" }, 400);
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return c.json(
        {
          error:
            "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.",
        },
        400
      );
    }

    // Validate file size (max 5MB for base64, 10MB for Cloudinary)
    const maxSize = process.env.CLOUDINARY_CLOUD_NAME
      ? 10 * 1024 * 1024
      : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return c.json(
        {
          error: `File too large. Maximum size is ${
            process.env.CLOUDINARY_CLOUD_NAME ? "10MB" : "5MB"
          }.`,
        },
        400
      );
    }

    // Convert file to base64
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // If Cloudinary is configured, upload there
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      try {
        const result = await cloudinary.uploader.upload(base64, {
          folder: "cenit-labs/team",
          resource_type: "image",
          transformation: [
            { width: 800, height: 1000, crop: "fill", gravity: "face" },
            { quality: "auto" },
            { fetch_format: "auto" },
          ],
        });
        return c.json({ success: true, imageUrl: result.secure_url }, 201);
      } catch (cloudinaryError) {
        console.error("Cloudinary upload error:", cloudinaryError);
        return c.json({ error: "Failed to upload to cloud storage" }, 500);
      }
    }

    // Fallback: Return base64 directly (for local development)
    // Note: This stores the image directly in the database as a data URL
    console.log(
      "⚠️  Cloudinary not configured. Using base64 fallback (not recommended for production)"
    );
    return c.json({ success: true, imageUrl: base64 }, 201);
  } catch (error) {
    console.error("Error uploading file:", error);
    return c.json({ error: "Failed to upload file" }, 500);
  }
});

// Team Members API
app.get("/api/team", async (c) => {
  try {
    const members = await getAllTeamMembers();
    return c.json(members);
  } catch (error) {
    console.error("Error fetching team members:", error);
    return c.json({ error: "Failed to fetch team members" }, 500);
  }
});

app.get("/api/team/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const member = await getTeamMemberById(id);
    if (!member) {
      return c.json({ error: "Team member not found" }, 404);
    }
    return c.json(member);
  } catch (error) {
    console.error("Error fetching team member:", error);
    return c.json({ error: "Failed to fetch team member" }, 500);
  }
});

app.post("/api/team", async (c) => {
  try {
    const body = await c.req.json();
    const member = await createTeamMember({
      id: body.id || `member-${Date.now()}`,
      name: body.name,
      role: body.role,
      bio: body.bio,
      imageUrl: body.imageUrl,
      linkedin: body.linkedin,
      group: body.group,
    });
    return c.json(member, 201);
  } catch (error) {
    console.error("Error creating team member:", error);
    return c.json({ error: "Failed to create team member" }, 500);
  }
});

app.put("/api/team/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const member = await updateTeamMember(id, {
      name: body.name,
      role: body.role,
      bio: body.bio,
      imageUrl: body.imageUrl,
      linkedin: body.linkedin,
      group: body.group,
    });
    return c.json(member);
  } catch (error) {
    console.error("Error updating team member:", error);
    return c.json({ error: "Failed to update team member" }, 500);
  }
});

app.delete("/api/team/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await deleteTeamMember(id);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting team member:", error);
    return c.json({ error: "Failed to delete team member" }, 500);
  }
});

// Jobs API
app.get("/api/jobs", async (c) => {
  try {
    const jobs = await getAllJobs();
    return c.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return c.json({ error: "Failed to fetch jobs" }, 500);
  }
});

app.post("/api/jobs", async (c) => {
  try {
    const body = await c.req.json();
    const job = await createJob({
      id: body.id || `job-${Date.now()}`,
      title: body.title,
      department: body.department,
      location: body.location,
      type: body.type,
      description: body.description,
    });
    return c.json(job, 201);
  } catch (error) {
    console.error("Error creating job:", error);
    return c.json({ error: "Failed to create job" }, 500);
  }
});

app.delete("/api/jobs/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await deleteJob(id);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting job:", error);
    return c.json({ error: "Failed to delete job" }, 500);
  }
});

// Initialize database and start server
const PORT = process.env.PORT || 3001;

initDatabase()
  .then(() => {
    serve({
      fetch: app.fetch,
      port: Number(PORT),
    });
    console.log(`🚀 API Server running on http://localhost:${PORT}`);
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      console.log(
        "⚠️  Cloudinary not configured. Image uploads will use base64 (dev mode only)"
      );
    }
  })
  .catch((error) => {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  });
