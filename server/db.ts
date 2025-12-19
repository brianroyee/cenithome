import { createClient } from "@libsql/client";

// Initialize Turso client
// You need to set these environment variables:
// TURSO_DATABASE_URL - your Turso database URL
// TURSO_AUTH_TOKEN - your Turso auth token

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:local.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Initialize database schema
export async function initDatabase() {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS team_members (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      bio TEXT,
      image_url TEXT,
      linkedin TEXT,
      group_name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      department TEXT NOT NULL,
      location TEXT NOT NULL,
      type TEXT NOT NULL,
      description TEXT,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("Database initialized successfully");
}

// Team Member CRUD operations
export async function getAllTeamMembers() {
  const result = await client.execute(
    "SELECT * FROM team_members ORDER BY group_name, name"
  );
  return result.rows.map((row) => ({
    id: row.id as string,
    name: row.name as string,
    role: row.role as string,
    bio: row.bio as string | undefined,
    imageUrl: row.image_url as string,
    linkedin: row.linkedin as string | undefined,
    group: row.group_name as string,
  }));
}

export async function getTeamMemberById(id: string) {
  const result = await client.execute({
    sql: "SELECT * FROM team_members WHERE id = ?",
    args: [id],
  });
  if (result.rows.length === 0) return null;
  const row = result.rows[0];
  return {
    id: row.id as string,
    name: row.name as string,
    role: row.role as string,
    bio: row.bio as string | undefined,
    imageUrl: row.image_url as string,
    linkedin: row.linkedin as string | undefined,
    group: row.group_name as string,
  };
}

export async function createTeamMember(member: {
  id: string;
  name: string;
  role: string;
  bio?: string;
  imageUrl: string;
  linkedin?: string;
  group: string;
}) {
  await client.execute({
    sql: `INSERT INTO team_members (id, name, role, bio, image_url, linkedin, group_name) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [
      member.id,
      member.name,
      member.role,
      member.bio || null,
      member.imageUrl,
      member.linkedin || null,
      member.group,
    ],
  });
  return member;
}

export async function updateTeamMember(
  id: string,
  member: {
    name: string;
    role: string;
    bio?: string;
    imageUrl: string;
    linkedin?: string;
    group: string;
  }
) {
  await client.execute({
    sql: `UPDATE team_members 
          SET name = ?, role = ?, bio = ?, image_url = ?, linkedin = ?, group_name = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?`,
    args: [
      member.name,
      member.role,
      member.bio || null,
      member.imageUrl,
      member.linkedin || null,
      member.group,
      id,
    ],
  });
  return { id, ...member };
}

export async function deleteTeamMember(id: string) {
  await client.execute({
    sql: "DELETE FROM team_members WHERE id = ?",
    args: [id],
  });
  return true;
}

// Job CRUD operations
export async function getAllJobs() {
  const result = await client.execute(
    "SELECT * FROM jobs WHERE is_active = 1 ORDER BY created_at DESC"
  );
  return result.rows.map((row) => ({
    id: row.id as string,
    title: row.title as string,
    department: row.department as string,
    location: row.location as string,
    type: row.type as string,
    description: row.description as string,
  }));
}

export async function createJob(job: {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
}) {
  await client.execute({
    sql: `INSERT INTO jobs (id, title, department, location, type, description) 
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [
      job.id,
      job.title,
      job.department,
      job.location,
      job.type,
      job.description,
    ],
  });
  return job;
}

export async function deleteJob(id: string) {
  await client.execute({
    sql: "UPDATE jobs SET is_active = 0 WHERE id = ?",
    args: [id],
  });
  return true;
}

export default client;
