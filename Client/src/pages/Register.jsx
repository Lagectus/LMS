import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken, setUser, setRole } from '../features/auth/authSlice';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
       const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
           name: formData.name,
           email: formData.email,
           password: formData.password,
           role: formData.role,
         }),
       });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Registration failed');
        setLoading(false);
        return;
      }

      dispatch(setToken(data.token));
      dispatch(setUser(data.user));
      dispatch(setRole(data.user.role));

      // Redirect based on role
      if (data.user.role === 'admin') {
        navigate('/app/admin/dashboard');
      } else if (data.user.role === 'teacher') {
        navigate('/app/teacher/dashboard');
      } else {
        navigate('/app/student/dashboard');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
    
    <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl w-full max-w-md p-8">
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white">Create Account 🚀</h1>
        <p className="text-gray-300 mt-2">Join our LMS platform</p>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-400 text-red-200 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            className="w-full px-4 py-3 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            className="w-full px-4 py-3 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm your password"
            className="w-full px-4 py-3 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Register as
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white/20 text-white border border-white/30 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition"
            disabled={loading}
          >
            <option value="student" className="text-black">Student</option>
            <option value="teacher" className="text-black">Teacher</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-semibold py-3 rounded-lg hover:scale-[1.02] hover:shadow-xl transition disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

      </form>

      <div className="mt-8 pt-6 border-t border-white/20 text-center">
        <p className="text-gray-300 text-sm">
          Already have an account?{' '}
          <a href="/" className="text-pink-400 font-semibold hover:text-pink-300">
            Login here
          </a>
        </p>
      </div>

    </div>
  </div>
);
};

export default Register;