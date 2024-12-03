import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import SideBar from './adminSideBar.jsx';

const AdminDashboard = () => {
    const [counts, setCounts] = useState({
        totalUsers: 0,
        totalBookings: 0,
        totalTours: 0,
        totalDestinations: 0,
        totalQueries: 0,
        totalRatings: 0
    });

    useEffect(() => {
        const fetchDashboardCounts = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/dashboard-counts/');
                if (!response.ok) {
                    throw new Error('Failed to fetch dashboard counts');
                }
                const data = await response.json();
                setCounts({
                    totalUsers: data.total_users,
                    totalBookings: data.total_bookings,
                    totalTours: data.total_tours,
                    totalDestinations: data.total_destinations,
                    totalQueries: data.total_queries,
                    totalRatings: data.total_ratings
                });
            } catch (error) {
                console.error(error);
            }
        };

        fetchDashboardCounts();
    }, []);

    return (
        <div className="admin-dashboard">
            <SideBar />

            <div id="content" className="content">
                <div className="container">
                    <h2>Admin Dashboard</h2>

                    <div className="metrics">
                        <h4>Site Metrics</h4>
                        <div className="metric-cards">
                            <div className="metric-card">
                                <h3>Total Users</h3>
                                <p><span id="TotalUsers">{counts.totalUsers}</span></p>
                            </div>
                            <div className="metric-card">
                                <h3>Total Bookings</h3>
                                <p><span id="TotalBookings">{counts.totalBookings}</span></p>
                            </div>
                            <div className="metric-card">
                                <h3>Total Tours</h3>
                                <p><span id="TotalTours">{counts.totalTours}</span></p>
                            </div>
                        </div>

                        <div className="metric-cards">
                            <div className="metric-card">
                                <h3>Total Destinations</h3>
                                <p><span id="TotalDestinations">{counts.totalDestinations}</span></p>
                            </div>
                            <div className="metric-card">
                                <h3>Total Wishlist</h3>
                                <p><span id="TotalQueries">{counts.totalQueries}</span></p>
                            </div>
                            <div className="metric-card">
                                <h3>Total Ratings</h3>
                                <p><span id="TotalRatings">{counts.totalRatings}</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
