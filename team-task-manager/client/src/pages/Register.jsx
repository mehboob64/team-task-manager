import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <form className="panel w-full max-w-md p-6" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold text-slate-900">Create account</h1>
        <p className="mt-1 text-sm text-slate-500">First registered user becomes admin.</p>
        {error && <p className="mt-4 rounded-md bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
        <label className="mt-5 block text-sm font-semibold text-slate-700">
          Name
          <input className="form-field mt-1" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
        </label>
        <label className="mt-4 block text-sm font-semibold text-slate-700">
          Email
          <input className="form-field mt-1" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        </label>
        <label className="mt-4 block text-sm font-semibold text-slate-700">
          Password
          <input className="form-field mt-1" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        </label>
        <button className="btn-primary mt-6 w-full" disabled={loading} type="submit">
          {loading ? 'Creating...' : 'Register'}
        </button>
        <p className="mt-4 text-center text-sm text-slate-600">
          Already have an account? <Link className="font-semibold text-brand" to="/login">Login</Link>
        </p>
      </form>
    </main>
  );
};

export default Register;
