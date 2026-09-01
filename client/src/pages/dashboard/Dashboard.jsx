import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "" });
  const [creating, setCreating] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data.data);
    } catch (err) {
      setError("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed");
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post("/projects", newProject);
      setShowModal(false);
      setNewProject({ name: "", description: "" });
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await api.delete(`/projects/${projectId}`);
      fetchProjects();
    } catch (err) {
      setError("Failed to delete project");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl font-bold text-blue-600">CollabSync</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            👋{" "}
            <span className="font-medium text-gray-700">{user?.username}</span>
          </span>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 transition font-medium"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Projects</h2>
            <p className="text-gray-400 text-sm mt-1">
              {projects.length} project{projects.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 text-sm font-semibold transition shadow-sm"
          >
            + New Project
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-500 p-3 rounded-xl mb-4 text-sm flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center mt-20 gap-3">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 text-sm">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center mt-24">
            <p className="text-5xl mb-4">📁</p>
            <p className="text-lg font-semibold text-gray-700">
              No projects yet!
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Click "+ New Project" to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((item) => (
              <div
                key={item.project?._id}
                onClick={() => navigate(`/projects/${item.project?._id}`)}
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md cursor-pointer transition group relative"
              >
                {/* Delete Button */}
                {item.role === "admin" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(item.project?._id);
                    }}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-300 hover:text-red-500 transition text-xl"
                  >
                    ×
                  </button>
                )}

                <h3 className="text-lg font-semibold text-gray-800 pr-6">
                  {item.project?.name}
                </h3>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                  {item.project?.description || "No description"}
                </p>
                <div className="flex justify-between items-center mt-5">
                  <span className="text-xs text-gray-400">
                    👥 {item.project?.members} members
                  </span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      item.role === "admin"
                        ? "bg-purple-100 text-purple-600"
                        : item.role === "project_admin"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {item.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 mx-4">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Create New Project
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Add a new project to your workspace
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition text-xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Project Name
                </label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) =>
                    setNewProject({ ...newProject, name: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Enter project name"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Description
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      description: e.target.value,
                    })
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                  placeholder="Enter project description"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 text-sm font-semibold transition shadow-sm disabled:opacity-60"
                >
                  {creating ? "Creating..." : "Create Project"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-xl hover:bg-gray-200 text-sm font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;