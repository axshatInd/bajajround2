import { useState } from 'react';
import { createUser } from '@/services/api';

interface LoginFormProps {
  onLogin: (rollNumber: string) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [rollNumber, setRollNumber] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollNumber || !name) {
      setError('Both Roll Number and Name are required');
      return;
    }
    setLoading(true);
    try {
      await createUser(rollNumber, name);
      onLogin(rollNumber);
    } catch (err) {
      setError('Failed to register user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div
        className="
          w-full
          max-w-md
          md:max-w-lg
          lg:max-w-xl
          bg-white
          rounded-2xl
          shadow-xl
          py-6
          px-12
          md:px-10
          md:py-8
          lg:py-8
          lg:px-16
          border border-blue-100
        "
      >
        <h2 className="text-3xl font-extrabold text-blue-700 mb-10 text-center tracking-tight">Login</h2>
        {error && <p className="text-red-500 mb-6 text-center font-medium">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <label className="block text-gray-800 font-semibold mb-3">Roll Number</label>
            <input
              type="text"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              className="w-full p-4 border border-blue-200 rounded-lg shadow focus:ring-2 focus:ring-blue-400 text-gray-900 bg-blue-50 placeholder-gray-400"
              disabled={loading}
              placeholder="Enter your Roll Number"
              autoComplete="off"
            />
          </div>
          <div className="mb-10">
            <label className="block text-gray-800 font-semibold mb-3">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 border border-blue-200 rounded-lg shadow focus:ring-2 focus:ring-blue-400 text-gray-900 bg-blue-50 placeholder-gray-400"
              disabled={loading}
              placeholder="Enter your Name"
              autoComplete="off"
            />
          </div>
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-lg shadow hover:from-blue-700 hover:to-purple-700 transition text-lg"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
