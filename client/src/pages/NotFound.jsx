import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4 text-center">
      <div>
        <h1 className="text-5xl font-bold text-slate-900">404</h1>
        <p className="mt-3 text-slate-600">This page does not exist.</p>
        <Link className="btn-primary mt-6" to="/dashboard">Go to dashboard</Link>
      </div>
    </main>
  );
};

export default NotFound;
