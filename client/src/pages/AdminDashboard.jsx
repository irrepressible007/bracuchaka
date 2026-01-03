// client/src/pages/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
<<<<<<< HEAD

const API_URL = '/api';

function AdminDashboard() {
  const [pendingVehicles, setPendingVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchPendingVehicles = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/pending-vehicles`);
      setPendingVehicles(res.data);
    } catch (err) {
      setError('Failed to fetch pending vehicles.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingVehicles();
  }, []);

  const handleApprove = async (vehicleId) => {
    setMessage('');
    setError('');
    try {
      const res = await axios.put(`${API_URL}/admin/approve-vehicle/${vehicleId}`);
      setMessage(res.data.message);
      setPendingVehicles(prev => prev.filter(vehicle => vehicle._id !== vehicleId));
    } catch (err) {
      setError('Failed to approve vehicle.');
      console.error(err);
    }
  };

  if (loading) {
    return <div>Loading pending applications...</div>;
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Pending Driver Approvals
      </h1>

      {error && <div className="p-3 mb-4 bg-red-100 border border-red-400 text-red-700 rounded-md">{error}</div>}
      {message && <div className="p-3 mb-4 bg-green-100 border border-green-400 text-green-700 rounded-md">{message}</div>}

      {pendingVehicles.length === 0 ? (
        <p className="text-gray-600">No pending applications.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reg. Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License No.</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingVehicles.map(vehicle => (
                <tr key={vehicle._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{vehicle.owner.name}</div>
                    <div className="text-sm text-gray-500">{vehicle.owner.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{`${vehicle.bikeName} ${vehicle.bikeModel}`}</div>
                    <div className="text-sm text-gray-500">{`${vehicle.modelYear} - ${vehicle.color}`}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{vehicle.registrationNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{vehicle.licenseNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleApprove(vehicle._id)}
                      className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md shadow-sm"
                    >
                      Approve
                    </button>
                    {/* <button className="ml-2 text-red-600 hover:text-red-900">Reject</button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
=======
import { useNavigate } from 'react-router-dom';

import { API_URL } from '../config';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  // Data States
  const [stats, setStats] = useState({ totalUsers: 0, activeRides: 0, pendingVehicles: 0, pendingComplaints: 0 });
  const [liveRides, setLiveRides] = useState([]);
  const [users, setUsers] = useState([]);
  const [pendingVehicles, setPendingVehicles] = useState([]);
  const [complaints, setComplaints] = useState([]);

  // Modal State
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });

  const navigate = useNavigate();

  // --- FETCHING DATA ---
  useEffect(() => {
    fetchData();
    // Poll for live data if on Overview
    const interval = setInterval(() => {
      if (activeTab === 'overview') fetchOverviewData();
    }, 10000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const fetchData = () => {
    setLoading(true);
    switch (activeTab) {
      case 'overview': fetchOverviewData(); break;
      case 'users': fetchUsers(); break;
      case 'vehicles': fetchPendingVehicles(); break;
      case 'complaints': fetchComplaints(); break;
      default: break;
    }
  };

  const fetchOverviewData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [statsRes, ridesRes] = await Promise.all([
        axios.get(`${API_URL}/admin/stats`, { headers: { 'x-auth-token': token } }),
        axios.get(`${API_URL}/admin/live-rides`, { headers: { 'x-auth-token': token } })
      ]);
      setStats(statsRes.data);
      setLiveRides(ridesRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/admin/users`, { headers: { 'x-auth-token': token } });
      setUsers(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchPendingVehicles = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/admin/pending-vehicles`, { headers: { 'x-auth-token': token } });
      setPendingVehicles(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/admin/complaints`, { headers: { 'x-auth-token': token } });
      setComplaints(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  // --- ACTIONS ---
  const handleApproveVehicle = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/admin/approve-vehicle/${id}`, {}, { headers: { 'x-auth-token': token } });
      fetchPendingVehicles(); // Refresh
      alert('Vehicle Approved!');
    } catch (err) { alert('Action failed'); }
  };

  const handleRejectVehicle = async (id) => {
    if (!window.confirm("Are you sure you want to reject this vehicle application? It will be deleted.")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/admin/reject-vehicle/${id}`, {}, { headers: { 'x-auth-token': token } });
      fetchPendingVehicles(); // Refresh
      alert('Vehicle Rejected and Removed.');
    } catch (err) { alert('Action failed'); }
  };

  const handleBlockUser = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/admin/users/${id}/block`, {}, { headers: { 'x-auth-token': token } });
      fetchUsers();
    } catch (err) { alert('Action failed'); }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Permanently delete this user?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/admin/users/${id}`, { headers: { 'x-auth-token': token } });
      fetchUsers();
    } catch (err) { alert('Action failed'); }
  };

  const handleMakeAdmin = async (id) => {
    if (!window.confirm("Promote this user to Admin?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/admin/users/${id}/make-admin`, {}, { headers: { 'x-auth-token': token } });
      fetchUsers();
    } catch (err) { alert('Action failed'); }
  };

  const handleResolveComplaint = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/admin/complaints/${id}/resolve`, {}, { headers: { 'x-auth-token': token } });
      fetchComplaints();
    } catch (err) { alert('Action failed'); }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/admin/create-admin`, {
        name: newAdmin.name,
        username: newAdmin.email,
        password: newAdmin.password
      }, { headers: { 'x-auth-token': token } });
      alert('New Admin Created Successfully!');
      setShowAdminModal(false);
      setNewAdmin({ name: '', email: '', password: '' });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create admin');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  }

  // --- RENDER HELPERS ---
  const SidebarItem = ({ id, icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center px-6 py-4 text-left font-medium transition-all duration-200 border-l-4
      ${activeTab === id
          ? 'bg-gray-800 text-white border-blue-500 shadow-inner'
          : 'border-transparent text-gray-400 hover:bg-gray-800 hover:text-gray-100'}`}
    >
      <span className={`mr-3 ${activeTab === id ? 'text-blue-400' : 'text-gray-500'}`}>{icon}</span>
      {label}
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white shadow-2xl flex flex-col z-20 font-inter">
        <div className="px-6 py-8 border-b border-gray-800 bg-gray-900">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="font-bold text-white text-lg">C</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide text-white leading-none">CHAKA</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mt-1">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-6 space-y-1">
          <SidebarItem id="overview" label="Overview" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>} />
          <SidebarItem id="users" label="User Management" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>} />
          <SidebarItem id="vehicles" label="Vehicle Approvals" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
          <SidebarItem id="complaints" label="Support Tickets" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>} />
        </nav>

        <div className="p-4 border-t border-gray-800 bg-gray-900">
          <button onClick={handleLogout} className="w-full flex items-center justify-center px-4 py-2 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors text-sm font-medium">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow py-6 px-8 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 capitalize">{activeTab.replace('-', ' ')}</h2>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold">
              A
            </div>
          </div>
        </header>

        <main className="p-8">
          {loading && activeTab !== 'overview' ? (
            <div className="text-center text-gray-500 py-12">Loading...</div>
          ) : (
            <>
              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard title="Total Users" value={stats.totalUsers} color="bg-blue-500" />
                    <StatsCard title="Active Rides" value={stats.activeRides} color="bg-green-500" />
                    <StatsCard title="Pending Vehicles" value={stats.pendingVehicles} color="bg-orange-500" />
                    <StatsCard title="Open Complaints" value={stats.pendingComplaints} color="bg-red-500" />
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Live Rides Feed</h3>
                    {liveRides.length === 0 ? <p className="text-gray-500">No active rides currently.</p> : (
                      <div className="space-y-4">
                        {liveRides.map(ride => (
                          <div key={ride._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="flex items-center space-x-4">
                              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                              <div>
                                <p className="font-bold text-gray-800">{ride.driver?.name} <span className="text-gray-400 mx-2">→</span> {ride.requester?.name}</p>
                                <p className="text-sm text-gray-500">{ride.startLocation} to {ride.destination}</p>
                              </div>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">{ride.status}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* USERS TAB */}
              {activeTab === 'users' && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-700">Registered Users</h3>
                    <button onClick={() => setShowAdminModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow text-sm font-bold flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                      Create New Admin
                    </button>
                  </div>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map(user => (
                        <tr key={user._id}>
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{user.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {user.role === 'ADMIN' ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                Administrator
                              </span>
                            ) : (
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isRider ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                {user.isRider ? 'Passenger & Driver' : 'Passenger'}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                              {user.isBlocked ? 'BLOCKED' : 'Active'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                            {/* Make Admin Removed */}
                            <button
                              onClick={() => handleBlockUser(user._id)}
                              className={`${user.isBlocked ? 'text-green-600 hover:text-green-900' : 'text-orange-600 hover:text-orange-900'}`}
                            >
                              {user.isBlocked ? 'Unblock' : 'Block'}
                            </button>
                            <button onClick={() => handleDeleteUser(user._id)} className="text-red-600 hover:text-red-900">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* VEHICLES TAB */}
              {activeTab === 'vehicles' && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  {pendingVehicles.length === 0 ? <p className="text-gray-500">No pending vehicle applications.</p> : (
                    <div className="space-y-4">
                      {pendingVehicles.map(v => (
                        <div key={v._id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:bg-gray-50">
                          <div>
                            <h4 className="font-bold text-gray-800">{v.bikeName} {v.bikeModel}</h4>
                            <p className="text-sm text-gray-500">Owner: {v.owner?.name}</p>
                            <p className="text-xs text-gray-400">Reg: {v.registrationNumber}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button onClick={() => handleApproveVehicle(v._id)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow-sm text-sm font-bold">
                              Approve
                            </button>
                            <button onClick={() => handleRejectVehicle(v._id)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow-sm text-sm font-bold">
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* COMPLAINTS TAB */}
              {activeTab === 'complaints' && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  {complaints.length === 0 ? <p className="text-gray-500">No complaints found.</p> : (
                    <div className="space-y-4">
                      {complaints.map(c => (
                        <div key={c._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between mb-2">
                            <span className="font-bold text-gray-800">From: {c.submittedBy?.name}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${c.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{c.status}</span>
                          </div>
                          <p className="text-gray-600 mb-3">{c.description}</p>
                          {c.status !== 'resolved' && (
                            <button onClick={() => handleResolveComplaint(c._id)} className="text-sm text-blue-600 hover:underline">Mark Resolved</button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </>
          )}
        </main>
      </div>
      {/* CREATE ADMIN MODAL */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Create New Admin</h3>
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                <input type="text" required className="w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  value={newAdmin.name} onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                <input type="text" required className="w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  value={newAdmin.email} onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                <input type="password" required className="w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  value={newAdmin.password} onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })} />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowAdminModal(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold">Create Admin</button>
              </div>
            </form>
          </div>
>>>>>>> origin/Sanzid
        </div>
      )}
    </div>
  );
}

<<<<<<< HEAD
=======
const StatsCard = ({ title, value, color }) => (
  <div className={`rounded-lg p-6 text-white shadow-lg transform hover:-translate-y-1 transition-transform ${color}`}>
    <h4 className="text-sm font-semibold opacity-80 uppercase tracking-wide">{title}</h4>
    <p className="text-4xl font-bold mt-2">{value}</p>
  </div>
);

>>>>>>> origin/Sanzid
export default AdminDashboard;