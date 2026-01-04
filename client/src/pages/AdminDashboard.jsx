// client/src/pages/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
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


  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ... (existing fetch functions remain same)

  // --- RENDER HELPERS ---
  const SidebarItem = ({ id, icon, label }) => (
    <button
      onClick={() => { setActiveTab(id); setIsSidebarOpen(false); }}
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

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-white shadow-2xl flex flex-col z-40 transform transition-transform duration-300 lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-6 py-8 border-b border-gray-800 bg-gray-900 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="font-bold text-white text-lg">C</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide text-white leading-none">CHAKA</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mt-1">Admin Panel</p>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <nav className="flex-1 py-6 space-y-1 overflow-y-auto">
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
      <div className="flex-1 overflow-auto flex flex-col">
        {/* Header */}
        <header className="bg-white shadow py-4 px-4 lg:px-8 flex justify-between items-center sticky top-0 z-20">
          <div className="flex items-center">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden mr-4 text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-800 capitalize">{activeTab.replace('-', ' ')}</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold border-2 border-blue-200">
              A
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          {loading && activeTab !== 'overview' ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard title="Total Users" value={stats.totalUsers} color="bg-gradient-to-br from-blue-500 to-blue-600" />
                    <StatsCard title="Active Rides" value={stats.activeRides} color="bg-gradient-to-br from-green-500 to-green-600" />
                    <StatsCard title="Pending Vehicles" value={stats.pendingVehicles} color="bg-gradient-to-br from-orange-400 to-orange-500" />
                    <StatsCard title="Open Complaints" value={stats.pendingComplaints} color="bg-gradient-to-br from-red-500 to-red-600" />
                  </div>

                  {/* Live Rides Feed */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                      Live Rides Feed
                    </h3>
                    {liveRides.length === 0 ? <p className="text-gray-500 py-4 text-center">No active rides currently.</p> : (
                      <div className="space-y-4">
                        {liveRides.map(ride => (
                          <div key={ride._id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 transition hover:shadow-md">
                            <div className="flex items-center space-x-4 mb-3 md:mb-0">
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                {ride.driver?.name?.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-gray-800 text-sm">
                                  {ride.driver?.name} <span className="text-gray-400 mx-1">➜</span> {ride.requester?.name}
                                </p>
                                <p className="text-xs text-gray-500 mt-1 flex items-center">
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                  {ride.startLocation} to {ride.destination}
                                </p>
                              </div>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full w-fit">
                              {ride.status.replace('_', ' ')}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* USERS TAB */}
              {activeTab === 'users' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
                  <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 gap-4">
                    <h3 className="font-bold text-gray-700">Registered Users</h3>
                    <button onClick={() => setShowAdminModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm text-sm font-bold flex items-center transition-transform active:scale-95">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                      Create New Admin
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map(user => (
                          <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <img
                                  className="h-10 w-10 rounded-full object-cover border border-gray-200"
                                  src={user.profilePhotoUrl || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
                                  alt=""
                                />
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                  <div className="text-xs text-gray-500 md:hidden">{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {user.role === 'ADMIN' ? (
                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                                  Administrator
                                </span>
                              ) : (
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${user.isRider ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                                  {user.isRider ? 'Passenger & Driver' : 'Passenger'}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${user.isBlocked ? 'bg-red-100 text-red-800 border-red-200' : 'bg-green-100 text-green-800 border-green-200'}`}>
                                {user.isBlocked ? 'BLOCKED' : 'Active'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                              {/* Make Admin Removed */}
                              <button
                                onClick={() => handleBlockUser(user._id)}
                                className={`${user.isBlocked ? 'text-green-600 hover:text-green-800 bg-green-50' : 'text-orange-600 hover:text-orange-800 bg-orange-50'} px-3 py-1 rounded-md transition-colors`}
                              >
                                {user.isBlocked ? 'Unblock' : 'Block'}
                              </button>
                              <button onClick={() => handleDeleteUser(user._id)} className="text-red-600 hover:text-red-800 bg-red-50 px-3 py-1 rounded-md transition-colors">Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* VEHICLES TAB */}
              {activeTab === 'vehicles' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-fade-in">
                  {pendingVehicles.length === 0 ? <p className="text-gray-500 text-center py-8">No pending vehicle applications.</p> : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {pendingVehicles.map(v => (
                        <div key={v._id} className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all flex flex-col bg-white">
                          <div className="relative h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden group">
                            {/* Image Mockup - Replace with v.vehiclePhotoUrl if available */}
                            <img
                              src={v.systemImageUrl || "/api/placeholder/400/320"}
                              alt="Vehicle"
                              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                              {v.color}
                            </div>
                          </div>

                          <div className="flex-1 mb-4">
                            <h4 className="font-bold text-gray-800 text-lg">{v.bikeName} <span className="text-sm font-normal text-gray-500">({v.bikeModel})</span></h4>
                            <div className="text-sm text-gray-600 space-y-1 mt-2">
                              <p><span className="font-semibold">Owner:</span> {v.owner?.name}</p>
                              <p><span className="font-semibold">Reg No:</span> {v.registrationNumber}</p>
                              <p><span className="font-semibold">License:</span> {v.licenseNumber}</p>
                            </div>
                          </div>

                          <div className="flex space-x-3 mt-auto pt-4 border-t border-gray-100">
                            <button onClick={() => handleApproveVehicle(v._id)} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg shadow-sm text-sm font-bold transition-transform active:scale-95">
                              Approve
                            </button>
                            <button onClick={() => handleRejectVehicle(v._id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg shadow-sm text-sm font-bold transition-transform active:scale-95">
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
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-fade-in">
                  {complaints.length === 0 ? <p className="text-gray-500 text-center py-8">No complaints found.</p> : (
                    <div className="space-y-4">
                      {complaints.map(c => (
                        <div key={c._id} className="border border-gray-200 rounded-xl p-5 hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center space-x-3">
                              <div className={`w-2 h-2 rounded-full ${c.status === 'resolved' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                              <span className="font-bold text-gray-800">From: {c.submittedBy?.name}</span>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full border ${c.status === 'resolved' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
                              {c.status.toUpperCase()}
                            </span>
                          </div>

                          <div className="bg-gray-100 p-3 rounded-lg text-gray-600 text-sm mb-4">
                            "{c.description}"
                          </div>

                          {c.status !== 'resolved' && (
                            <div className="flex justify-end">
                              <button onClick={() => handleResolveComplaint(c._id)} className="text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 px-4 py-2 rounded-lg transition-colors">
                                Mark as Resolved
                              </button>
                            </div>
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

      {/* CREATE ADMIN MODAL (Unchanged mostly, just styling tweaks) */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-scale-in">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Create New Admin</h3>
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              {/* Form fields same as before, just styled inputs */}
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                <input type="text" required className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newAdmin.name} onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Username (Email)</label>
                <input type="text" required className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newAdmin.email} onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                <input type="password" required className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newAdmin.password} onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })} />
              </div>
              <div className="flex justify-end space-x-3 pt-6">
                <button type="button" onClick={() => setShowAdminModal(false)} className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-lg shadow-blue-500/30 transition-transform active:scale-95">Create Admin</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const StatsCard = ({ title, value, color }) => (
  <div className={`rounded-xl p-6 text-white shadow-lg transform hover:-translate-y-1 transition-transform ${color}`}>
    <h4 className="text-xs font-bold opacity-80 uppercase tracking-wider mb-1">{title}</h4>
    <p className="text-4xl font-bold">{value}</p>
  </div>
);

export default AdminDashboard;