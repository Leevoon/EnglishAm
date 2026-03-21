import React, { useState, useEffect, useCallback } from 'react';
import {
  useDataProvider, useNotify, Title,
  Create, SimpleForm, TextInput, NumberInput, SelectInput, required,
} from 'react-admin';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, Card, CardContent, CardHeader, Typography, Chip,
  Table, TableHead, TableBody, TableRow, TableCell,
  TextField, Button, Switch, FormControlLabel,
  Stack, CircularProgress, Alert,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import { stripHtml, QuestionAccordion } from '../../components';

// === COMBINED LIST ===
export const IeltsListeningList = () => {
  const dataProvider = useDataProvider();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const [sectionsRes, questionsRes] = await Promise.all([
        dataProvider.getList('ielts-listening', { pagination: { page: 1, perPage: 1000 }, sort: { field: 'sort_order', order: 'ASC' }, filter: {} }),
        dataProvider.getList('ielts-listening-questions', { pagination: { page: 1, perPage: 1000 }, sort: { field: 'id', order: 'ASC' }, filter: {} }).catch(() => ({ data: [] })),
      ]);
      const qCountMap = {};
      questionsRes.data.forEach(q => {
        qCountMap[q.ielts_listening_id] = (qCountMap[q.ielts_listening_id] || 0) + 1;
      });
      setRows(sectionsRes.data.map(s => ({
        ...s,
        questionCount: qCountMap[s.id] || 0,
      })));
      setLoading(false);
    };
    fetchAll().catch(() => setLoading(false));
  }, [dataProvider]);

  if (loading) return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>;

  return (
    <Box>
      <Title title="IELTS Listening" />
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">IELTS Listening Sections</Typography>
        <Button variant="contained" startIcon={<AddIcon />} component={RouterLink} to="/ielts-listening/create">
          New Section
        </Button>
      </Box>
      <Card sx={{ mx: 2, mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell width={50}>ID</TableCell>
              <TableCell width={180}>Section Name</TableCell>
              <TableCell>Audio</TableCell>
              <TableCell width={90} align="center">Questions</TableCell>
              <TableCell width={80} align="center">Status</TableCell>
              <TableCell width={60} align="center">Order</TableCell>
              <TableCell width={60}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.id} hover sx={{ cursor: 'pointer' }} onClick={() => navigate(`/ielts-listening/${row.id}`)}>
                <TableCell>{row.id}</TableCell>
                <TableCell><strong>{row.name}</strong></TableCell>
                <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {row.listening_audio || '-'}
                </TableCell>
                <TableCell align="center">
                  <Chip label={row.questionCount} size="small" color={row.questionCount > 0 ? 'primary' : 'default'} variant={row.questionCount > 0 ? 'filled' : 'outlined'} />
                </TableCell>
                <TableCell align="center">
                  <Chip label={row.status === 1 ? 'Active' : 'Inactive'} color={row.status === 1 ? 'success' : 'default'} size="small" variant={row.status === 1 ? 'filled' : 'outlined'} />
                </TableCell>
                <TableCell align="center">{row.sort_order}</TableCell>
                <TableCell><EditIcon fontSize="small" color="action" /></TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4 }}><Typography color="text.secondary">No sections found</Typography></TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </Box>
  );
};

// === COMBINED EDIT ===
export const IeltsListeningEdit = () => {
  const { id } = useParams();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const navigate = useNavigate();

  const [section, setSection] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});

  const fetchData = useCallback(async () => {
    try {
      const { data: sectionData } = await dataProvider.getOne('ielts-listening', { id });
      setSection(sectionData);

      const { data: qs } = await dataProvider.getList('ielts-listening-questions', {
        pagination: { page: 1, perPage: 1000 }, sort: { field: 'sort_order', order: 'ASC' },
        filter: { ielts_listening_id: id },
      }).catch(() => ({ data: [] }));

      const fullQuestions = await Promise.all(
        qs.map(q => dataProvider.getOne('ielts-listening-questions', { id: q.id }).then(r => r.data).catch(() => q))
      );
      setQuestions(fullQuestions);
      setLoading(false);
    } catch (error) {
      notify('Error loading data', { type: 'error' });
      setLoading(false);
    }
  }, [id, dataProvider, notify]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const saveSection = async () => {
    setSaving(p => ({ ...p, section: true }));
    try {
      await dataProvider.update('ielts-listening', { id: section.id, data: section, previousData: section });
      notify('Section saved', { type: 'success' });
    } catch (e) { notify('Error saving section', { type: 'error' }); }
    setSaving(p => ({ ...p, section: false }));
  };

  const saveQuestion = async (questionData) => {
    const qId = questionData.id;
    setSaving(p => ({ ...p, [`q_${qId}`]: true }));
    try {
      await dataProvider.update('ielts-listening-questions', { id: qId, data: questionData, previousData: questions.find(q => q.id === qId) });
      setQuestions(prev => prev.map(q => q.id === qId ? questionData : q));
      notify('Question saved', { type: 'success' });
    } catch (e) { notify('Error saving question', { type: 'error' }); }
    setSaving(p => ({ ...p, [`q_${qId}`]: false }));
  };

  const addQuestion = async () => {
    setSaving(p => ({ ...p, addQ: true }));
    try {
      const { data } = await dataProvider.create('ielts-listening-questions', {
        data: { ielts_listening_id: parseInt(id), question: '', sentences: '', listening_audio: '', sort_order: questions.length, answers: [] },
      });
      const { data: fullQ } = await dataProvider.getOne('ielts-listening-questions', { id: data.id }).catch(() => ({ data }));
      setQuestions(prev => [...prev, fullQ]);
      notify('Question added', { type: 'success' });
    } catch (e) { notify('Error adding question', { type: 'error' }); }
    setSaving(p => ({ ...p, addQ: false }));
  };

  const deleteQuestion = async (qId) => {
    try {
      await dataProvider.delete('ielts-listening-questions', { id: qId, previousData: questions.find(q => q.id === qId) });
      setQuestions(prev => prev.filter(q => q.id !== qId));
      notify('Question deleted', { type: 'success' });
    } catch (e) { notify('Error deleting question', { type: 'error' }); }
  };

  if (loading) return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>;
  if (!section) return <Alert severity="error" sx={{ m: 2 }}>Section not found</Alert>;

  return (
    <Box key={id}>
      <Title title={`IELTS Listening: ${section.name}`} />
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/ielts-listening')}>Back</Button>
        <Typography variant="h5" sx={{ flex: 1 }}>{section.name}</Typography>
      </Box>

      {/* Section Details */}
      <Card sx={{ mx: 2, mb: 2 }}>
        <CardHeader title="Section Details" titleTypographyProps={{ variant: 'h6' }} />
        <CardContent>
          <Stack spacing={2}>
            <TextField label="Name" value={section.name || ''} onChange={e => setSection(prev => ({ ...prev, name: e.target.value }))} fullWidth />
            <TextField label="Audio File URL" value={section.listening_audio || ''} onChange={e => setSection(prev => ({ ...prev, listening_audio: e.target.value }))} fullWidth />
            <TextField label="Image URL" value={section.image || ''} onChange={e => setSection(prev => ({ ...prev, image: e.target.value }))} fullWidth />
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField label="Sort Order" type="number" value={section.sort_order ?? 0} onChange={e => setSection(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))} sx={{ width: 150 }} />
              <FormControlLabel
                control={<Switch checked={section.status === 1} onChange={e => setSection(prev => ({ ...prev, status: e.target.checked ? 1 : 0 }))} />}
                label={section.status === 1 ? 'Active' : 'Inactive'}
              />
            </Stack>
            <Button variant="contained" startIcon={saving.section ? <CircularProgress size={16} /> : <SaveIcon />} onClick={saveSection} disabled={saving.section} sx={{ alignSelf: 'flex-start' }}>
              Save Section
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Questions */}
      <Card sx={{ mx: 2, mb: 2 }}>
        <CardHeader
          title={`Questions (${questions.length})`}
          titleTypographyProps={{ variant: 'h6' }}
          action={
            <Button startIcon={saving.addQ ? <CircularProgress size={16} /> : <AddIcon />} onClick={addQuestion} disabled={saving.addQ}>
              Add Question
            </Button>
          }
        />
        <CardContent>
          {questions.length === 0 ? (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>No questions yet.</Typography>
          ) : (
            questions.map((q, idx) => (
              <QuestionAccordion
                key={q.id}
                question={q}
                index={idx}
                saving={saving[`q_${q.id}`]}
                onSave={saveQuestion}
                onDelete={deleteQuestion}
                questionField="question"
                answerTextField="answer"
                extraFields={[
                  { name: 'sentences', label: 'Sentences', multiline: true },
                  { name: 'listening_audio', label: 'Audio File URL' },
                ]}
              />
            ))
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

// === CREATE ===
export const IeltsListeningCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" validate={required()} fullWidth />
      <TextInput source="listening_audio" label="Audio File" fullWidth />
      <TextInput source="image" label="Image" fullWidth />
      <SelectInput source="status" choices={[
        { id: 1, name: 'Active' },
        { id: 0, name: 'Inactive' },
      ]} defaultValue={1} />
      <NumberInput source="sort_order" label="Order" defaultValue={0} />
    </SimpleForm>
  </Create>
);
