import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";

const ResetPassword = () => {
  const { resetToken } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await api.post(`/auth/reset-password/${resetToken}`, { newPassword });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">CollabSync</h1>
          <p className="text-gray-400 text-sm mt-1">Project Management Tool</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {success ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✅</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Password reset!
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Your password has been reset successfully. Redirecting to
                login...
              </p>
              <Link
                to="/login"
                className="block w-full bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 text-sm font-semibold transition text-center"
              >
                Go to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Reset password
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Enter your new password below
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-500 p-3 rounded-xl mb-4 text-sm flex items-center gap-2">
                  <span>⚠️</span> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Enter new password"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Confirm new password"
                    required
                  />
                </div>

                {/* Password strength indicator */}
                {newPassword && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      <div
                        className={`h-1 flex-1 rounded-full transition-all ${newPassword.length >= 1 ? "bg-red-400" : "bg-gray-100"}`}
                      ></div>
                      <div
                        className={`h-1 flex-1 rounded-full transition-all ${newPassword.length >= 6 ? "bg-yellow-400" : "bg-gray-100"}`}
                      ></div>
                      <div
                        className={`h-1 flex-1 rounded-full transition-all ${newPassword.length >= 8 ? "bg-blue-400" : "bg-gray-100"}`}
                      ></div>
                      <div
                        className={`h-1 flex-1 rounded-full transition-all ${newPassword.length >= 10 ? "bg-green-400" : "bg-gray-100"}`}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-400">
                      {newPassword.length < 6
                        ? "Too short"
                        : newPassword.length < 8
                          ? "Weak"
                          : newPassword.length < 10
                            ? "Good"
                            : "Strong"}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 text-sm font-semibold transition shadow-sm disabled:opacity-60 mt-2"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="text-sm text-gray-400 hover:text-blue-600 transition"
                >
                  ← Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;