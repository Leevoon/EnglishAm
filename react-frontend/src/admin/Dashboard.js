import React, { useEffect, useState } from 'react';
import { Title } from 'react-admin';
import { Card, CardContent, CardHeader, Grid, Typography, Box } from '@mui/material';
import api from '../services/api';

const GROUPS = {
  Overview: ['categories', 'test_categories', 'tests', 'users', 'unread_messages'],
  TOEFL: ['toefl_reading', 'toefl_listening', 'toefl_speaking', 'toefl_writing'],
  IELTS: ['ielts_reading', 'ielts_listening', 'ielts_speaking', 'ielts_writing'],
};
const LABELS = {
  categories: 'Categories',
  test_categories: 'Tests (catalog)',
  tests: 'Test questions',
  users: 'Users',
  unread_messages: 'Unread messages',
  toefl_reading: 'Reading sections',
  toefl_listening: 'Listening sections',
  toefl_speaking: 'Speaking',
  toefl_writing: 'Writing',
  ielts_reading: 'Reading sections',
  ielts_listening: 'Listening sections',
  ielts_speaking: 'Speaking',
  ielts_writing: 'Writing',
};

export default function Dashboard() {
  const [counts, setCounts] = useState({});
  useEffect(() => { api.get('/admin/dashboard').then((r) => setCounts(r.data || {})).catch(() => setCounts({})); }, []);
  return (
    <Box sx={{ p: 2 }}>
      <Title title="Dashboard" />
      <Typography variant="h5" sx={{ mb: 2 }}>Welcome — english.am admin</Typography>
      {Object.entries(GROUPS).map(([group, keys]) => (
        <Box key={group} sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>{group}</Typography>
          <Grid container spacing={2}>
            {keys.map((k) => (
              <Grid item xs={12} sm={6} md={3} key={k}>
                <Card><CardHeader title={LABELS[k]} /><CardContent><Typography variant="h4">{counts[k] || 0}</Typography></CardContent></Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
      <Card sx={{ mt: 2 }}>
        <CardHeader title="Quick guide" />
        <CardContent>
          <Typography variant="body2">
            Use the sidebar to manage every catalog, test, user, and CMS resource.
            All resources follow the same List → Edit / Create pattern.
            Multilingual labels live in their dedicated *-labels resources.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
