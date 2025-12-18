
import React from 'react';
import MyRideRequests from '../components/MyRideRequests';

const UserDashboard = () => {
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Passenger Dashboard</h1>

            <div className="mb-8">
                <p className="text-gray-600 mb-4">
                    Use the form on the left to request a ride, or manage your existing requests below.
                </p>
            </div>

            <MyRideRequests />
        </div>
    );
};

export default UserDashboard;
