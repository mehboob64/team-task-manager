import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUsers, updateUserRole } from '../services/userService';

const Profile = () => {
  const { user, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  useEffect(() => {
    if (isAdmin) loadUsers();
  }, [isAdmin]);

  const handleRoleChange = async (id, role) => {
    await updateUserRole(id, role);
    loadUsers();
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <div className="panel p-5">
        <h2 className="text-xl font-bold text-slate-900">Profile</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="font-semibold text-slate-500">Name</dt>
            <dd className="text-slate-900">{user?.name}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-500">Email</dt>
            <dd className="text-slate-900">{user?.email}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-500">Role</dt>
            <dd className="capitalize text-slate-900">{user?.role}</dd>
          </div>
        </dl>
      </div>
      {isAdmin && (
        <div className="panel overflow-hidden">
          <div className="border-b border-slate-200 p-5">
            <h2 className="text-xl font-bold text-slate-900">Team roles</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {users.map((teamUser) => (
              <div key={teamUser._id} className="grid gap-3 p-4 sm:grid-cols-[1fr_160px] sm:items-center">
                <div>
                  <p className="font-semibold text-slate-900">{teamUser.name}</p>
                  <p className="text-sm text-slate-500">{teamUser.email}</p>
                </div>
                <select className="form-field" value={teamUser.role} onChange={(event) => handleRoleChange(teamUser._id, event.target.value)}>
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default Profile;
