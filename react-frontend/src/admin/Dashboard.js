import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, Grid, Typography, Box } from '@mui/material';
import { useDataProvider } from 'react-admin';
import CategoryIcon from '@mui/icons-material/Category';
import QuizIcon from '@mui/icons-material/Quiz';
import PeopleIcon from '@mui/icons-material/People';
import ListAltIcon from '@mui/icons-material/ListAlt';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <Card sx={{ minWidth: 200, bgcolor: color, color: 'white' }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" component="div">
            {value}
          </Typography>
          <Typography variant="body2">
            {title}
          </Typography>
        </Box>
        <Icon sx={{ fontSize: 48, opacity: 0.3 }} />
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const dataProvider = useDataProvider();
  const [stats, setStats] = useState({
    categories: 0,
    testCategories: 0,
    tests: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [categories, testCategories, tests, users] = await Promise.all([
          dataProvider.getList('categories', { pagination: { page: 1, perPage: 1 }, sort: { field: 'id', order: 'ASC' }, filter: {} }),
          dataProvider.getList('test-categories', { pagination: { page: 1, perPage: 1 }, sort: { field: 'id', order: 'ASC' }, filter: {} }),
          dataProvider.getList('tests', { pagination: { page: 1, perPage: 1 }, sort: { field: 'id', order: 'ASC' }, filter: {} }),
          dataProvider.getList('users', { pagination: { page: 1, perPage: 1 }, sort: { field: 'id', order: 'ASC' }, filter: {} }),
        ]);

        setStats({
          categories: categories.total || 0,
          testCategories: testCategories.total || 0,
          tests: tests.total || 0,
          users: users.total || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [dataProvider]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Welcome to English.am Admin Panel
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Categories"
            value={loading ? '...' : stats.categories}
            icon={CategoryIcon}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Test Categories"
            value={loading ? '...' : stats.testCategories}
            icon={ListAltIcon}
            color="#388e3c"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tests"
            value={loading ? '...' : stats.tests}
            icon={QuizIcon}
            color="#f57c00"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Users"
            value={loading ? '...' : stats.users}
            icon={PeopleIcon}
            color="#7b1fa2"
          />
        </Grid>
      </Grid>

      <Card sx={{ mt: 4 }}>
        <CardHeader title="Quick Actions" />
        <CardContent>
          <Typography variant="body1">
            Use the sidebar to navigate between different sections:
          </Typography>
          <ul>
            <li><strong>Categories</strong> - Manage main content categories</li>
            <li><strong>Test Categories</strong> - Manage test types (Grammar, Reading, etc.)</li>
            <li><strong>Tests</strong> - Create and manage individual tests</li>
            <li><strong>Test Levels</strong> - Configure difficulty levels</li>
            <li><strong>Languages</strong> - Manage supported languages</li>
            <li><strong>Users</strong> - View and manage registered users</li>
            <li><strong>Admins</strong> - Manage administrator accounts</li>
          </ul>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;

