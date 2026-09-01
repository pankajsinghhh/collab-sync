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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">CollabSync</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">👋 {user?.username}</span>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Projects</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-medium"
          >
            + New Project
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-gray-500 text-center mt-10">Loading projects...</p>
        ) : projects.length === 0 ? (
          <div className="text-center mt-20 text-gray-400">
            <p className="text-lg">No projects yet!</p>
            <p className="text-sm mt-1">Click "+ New Project" to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((item) => (
              <div
                key={item.project?._id}
                onClick={() => navigate(`/projects/${item.project?._id}`)}
                className="bg-white p-5 rounded-lg shadow hover:shadow-md cursor-pointer transition"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.project?.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {item.project?.description || "No description"}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs text-gray-400">
                    👥 {item.project?.members} members
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Create New Project
            </h3>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) =>
                    setNewProject({ ...newProject, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project description"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm font-medium"
                >
                  {creating ? "Creating..." : "Create Project"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 text-sm font-medium"
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