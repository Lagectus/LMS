
// StudentDashboard.jsx - Student Dashboard Summary
// Shows student's overview: enrolled courses, completed courses, quiz scores, pending assignments
// Displays key statistics for the student's learning journey

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet } from '../utils/api';

export default function StudentDashboard() {
  // Navigation hook to redirect
  const navigate = useNavigate();

  // Local state for dashboard data
  const [dashboard, setDashboard] = useState(null);

  // Local state for loading
  const [loading, setLoading] = useState(false);

  // Local state for error messages
  const [error, setError] = useState(null);

  // Fetch dashboard summary when component loads
  useEffect(() => {
    // Function to fetch student dashboard from backend
    const fetchDashboard = async () => {
      // Set loading state
      setLoading(true);

      // Reset error state
      setError(null);

      try {
        // Call backend to get student dashboard
        const response = await apiGet('/dashboard/student');

        // Check if response is OK
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch student dashboard');
        }

        // Parse response JSON
        const data = await response.json();

        // Store dashboard data in local state
        setDashboard(data);
      } catch (err) {
        // If error, store error message
        console.error('Error fetching student dashboard:', err);
        setError(err.message || 'Error fetching dashboard');
      } finally {
        // Always set loading to false
        setLoading(false);
      }
    };

    // Fetch dashboard when component mounts
    fetchDashboard();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
        <div className="text-center">
          <div className="inline-block animate-spin">
            <div className="h-10 w-10 border-4 border-cyan-400 border-t-transparent rounded-full"></div>
          </div>
          <p className="mt-4 text-indigo-200">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
   if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-xl max-w-md w-full border border-white/20">
          <div className="bg-red-500/20 border border-red-400 text-red-200 p-4 rounded-lg mb-4">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="w-full bg-gradient-to-r from-cyan-500 to-indigo-600 text-white py-2 rounded-lg hover:scale-105 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }


  // Show when no dashboard data
   if (!dashboard) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-xl max-w-md w-full border border-white/20">
          <p className="text-center text-indigo-200 mb-4">
            No dashboard data available
          </p>
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-gradient-to-r from-cyan-500 to-indigo-600 text-white py-2 rounded-lg hover:scale-105 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Show student dashboard
   return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 py-8">
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">Student Dashboard</h1>
          <p className="text-indigo-200 mt-2">
            Welcome back! Here's your learning summary
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          {/* Enrolled */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl p-6 border border-white/20 hover:scale-105 transition">
            <p className="text-indigo-200 text-sm mb-2">Enrolled Courses</p>
            <p className="text-3xl font-bold text-cyan-400">
              {dashboard.totalEnrolledCourses}
            </p>
            <p className="text-xs text-indigo-300 mt-3">
              Total courses you're enrolled in
            </p>
          </div>

          {/* Completed */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl p-6 border border-white/20 hover:scale-105 transition">
            <p className="text-indigo-200 text-sm mb-2">Completed Courses</p>
            <p className="text-3xl font-bold text-emerald-400">
              {dashboard.completedCourses}
            </p>
            <p className="text-xs text-indigo-300 mt-3">
              Courses you've finished
            </p>
          </div>

          {/* Quiz */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl p-6 border border-white/20 hover:scale-105 transition">
            <p className="text-indigo-200 text-sm mb-2">Average Quiz Score</p>
            <p className="text-3xl font-bold text-fuchsia-400">
              {dashboard.averageQuizScore !== null
                ? `${dashboard.averageQuizScore}%`
                : 'N/A'}
            </p>
          </div>

          {/* Pending */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl p-6 border border-white/20 hover:scale-105 transition">
            <p className="text-indigo-200 text-sm mb-2">Pending Assignments</p>
            <p className="text-3xl font-bold text-pink-400">
              {dashboard.pendingAssignments}
            </p>
          </div>

        </div>

        {/* Quick Stats */}
        <div className="bg-gradient-to-r from-indigo-900/60 to-purple-900/60 backdrop-blur-lg rounded-xl shadow-xl p-6 border border-white/20">
          <h2 className="text-lg font-bold text-white mb-4">Quick Stats</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <p className="text-indigo-100 font-medium">Learning Progress</p>
              <p className="text-sm text-indigo-200 mt-1">
                You're enrolled in {dashboard.totalEnrolledCourses} course(s).
              </p>
            </div>

            <div>
              <p className="text-indigo-100 font-medium">Next Steps</p>
              <p className="text-sm text-indigo-200 mt-1">
                {dashboard.pendingAssignments > 0
                  ? `You have ${dashboard.pendingAssignments} assignment(s) waiting for grading.`
                  : 'No pending assignments. Great work!'}
              </p>
            </div>

          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <button
            onClick={() => navigate('/app/dashboard')}
            className="bg-gradient-to-r from-cyan-500 to-indigo-600 text-white py-2 px-6 rounded-lg hover:scale-105 hover:shadow-lg font-medium transition"
          >
            ← Back to Courses
          </button>
        </div>

      </div>
    </div>
  );
}
