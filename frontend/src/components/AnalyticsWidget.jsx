import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AnalyticsWidget = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/content/stats');
                setStats(res.data);
            } catch (err) {
                console.error('Failed to fetch stats', err);
            }
            setLoading(false);
        };

        fetchStats();
    }, []);

    if (loading) {
        return <p>Loading stats...</p>;
    }

    if (!stats) {
        return <p>Could not load stats.</p>;
    }

    return (
        <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Analytics Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-500">Total Submissions</h3>
                    <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-500">Pending</h3>
                    <p className="text-3xl font-bold text-yellow-500">{stats.pending}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-500">Approved</h3>
                    <p className="text-3xl font-bold text-green-500">{stats.approved}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-500">Rejected</h3>
                    <p className="text-3xl font-bold text-red-500">{stats.rejected}</p>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsWidget;