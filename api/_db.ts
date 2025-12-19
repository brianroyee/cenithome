import { createClient } from "@libsql/client";

// Create Turso client
const turso = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:local.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Initialize database tables
export async function initDatabase() {
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS team_members (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      bio TEXT,
      imageUrl TEXT,
      linkedin TEXT,
      "group" TEXT NOT NULL
    )
  `);

  await turso.execute(`
    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      department TEXT NOT NULL,
      location TEXT NOT NULL,
      type TEXT NOT NULL,
      description TEXT
    )
  `);
}

// Team Members
export async function getAllTeamMembers() {
  const result = await turso.execute("SELECT * FROM team_members");
  return result.rows;
}

export async function getTeamMemberById(id: string) {
  const result = await turso.execute({
    sql: "SELECT * FROM team_members WHERE id = ?",
    args: [id],
  });
  return result.rows[0] || null;
}

export async function createTeamMember(member: {
  id: string;
  name: string;
  role: string;
  bio?: string;
  imageUrl?: string;
  linkedin?: string;
  group: string;
}) {
  await turso.execute({
    sql: `INSERT INTO team_members (id, name, role, bio, imageUrl, linkedin, "group") VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [
      member.id,
      member.name,
      member.role,
      member.bio || null,
      member.imageUrl || null,
      member.linkedin || null,
      member.group,
    ],
  });
  return member;
}

export async function updateTeamMember(
  id: string,
  member: Partial<{
    name: string;
    role: string;
    bio: string;
    imageUrl: string;
    linkedin: string;
    group: string;
  }>
) {
  await turso.execute({
    sql: `UPDATE team_members SET name = ?, role = ?, bio = ?, imageUrl = ?, linkedin = ?, "group" = ? WHERE id = ?`,
    args: [
      member.name,
      member.role,
      member.bio || null,
      member.imageUrl || null,
      member.linkedin || null,
      member.group,
      id,
    ],
  });
  return { id, ...member };
}

export async function deleteTeamMember(id: string) {
  await turso.execute({
    sql: "DELETE FROM team_members WHERE id = ?",
    args: [id],
  });
}

// Jobs
export async function getAllJobs() {
  const result = await turso.execute("SELECT * FROM jobs");
  return result.rows;
}

export async function createJob(job: {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description?: string;
}) {
  await turso.execute({
    sql: "INSERT INTO jobs (id, title, department, location, type, description) VALUES (?, ?, ?, ?, ?, ?)",
    args: [
      job.id,
      job.title,
      job.department,
      job.location,
      job.type,
      job.description || null,
    ],
  });
  return job;
}

export async function deleteJob(id: string) {
  await turso.execute({
    sql: "DELETE FROM jobs WHERE id = ?",
    args: [id],
  });
}
