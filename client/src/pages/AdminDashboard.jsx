// client/src/pages/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;