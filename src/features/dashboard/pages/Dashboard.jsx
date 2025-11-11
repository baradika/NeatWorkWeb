import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('access_token');

    async function route() {
      if (role === 'petugas') {
        try {
          const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';
          const res = await fetch(`${base}/api/check-petugas-profile`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            }
          });
          if (!res.ok) {
            navigate('/auth/profile-petugas', { replace: true });
            return;
          }
          const data = await res.json();
          if (data.has_profile && data.is_verified) {
            navigate('/dashboard/petugas', { replace: true });
          } else if (data.has_profile && !data.is_verified) {
            navigate('/auth/status-petugas', { replace: true });
          } else {
            navigate('/auth/profile-petugas', { replace: true });
          }
        } catch (_) {
          navigate('/auth/profile-petugas', { replace: true });
        }
        return;
      }
      if (role === 'admin') {
        navigate('/dashboard/admin', { replace: true });
        return;
      }
      // Unknown role: send to login
      navigate('/auth/login', { replace: true });
    }

    route();
  }, [navigate]);

  return null;
};

export default Dashboard;
