import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const statusColumns = [
  {
    key: "todo",
    label: "To Do",
    color: "bg-gray-100 text-gray-600",
    dot: "bg-gray-400",
  },
  {
    key: "in_progress",
    label: "In Progress",
    color: "bg-blue-100 text-blue-600",
    dot: "bg-blue-500",
  },
  {
    key: "done",
    label: "Done",
    color: "bg-green-100 text-green-600",
    dot: "bg-green-500",
  },
];

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [activeTab, setActiveTab] = useState("tasks");
  const [members, setMembers] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "todo",
    assignedTo: "",
  });

  const fetchProject = async () => {
    try {
      const res = await api.get(`/projects/${projectId}`);
      setProject(res.data.data);
    } catch (err) {
      setError("Failed to fetch project");
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/projects/${projectId}/tasks`);
      setTasks(res.data.data);
    } catch (err) {
      setError("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await api.get(`/projects/${projectId}/members`);
      setMembers(res.data.data);
    } catch (err) {
      console.error("Failed to fetch members");
    }
  };

  useEffect(() => {
    fetchProject();
    fetchTasks();
    fetchMembers();
  }, [projectId]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post(`/projects/${projectId}/tasks`, newTask);
      setShowTaskModal(false);
      setNewTask({
        title: "",
        description: "",
        status: "todo",
        assignedTo: "",
      });
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await api.delete(`/projects/${projectId}/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      setError("Failed to delete task");
    }
  };

  const getTasksByStatus = (status) =>
    tasks.filter((task) => task.status === status);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 text-sm">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition"
          >
            ←
          </button>
          <span className="text-xl font-bold text-blue-600">CollabSync</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-700 font-medium">{project?.name}</span>
        </div>
        <button
          onClick={() => setShowTaskModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-semibold transition shadow-sm"
        >
          + New Task
        </button>
      </nav>

      {/* Project Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {project?.name}
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                {project?.description || "No description"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1 rounded-full font-medium">
                {tasks.length} tasks
              </span>
              <span className="text-xs bg-purple-50 text-purple-600 border border-purple-100 px-3 py-1 rounded-full font-medium">
                {members.length} members
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-5">
            {["tasks", "members"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize ${
                  activeTab === tab
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6 max-w-6xl mx-auto">
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl mb-4 text-sm flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Tasks Tab — Kanban Board */}
        {activeTab === "tasks" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {statusColumns.map((col) => (
              <div
                key={col.key}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
              >
                {/* Column Header */}
                <div className="px-4 py-3.5 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${col.dot}`}
                    ></span>
                    <span className="text-sm font-semibold text-gray-700">
                      {col.label}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${col.color}`}
                  >
                    {getTasksByStatus(col.key).length}
                  </span>
                </div>

                {/* Tasks */}
                <div className="p-3 space-y-2.5 min-h-40">
                  {getTasksByStatus(col.key).length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-300">
                      <p className="text-2xl mb-1">○</p>
                      <p className="text-xs">No tasks</p>
                    </div>
                  ) : (
                    getTasksByStatus(col.key).map((task) => (
                      <div
                        key={task._id}
                        className="bg-white border border-gray-100 rounded-xl p-4 hover:border-blue-200 hover:shadow-sm cursor-pointer transition group relative"
                      >
                        {/* Delete Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTask(task._id);
                          }}
                          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-300 hover:text-red-500 transition text-lg leading-none"
                        >
                          ×
                        </button>

                        <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 pr-6 leading-snug">
                          {task.title}
                        </p>

                        {task.description && (
                          <p className="text-xs text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
                            {task.description}
                          </p>
                        )}

                        {task.assignedTo && (
                          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-50">
                            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
                              {task.assignedTo?.username?.[0]?.toUpperCase()}
                            </div>
                            <span className="text-xs text-gray-400">
                              {task.assignedTo?.username}
                            </span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Members Tab */}
        {activeTab === "members" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden max-w-2xl">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">
                Project Members
              </h3>
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                {members.length} total
              </span>
            </div>

            {members.length === 0 ? (
              <div className="text-center py-16 text-gray-300">
                <p className="text-3xl mb-2">👥</p>
                <p className="text-sm">No members yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {members.map((member, index) => (
                  <div
                    key={index}
                    className="px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-sm font-bold text-white shadow-sm">
                        {member.user?.username?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {member.user?.username}
                        </p>
                        <p className="text-xs text-gray-400">
                          {member.user?.fullName || "No full name"}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        member.role === "admin"
                          ? "bg-purple-100 text-purple-600"
                          : member.role === "project_admin"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {member.role}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 mx-4">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Create New Task
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Add a task to {project?.name}
                </p>
              </div>
              <button
                onClick={() => setShowTaskModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition text-xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Enter task title"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Description
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                  placeholder="Enter task description"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Status
                </label>
                <select
                  value={newTask.status}
                  onChange={(e) =>
                    setNewTask({ ...newTask, status: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 text-sm font-semibold transition shadow-sm disabled:opacity-60"
                >
                  {creating ? "Creating..." : "Create Task"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
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

export default ProjectDetail;