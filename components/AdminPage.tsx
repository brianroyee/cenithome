import React, { useState, useEffect } from "react";
import { Reveal } from "./ui/Reveal";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  Save,
  Trash2,
  Plus,
  Edit2,
  X,
  Users,
  Briefcase,
  Image as ImageIcon,
  Link as LinkIcon,
  Loader2,
  RefreshCw,
  MapPin,
  Clock,
  Lock,
  LogOut,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  fetchTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  fetchJobs,
  createJob,
  deleteJob,
  uploadImage,
  TeamMember,
  Job,
} from "../lib/api";

interface TeamMemberForm {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  group: string;
  linkedin: string;
}

interface JobForm {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  applicationUrl: string;
}

const initialTeamFormState: TeamMemberForm = {
  id: "",
  name: "",
  role: "",
  bio: "",
  imageUrl: "",
  group: "Development Crew",
  linkedin: "",
};

const initialJobFormState: JobForm = {
  id: "",
  title: "",
  department: "",
  location: "",
  type: "Full-time",
  description: "",
  applicationUrl: "",
};

// Admin password from environment variable
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";

export const AdminPage: React.FC = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if already logged in this session
    return sessionStorage.getItem("adminAuth") === "true";
  });
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [activeTab, setActiveTab] = useState<"team" | "careers">("team");

  // Team state
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loadingTeam, setLoadingTeam] = useState(true);
  const [savingTeam, setSavingTeam] = useState(false);
  const [isAddingNewMember, setIsAddingNewMember] = useState(false);
  const [teamFormData, setTeamFormData] =
    useState<TeamMemberForm>(initialTeamFormState);

  // Jobs state
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [savingJob, setSavingJob] = useState(false);
  const [isAddingNewJob, setIsAddingNewJob] = useState(false);
  const [jobFormData, setJobFormData] = useState<JobForm>(initialJobFormState);

  const [error, setError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Handle login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");

    // Simulate a small delay for UX
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        setIsAuthenticated(true);
        sessionStorage.setItem("adminAuth", "true");
      } else {
        setLoginError("Incorrect password. Please try again.");
      }
      setIsLoggingIn(false);
    }, 500);
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("adminAuth");
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError(null);

    try {
      const result = await uploadImage(file);
      if (result) {
        setTeamFormData({
          ...teamFormData,
          imageUrl: result.imageUrl,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
    }

    setUploadingImage(false);
  };
  const loadMembers = async () => {
    setLoadingTeam(true);
    setError(null);
    try {
      const data = await fetchTeamMembers();
      setMembers(data);
    } catch (err) {
      setError(
        "Failed to load team members. Make sure the API server is running."
      );
    }
    setLoadingTeam(false);
  };

  // Load jobs
  const loadJobs = async () => {
    setLoadingJobs(true);
    setError(null);
    try {
      const data = await fetchJobs();
      setJobs(data);
    } catch (err) {
      setError("Failed to load jobs. Make sure the API server is running.");
    }
    setLoadingJobs(false);
  };

  useEffect(() => {
    loadMembers();
    loadJobs();
  }, []);

  // Team handlers
  const handleEditMember = (member: TeamMember) => {
    setTeamFormData({
      id: member.id,
      name: member.name,
      role: member.role,
      bio: member.bio || "",
      imageUrl: member.imageUrl,
      group: member.group,
      linkedin: member.linkedin || "",
    });
    setIsAddingNewMember(false);
  };

  const handleAddNewMember = () => {
    setTeamFormData({
      ...initialTeamFormState,
      id: `member-${Date.now()}`,
    });
    setIsAddingNewMember(true);
  };

  const handleSaveMember = async () => {
    setSavingTeam(true);
    setError(null);
    try {
      if (isAddingNewMember) {
        const result = await createTeamMember({
          id: teamFormData.id,
          name: teamFormData.name,
          role: teamFormData.role,
          bio: teamFormData.bio || undefined,
          imageUrl: teamFormData.imageUrl,
          linkedin: teamFormData.linkedin || undefined,
          group: teamFormData.group,
        });
        if (result) {
          setMembers([...members, result]);
        }
      } else {
        const result = await updateTeamMember(teamFormData.id, {
          name: teamFormData.name,
          role: teamFormData.role,
          bio: teamFormData.bio || undefined,
          imageUrl: teamFormData.imageUrl,
          linkedin: teamFormData.linkedin || undefined,
          group: teamFormData.group,
        });
        if (result) {
          setMembers(
            members.map((m) => (m.id === teamFormData.id ? result : m))
          );
        }
      }
      setTeamFormData(initialTeamFormState);
      setIsAddingNewMember(false);
    } catch (err) {
      setError("Failed to save. Make sure the API server is running.");
    }
    setSavingTeam(false);
  };

  const handleDeleteMember = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;

    try {
      const success = await deleteTeamMember(id);
      if (success) {
        setMembers(members.filter((m) => m.id !== id));
        if (teamFormData.id === id) {
          setTeamFormData(initialTeamFormState);
        }
      }
    } catch (err) {
      setError("Failed to delete team member.");
    }
  };

  const handleCancelMember = () => {
    setTeamFormData(initialTeamFormState);
    setIsAddingNewMember(false);
  };

  // Job handlers
  const handleAddNewJob = () => {
    setJobFormData({
      ...initialJobFormState,
      id: `job-${Date.now()}`,
    });
    setIsAddingNewJob(true);
  };

  const handleSaveJob = async () => {
    // Validate required fields
    if (!jobFormData.title.trim()) {
      setError("Job title is required");
      return;
    }
    if (!jobFormData.department.trim()) {
      setError("Department is required");
      return;
    }
    if (!jobFormData.location.trim()) {
      setError("Location is required");
      return;
    }
    if (!jobFormData.applicationUrl.trim()) {
      setError("Application URL is required (e.g., Google Form link)");
      return;
    }

    setSavingJob(true);
    setError(null);
    try {
      const result = await createJob({
        id: jobFormData.id,
        title: jobFormData.title,
        department: jobFormData.department,
        location: jobFormData.location,
        type: jobFormData.type,
        description: jobFormData.description,
        applicationUrl: jobFormData.applicationUrl,
      });
      if (result) {
        setJobs([...jobs, result]);
      }
      setJobFormData(initialJobFormState);
      setIsAddingNewJob(false);
    } catch (err) {
      setError("Failed to save job. Make sure the API server is running.");
    }
    setSavingJob(false);
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job posting?")) return;

    try {
      const success = await deleteJob(id);
      if (success) {
        setJobs(jobs.filter((j) => j.id !== id));
      }
    } catch (err) {
      setError("Failed to delete job.");
    }
  };

  const handleCancelJob = () => {
    setJobFormData(initialJobFormState);
    setIsAddingNewJob(false);
  };

  const groupedMembers = members.reduce<Record<string, TeamMember[]>>(
    (acc, member) => {
      if (!acc[member.group]) acc[member.group] = [];
      acc[member.group].push(member);
      return acc;
    },
    {}
  );

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-neutral-50 flex items-center justify-center">
        <div className="w-full max-w-md px-6">
          <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-8">
            {/* Logo/Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-cenit-blue/10 flex items-center justify-center">
                <Lock size={32} className="text-cenit-blue" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-neutral-900 text-center mb-2">
              Admin Access
            </h1>
            <p className="text-neutral-500 text-center mb-8">
              Enter your password to continue
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-cenit-blue focus:ring-1 focus:ring-cenit-blue pr-12"
                    placeholder="Enter admin password"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoggingIn || !password}
                className="w-full py-3 bg-cenit-blue text-white rounded-lg font-medium hover:bg-cenit-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    Login
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/"
                className="text-sm text-neutral-500 hover:text-cenit-blue transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-neutral-50">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="group flex items-center gap-2 text-neutral-500 hover:text-cenit-blue transition-colors"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-sm font-medium uppercase tracking-widest">
              Back to Home
            </span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-neutral-500 hover:text-red-500 transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>

        <Reveal>
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Admin Panel
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-lg text-neutral-600">
            Manage team members, careers, and site settings.
          </p>
        </Reveal>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700"
            >
              <X size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="flex gap-2 border-b border-neutral-200">
          <button
            onClick={() => setActiveTab("team")}
            className={`px-6 py-3 text-sm font-medium uppercase tracking-widest transition-colors flex items-center gap-2 ${
              activeTab === "team"
                ? "text-cenit-blue border-b-2 border-cenit-blue -mb-[1px]"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <Users size={16} />
            Team ({members.length})
          </button>
          <button
            onClick={() => setActiveTab("careers")}
            className={`px-6 py-3 text-sm font-medium uppercase tracking-widest transition-colors flex items-center gap-2 ${
              activeTab === "careers"
                ? "text-cenit-blue border-b-2 border-cenit-blue -mb-[1px]"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <Briefcase size={16} />
            Careers ({jobs.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6">
        {/* Team Tab */}
        {activeTab === "team" && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Member List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-neutral-900">
                  Team Members
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={loadMembers}
                    disabled={loadingTeam}
                    className="flex items-center gap-2 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw
                      size={16}
                      className={loadingTeam ? "animate-spin" : ""}
                    />
                    Refresh
                  </button>
                  <button
                    onClick={handleAddNewMember}
                    className="flex items-center gap-2 px-4 py-2 bg-cenit-blue text-white rounded-lg hover:bg-cenit-dark transition-colors"
                  >
                    <Plus size={16} />
                    Add Member
                  </button>
                </div>
              </div>

              {loadingTeam ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 size={32} className="animate-spin text-cenit-blue" />
                </div>
              ) : members.length === 0 ? (
                <div className="bg-white rounded-lg border border-neutral-200 p-8 text-center">
                  <Users size={48} className="mx-auto text-neutral-400 mb-4" />
                  <p className="text-neutral-600">No team members yet.</p>
                  <p className="text-neutral-500 text-sm mt-1">
                    Click "Add Member" to add your first team member.
                  </p>
                </div>
              ) : (
                (
                  Object.entries(groupedMembers) as [string, TeamMember[]][]
                ).map(([group, groupMembers]) => (
                  <div key={group}>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-4">
                      {group}
                    </h3>
                    <div className="space-y-3">
                      {groupMembers.map((member) => (
                        <div
                          key={member.id}
                          className={`bg-white rounded-lg p-4 border transition-all ${
                            teamFormData.id === member.id
                              ? "border-cenit-blue shadow-md"
                              : "border-neutral-200 hover:border-neutral-300"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={member.imageUrl}
                              alt={member.name}
                              className="w-12 h-12 rounded-full object-cover bg-neutral-200"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://via.placeholder.com/48?text=?";
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-neutral-900 truncate">
                                {member.name}
                              </h4>
                              <p className="text-sm text-neutral-500 truncate">
                                {member.role}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditMember(member)}
                                className="p-2 text-neutral-400 hover:text-cenit-blue transition-colors"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteMember(member.id)}
                                className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Edit Form */}
            <div className="lg:col-span-1">
              {(isAddingNewMember || teamFormData.id) && (
                <div className="bg-white rounded-xl border border-neutral-200 p-6 sticky top-24">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-neutral-900">
                      {isAddingNewMember ? "Add New Member" : "Edit Member"}
                    </h3>
                    <button
                      onClick={handleCancelMember}
                      className="text-neutral-400 hover:text-neutral-600"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        <ImageIcon size={14} className="inline mr-1" />
                        Profile Image
                      </label>
                      <div className="space-y-3">
                        {/* Image Preview */}
                        <div className="w-full aspect-square max-w-[200px] mx-auto rounded-lg bg-neutral-100 border-2 border-dashed border-neutral-300 flex items-center justify-center overflow-hidden relative">
                          {uploadingImage ? (
                            <div className="flex flex-col items-center gap-2 text-neutral-400">
                              <Loader2 size={32} className="animate-spin" />
                              <span className="text-xs">Uploading...</span>
                            </div>
                          ) : teamFormData.imageUrl ? (
                            <img
                              src={teamFormData.imageUrl}
                              alt="Preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://via.placeholder.com/200?text=Error";
                              }}
                            />
                          ) : (
                            <div className="flex flex-col items-center gap-2 text-neutral-400">
                              <Upload size={32} />
                              <span className="text-xs">No image</span>
                            </div>
                          )}
                        </div>

                        {/* File Upload */}
                        <div>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            onChange={handleImageUpload}
                            disabled={uploadingImage}
                            className="hidden"
                            id="image-upload"
                          />
                          <label
                            htmlFor="image-upload"
                            className={`flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer hover:border-cenit-blue hover:bg-cenit-blue/5 transition-colors ${
                              uploadingImage
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            <Upload size={18} className="text-neutral-500" />
                            <span className="text-sm text-neutral-600">
                              {uploadingImage ? "Uploading..." : "Upload Image"}
                            </span>
                          </label>
                          <p className="text-xs text-neutral-400 mt-1 text-center">
                            JPEG, PNG, GIF, WebP (max 5MB)
                          </p>
                        </div>

                        {/* URL Option */}
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-neutral-200"></div>
                          </div>
                          <div className="relative flex justify-center">
                            <span className="px-2 bg-white text-xs text-neutral-400">
                              or paste URL
                            </span>
                          </div>
                        </div>
                        <input
                          type="text"
                          placeholder="https://example.com/image.jpg"
                          value={teamFormData.imageUrl}
                          onChange={(e) =>
                            setTeamFormData({
                              ...teamFormData,
                              imageUrl: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-cenit-blue"
                        />
                      </div>
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={teamFormData.name}
                        onChange={(e) =>
                          setTeamFormData({
                            ...teamFormData,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-cenit-blue"
                        placeholder="Full Name"
                        required
                      />
                    </div>

                    {/* Role */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Role *
                      </label>
                      <input
                        type="text"
                        value={teamFormData.role}
                        onChange={(e) =>
                          setTeamFormData({
                            ...teamFormData,
                            role: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-cenit-blue"
                        placeholder="Job Title"
                        required
                      />
                    </div>

                    {/* Group */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Group *
                      </label>
                      <select
                        value={teamFormData.group}
                        onChange={(e) =>
                          setTeamFormData({
                            ...teamFormData,
                            group: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-cenit-blue"
                      >
                        <option value="Founders">Founders</option>
                        <option value="Development Crew">
                          Development Crew
                        </option>
                        <option value="Community Team">Community Team</option>
                      </select>
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={teamFormData.bio}
                        onChange={(e) =>
                          setTeamFormData({
                            ...teamFormData,
                            bio: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-cenit-blue resize-none"
                        rows={3}
                        placeholder="Short bio..."
                      />
                    </div>

                    {/* LinkedIn */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        <LinkIcon size={14} className="inline mr-1" />
                        LinkedIn URL
                      </label>
                      <input
                        type="url"
                        value={teamFormData.linkedin}
                        onChange={(e) =>
                          setTeamFormData({
                            ...teamFormData,
                            linkedin: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-cenit-blue"
                        placeholder="https://linkedin.com/in/..."
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSaveMember}
                        disabled={
                          savingTeam || !teamFormData.name || !teamFormData.role
                        }
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-cenit-blue text-white rounded-lg hover:bg-cenit-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {savingTeam ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Save size={16} />
                        )}
                        {savingTeam ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {!isAddingNewMember && !teamFormData.id && (
                <div className="bg-neutral-100 rounded-xl border-2 border-dashed border-neutral-300 p-8 text-center">
                  <Users size={48} className="mx-auto text-neutral-400 mb-4" />
                  <p className="text-neutral-600">
                    Select a team member to edit or add a new one.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Careers Tab */}
        {activeTab === "careers" && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Jobs List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-neutral-900">
                  Job Postings
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={loadJobs}
                    disabled={loadingJobs}
                    className="flex items-center gap-2 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw
                      size={16}
                      className={loadingJobs ? "animate-spin" : ""}
                    />
                    Refresh
                  </button>
                  <button
                    onClick={handleAddNewJob}
                    className="flex items-center gap-2 px-4 py-2 bg-cenit-blue text-white rounded-lg hover:bg-cenit-dark transition-colors"
                  >
                    <Plus size={16} />
                    Add Job
                  </button>
                </div>
              </div>

              {loadingJobs ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 size={32} className="animate-spin text-cenit-blue" />
                </div>
              ) : jobs.length === 0 ? (
                <div className="bg-white rounded-lg border border-neutral-200 p-8 text-center">
                  <Briefcase
                    size={48}
                    className="mx-auto text-neutral-400 mb-4"
                  />
                  <p className="text-neutral-600">No job postings yet.</p>
                  <p className="text-neutral-500 text-sm mt-1">
                    Click "Add Job" to create your first job posting.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      className="bg-white rounded-lg p-6 border border-neutral-200 hover:border-neutral-300 transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-neutral-900">
                            {job.title}
                          </h3>
                          <p className="text-neutral-600 mt-1 text-sm">
                            {job.description}
                          </p>
                          <div className="flex flex-wrap gap-3 mt-3">
                            <span className="flex items-center gap-1 text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded">
                              <Briefcase size={12} />
                              {job.department}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded">
                              <MapPin size={12} />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded">
                              <Clock size={12} />
                              {job.type}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Job Form */}
            <div className="lg:col-span-1">
              {isAddingNewJob && (
                <div className="bg-white rounded-xl border border-neutral-200 p-6 sticky top-24">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-neutral-900">
                      Add New Job
                    </h3>
                    <button
                      onClick={handleCancelJob}
                      className="text-neutral-400 hover:text-neutral-600"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Job Title *
                      </label>
                      <input
                        type="text"
                        value={jobFormData.title}
                        onChange={(e) =>
                          setJobFormData({
                            ...jobFormData,
                            title: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-cenit-blue"
                        placeholder="e.g. Senior Frontend Developer"
                        required
                      />
                    </div>

                    {/* Department */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Department *
                      </label>
                      <input
                        type="text"
                        value={jobFormData.department}
                        onChange={(e) =>
                          setJobFormData({
                            ...jobFormData,
                            department: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-cenit-blue"
                        placeholder="e.g. Engineering, Design, Marketing"
                        required
                      />
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        <MapPin size={14} className="inline mr-1" />
                        Location *
                      </label>
                      <input
                        type="text"
                        value={jobFormData.location}
                        onChange={(e) =>
                          setJobFormData({
                            ...jobFormData,
                            location: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-cenit-blue"
                        placeholder="e.g. Remote, Hybrid, On-site"
                        required
                      />
                    </div>

                    {/* Type */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        <Clock size={14} className="inline mr-1" />
                        Employment Type *
                      </label>
                      <select
                        value={jobFormData.type}
                        onChange={(e) =>
                          setJobFormData({
                            ...jobFormData,
                            type: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-cenit-blue"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                        <option value="Freelance">Freelance</option>
                      </select>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={jobFormData.description}
                        onChange={(e) =>
                          setJobFormData({
                            ...jobFormData,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-cenit-blue resize-none"
                        rows={4}
                        placeholder="Brief description of the role and responsibilities..."
                      />
                    </div>

                    {/* Application URL */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        <span className="text-red-500">*</span> Application URL{" "}
                        <span className="text-neutral-400 font-normal">
                          (Google Form, Typeform, etc.)
                        </span>
                      </label>
                      <input
                        type="url"
                        value={jobFormData.applicationUrl}
                        onChange={(e) =>
                          setJobFormData({
                            ...jobFormData,
                            applicationUrl: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-cenit-blue"
                        placeholder="https://forms.google.com/..."
                        required
                      />
                      <p className="text-xs text-neutral-400 mt-1">
                        The "Apply Now" button will redirect candidates to this
                        link
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSaveJob}
                        disabled={
                          savingJob ||
                          !jobFormData.title ||
                          !jobFormData.department ||
                          !jobFormData.location ||
                          !jobFormData.applicationUrl
                        }
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-cenit-blue text-white rounded-lg hover:bg-cenit-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {savingJob ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Save size={16} />
                        )}
                        {savingJob ? "Saving..." : "Create Job Posting"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {!isAddingNewJob && (
                <div className="bg-neutral-100 rounded-xl border-2 border-dashed border-neutral-300 p-8 text-center">
                  <Briefcase
                    size={48}
                    className="mx-auto text-neutral-400 mb-4"
                  />
                  <p className="text-neutral-600">
                    Click "Add Job" to create a new job posting.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
