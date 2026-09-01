import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/auth/forgot-password", { email });
      setSuccess(true);
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
            /* Success State */
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📧</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Check your email
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                We've sent a password reset link to{" "}
                <span className="font-semibold text-gray-600">{email}</span>.
                Check your inbox and follow the instructions.
              </p>
              <Link
                to="/login"
                className="block w-full bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 text-sm font-semibold transition text-center"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            /* Form State */
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Forgot password?
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  No worries, we'll send you reset instructions.
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
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 text-sm font-semibold transition shadow-sm disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="text-sm text-gray-400 hover:text-blue-600 transition flex items-center justify-center gap-1"
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

export default ForgotPassword;