import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, Grid, Typography, Box, Divider } from '@mui/material';
import { useDataProvider, Link } from 'react-admin';
import CategoryIcon from '@mui/icons-material/Category';
import QuizIcon from '@mui/icons-material/Quiz';
import PeopleIcon from '@mui/icons-material/People';
import ListAltIcon from '@mui/icons-material/ListAlt';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import EditNoteIcon from '@mui/icons-material/EditNote';

const StatCard = ({ title, value, icon: Icon, color, to }) => {
  const content = (
    <Card sx={{
      minWidth: 180,
      bgcolor: color,
      color: 'white',
      transition: 'transform 0.15s, box-shadow 0.15s',
      cursor: to ? 'pointer' : 'default',
      '&:hover': to ? { transform: 'translateY(-2px)', boxShadow: 4 } : {},
    }}>
      <CardContent sx={{ pb: '12px !important' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" component="div" fontWeight={700}>
              {value}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {title}
            </Typography>
          </Box>
          <Icon sx={{ fontSize: 44, opacity: 0.3 }} />
        </Box>
      </CardContent>
    </Card>
  );

  if (to) {
    return <Link to={to} style={{ textDecoration: 'none' }}>{content}</Link>;
  }
  return content;
};

const Dashboard = () => {
  const dataProvider = useDataProvider();
  const [stats, setStats] = useState({
    categories: 0,
    testCategories: 0,
    tests: 0,
    users: 0,
    toeflReading: 0,
    toeflListening: 0,
    ieltsReading: 0,
    ieltsListening: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const defaultParams = { pagination: { page: 1, perPage: 1 }, sort: { field: 'id', order: 'ASC' }, filter: {} };
        const [categories, testCategories, tests, users, toeflReading, toeflListening, ieltsReading, ieltsListening] = await Promise.all([
          dataProvider.getList('categories', defaultParams).catch(() => ({ total: 0 })),
          dataProvider.getList('test-categories', defaultParams).catch(() => ({ total: 0 })),
          dataProvider.getList('tests', defaultParams).catch(() => ({ total: 0 })),
          dataProvider.getList('users', defaultParams).catch(() => ({ total: 0 })),
          dataProvider.getList('toefl-reading', defaultParams).catch(() => ({ total: 0 })),
          dataProvider.getList('toefl-listening', defaultParams).catch(() => ({ total: 0 })),
          dataProvider.getList('ielts-reading', defaultParams).catch(() => ({ total: 0 })),
          dataProvider.getList('ielts-listening', defaultParams).catch(() => ({ total: 0 })),
        ]);

        setStats({
          categories: categories.total || 0,
          testCategories: testCategories.total || 0,
          tests: tests.total || 0,
          users: users.total || 0,
          toeflReading: toeflReading.total || 0,
          toeflListening: toeflListening.total || 0,
          ieltsReading: ieltsReading.total || 0,
          ieltsListening: ieltsListening.total || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [dataProvider]);

  const v = (key) => loading ? '...' : stats[key];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Welcome to English.am Admin Panel
      </Typography>

      <Typography variant="h6" sx={{ mt: 3, mb: 1.5 }}>Overview</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Categories" value={v('categories')} icon={CategoryIcon} color="#1976d2" to="/categories" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Test Categories" value={v('testCategories')} icon={ListAltIcon} color="#388e3c" to="/test-categories" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Tests" value={v('tests')} icon={QuizIcon} color="#f57c00" to="/tests" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Users" value={v('users')} icon={PeopleIcon} color="#7b1fa2" to="/users" />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" sx={{ mb: 1.5 }}>TOEFL</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Reading Sections" value={v('toeflReading')} icon={MenuBookIcon} color="#0277bd" to="/toefl-reading" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Listening Sections" value={v('toeflListening')} icon={HeadphonesIcon} color="#00695c" to="/toefl-listening" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Speaking" value="-" icon={RecordVoiceOverIcon} color="#4527a0" to="/toefl-speaking" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Writing" value="-" icon={EditNoteIcon} color="#bf360c" to="/toefl-writing" />
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ mt: 3, mb: 1.5 }}>IELTS</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Reading Sections" value={v('ieltsReading')} icon={MenuBookIcon} color="#1565c0" to="/ielts-reading" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Listening Sections" value={v('ieltsListening')} icon={HeadphonesIcon} color="#2e7d32" to="/ielts-listening" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Speaking" value="-" icon={RecordVoiceOverIcon} color="#6a1b9a" to="/ielts-speaking" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Writing" value="-" icon={EditNoteIcon} color="#e65100" to="/ielts-writing" />
        </Grid>
      </Grid>

      <Card sx={{ mt: 4 }}>
        <CardHeader title="Quick Guide" />
        <CardContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Use the sidebar to navigate between sections. Resources are organized into groups:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>Content Management</Typography>
              <Typography variant="body2" color="text.secondary">
                Manage categories, test categories, individual tests, difficulty levels, and supported languages.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>Users &amp; Access</Typography>
              <Typography variant="body2" color="text.secondary">
                Manage users, admins, membership plans, access rules, and view user activity history.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>TOEFL</Typography>
              <Typography variant="body2" color="text.secondary">
                Manage reading sections, passages, questions, listening sections, parts, questions, speaking and writing tests.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>IELTS</Typography>
              <Typography variant="body2" color="text.secondary">
                Manage reading sections with questions, listening sections, speaking and writing tests.
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;
