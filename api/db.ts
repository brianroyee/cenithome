import { createClient, Client } from "@libsql/client/web";

// Create Turso client (lazy initialization for serverless)
let turso: Client | null = null;

function getClient(): Client {
  if (!turso) {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!url) {
      throw new Error("TURSO_DATABASE_URL environment variable is not set");
    }

    turso = createClient({
      url,
      authToken,
    });
  }
  return turso;
}

// Initialize database tables
export async function initDatabase() {
  const client = getClient();

  await client.execute(`
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

  await client.execute(`
    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      department TEXT NOT NULL,
      location TEXT NOT NULL,
      type TEXT NOT NULL,
      description TEXT,
      applicationUrl TEXT
    )
  `);

  // Add applicationUrl column if it doesn't exist (for existing databases)
  try {
    await client.execute(`ALTER TABLE jobs ADD COLUMN applicationUrl TEXT`);
  } catch {
    // Column already exists, ignore
  }

  // Add display_order column to team_members if it doesn't exist
  try {
    // Try adding snake_case column first
    await client.execute(
      `ALTER TABLE team_members ADD COLUMN display_order INTEGER DEFAULT 0`
    );
  } catch {
    // Column might already exist
  }
}
// Helper to transform row from snake_case to camelCase
function transformTeamMember(row: Record<string, unknown>) {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    bio: row.bio,
    imageUrl: row.imageUrl || row.image_url, // Handle both formats
    linkedin: row.linkedin,
    group: row.group || row.group_name || row['"group"'], // Handle different column names
    displayOrder: (row.displayOrder || row.display_order || 0) as number,
  };
}

// Team Members
export async function getAllTeamMembers() {
  const client = getClient();
  // Sort by display_order ASC (nulls last or treated as 0 via DEFAULT)
  const result = await client.execute(
    "SELECT * FROM team_members ORDER BY display_order ASC"
  );
  return result.rows.map((row) =>
    transformTeamMember(row as Record<string, unknown>)
  );
}

export async function getTeamMemberById(id: string) {
  const client = getClient();
  const result = await client.execute({
    sql: "SELECT * FROM team_members WHERE id = ?",
    args: [id],
  });
  const row = result.rows[0];
  return row ? transformTeamMember(row as Record<string, unknown>) : null;
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
  const client = getClient();
  try {
    await client.execute({
      sql: `INSERT INTO team_members (id, name, role, bio, image_url, linkedin, group_name, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        member.id,
        member.name,
        member.role,
        member.bio || null,
        member.imageUrl || null,
        member.linkedin || null,
        member.group,
        9999, // Default to end of list
      ],
    });
  } catch (e: any) {
    // Fallback for different schema versions
    if (e.message?.includes("no column")) {
      await client.execute({
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
    } else {
      throw e;
    }
  }
  return member;
}

export async function updateTeamMemberOrder(
  updates: { id: string; displayOrder: number }[]
) {
  const client = getClient();
  // Execute updates in a transaction or individually
  const transaction = await client.transaction("write");
  try {
    for (const update of updates) {
      await transaction.execute({
        sql: "UPDATE team_members SET display_order = ? WHERE id = ?",
        args: [update.displayOrder, update.id],
      });
    }
    await transaction.commit();
  } catch (e) {
    transaction.close();
    throw e;
  }
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
  const client = getClient();
  // Explicitly convert undefined to null - Turso doesn't accept undefined
  const name = member.name ?? null;
  const role = member.role ?? null;
  const bio = member.bio ?? null;
  const imageUrl = member.imageUrl ?? null;
  const linkedin = member.linkedin ?? null;
  const group = member.group ?? null;

  try {
    // Try snake_case first (Production DB seems to use this)
    await client.execute({
      sql: `UPDATE team_members SET name = ?, role = ?, bio = ?, image_url = ?, linkedin = ?, group_name = ? WHERE id = ?`,
      args: [name, role, bio, imageUrl, linkedin, group, id],
    });
  } catch (e: any) {
    if (e.message?.includes("no column")) {
      // Fallback to original schema
      await client.execute({
        sql: `UPDATE team_members SET name = ?, role = ?, bio = ?, imageUrl = ?, linkedin = ?, "group" = ? WHERE id = ?`,
        args: [name, role, bio, imageUrl, linkedin, group, id],
      });
    } else {
      throw e;
    }
  }
  return { id, ...member };
}

export async function deleteTeamMember(id: string) {
  const client = getClient();
  await client.execute({
    sql: "DELETE FROM team_members WHERE id = ?",
    args: [id],
  });
}

// Jobs
// Helper to transform job row
function transformJob(row: Record<string, unknown>) {
  return {
    id: row.id,
    title: row.title,
    department: row.department,
    location: row.location,
    type: row.type,
    description: row.description,
    applicationUrl: row.applicationUrl || row.application_url,
  };
}

export async function getAllJobs() {
  const client = getClient();
  const result = await client.execute("SELECT * FROM jobs");
  return result.rows.map((row) => transformJob(row as Record<string, unknown>));
}

export async function createJob(job: {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description?: string;
  applicationUrl?: string;
}) {
  const client = getClient();
  await client.execute({
    sql: "INSERT INTO jobs (id, title, department, location, type, description, applicationUrl) VALUES (?, ?, ?, ?, ?, ?, ?)",
    args: [
      job.id,
      job.title,
      job.department,
      job.location,
      job.type,
      job.description || null,
      job.applicationUrl || null,
    ],
  });
  return job;
}

export async function updateJob(
  id: string,
  job: Partial<{
    title: string;
    department: string;
    location: string;
    type: string;
    description: string;
    applicationUrl: string;
  }>
) {
  const client = getClient();
  // Explicitly convert undefined to null
  const title = job.title ?? null;
  const department = job.department ?? null;
  const location = job.location ?? null;
  const type = job.type ?? null;
  const description = job.description ?? null;
  const applicationUrl = job.applicationUrl ?? null;

  await client.execute({
    sql: "UPDATE jobs SET title = ?, department = ?, location = ?, type = ?, description = ?, applicationUrl = ? WHERE id = ?",
    args: [title, department, location, type, description, applicationUrl, id],
  });
  return { id, ...job };
}

export async function deleteJob(id: string) {
  const client = getClient();
  await client.execute({
    sql: "DELETE FROM jobs WHERE id = ?",
    args: [id],
  });
}
