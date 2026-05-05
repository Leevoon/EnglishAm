import React, { useState } from 'react';
import { useLogin, useNotify, Notification } from 'react-admin';
import { Box, Button, Card, CardContent, TextField, Typography } from '@mui/material';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const login = useLogin();
  const notify = useNotify();

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      // react-admin's authProvider.login signature is { username, password };
      // we map username → email internally in authProvider.
      await login({ username: email, password });
    } catch (err) {
      notify(err && err.message ? err.message : 'Invalid credentials', { type: 'warning' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f4f6f8' }}>
      <Card sx={{ minWidth: 380, p: 1 }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 1 }}>english.am admin</Typography>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            Sign in with your admin credentials.
          </Typography>
          <Box component="form" onSubmit={submit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Email" type="email" value={email}
              onChange={(e) => setEmail(e.target.value)} required autoFocus
            />
            <TextField
              label="Password" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)} required
            />
            <Button type="submit" variant="contained" disabled={busy}>
              {busy ? 'Signing in…' : 'Sign in'}
            </Button>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Demo: admin@english.am / demo
            </Typography>
          </Box>
        </CardContent>
      </Card>
      <Notification />
    </Box>
  );
}
