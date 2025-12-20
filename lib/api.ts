// API client for communicating with the backend

// In production (Vercel), API is at /api/*
// In local development, API is at localhost:3001/api/*
const API_URL = import.meta.env.VITE_API_URL || "";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  imageUrl: string;
  linkedin?: string;
  group: string;
  displayOrder?: number;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  applicationUrl?: string;
}

// File Upload API
export async function uploadImage(
  file: File
): Promise<{ imageUrl: string } | null> {
  try {
    // Convert file to base64
    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
    reader.readAsDataURL(file);
    const base64 = await base64Promise;

    const response = await fetch(`${API_URL}/api/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: base64,
        filename: file.name.replace(/\.[^/.]+$/, ""),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to upload image");
    }

    return await response.json();
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

// Team Members API
export async function fetchTeamMembers(): Promise<TeamMember[]> {
  try {
    const response = await fetch(`${API_URL}/api/team`);
    if (!response.ok) throw new Error("Failed to fetch team members");
    return await response.json();
  } catch (error) {
    console.error("Error fetching team members:", error);
    return [];
  }
}

export async function createTeamMember(
  member: Omit<TeamMember, "id"> & { id?: string }
): Promise<TeamMember | null> {
  try {
    const response = await fetch(`${API_URL}/api/team`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(member),
    });
    if (!response.ok) throw new Error("Failed to create team member");
    return await response.json();
  } catch (error) {
    console.error("Error creating team member:", error);
    return null;
  }
}

export async function updateTeamMember(
  id: string,
  member: Omit<TeamMember, "id">
): Promise<TeamMember | null> {
  try {
    const response = await fetch(`${API_URL}/api/team?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(member),
    if (!response.ok) throw new Error("Failed to update team member");
    return await response.json();
  } catch (error) {
    console.error("Error updating team member:", error);
    return null;
  }
}

export async function reorderTeamMembers(
  updates: { id: string; displayOrder: number }[]
): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/team`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error("Failed to reorder team members");
    return true;
  } catch (error) {
    console.error("Error reordering team members:", error);
    return false;
  }
}

export async function deleteTeamMember(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/team?id=${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete team member");
    return true;
  } catch (error) {
    console.error("Error deleting team member:", error);
    return false;
  }
}

// Jobs API
export async function fetchJobs(): Promise<Job[]> {
  try {
    const response = await fetch(`${API_URL}/api/jobs`);
    if (!response.ok) throw new Error("Failed to fetch jobs");
    return await response.json();
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
}

export async function createJob(
  job: Omit<Job, "id"> & { id?: string }
): Promise<Job | null> {
  try {
    const response = await fetch(`${API_URL}/api/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(job),
    });
    if (!response.ok) throw new Error("Failed to create job");
    return await response.json();
  } catch (error) {
    console.error("Error creating job:", error);
    return null;
  }
}

export async function updateJob(
  id: string,
  job: Omit<Job, "id">
): Promise<Job | null> {
  try {
    const response = await fetch(`${API_URL}/api/jobs?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(job),
    });
    if (!response.ok) throw new Error("Failed to update job");
    return await response.json();
  } catch (error) {
    console.error("Error updating job:", error);
    return null;
  }
}

export async function deleteJob(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/jobs?id=${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete job");
    return true;
  } catch (error) {
    console.error("Error deleting job:", error);
    return false;
  }
}
