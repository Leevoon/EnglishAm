import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import { stripHtml, RichTextEditor, QuestionAccordion } from '../../components';

// === COMBINED LIST ===
export const ToeflReadingList = () => {
  const dataProvider = useDataProvider();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const [sectionsRes, passagesRes, questionsRes] = await Promise.all([
        dataProvider.getList('toefl-reading', { pagination: { page: 1, perPage: 1000 }, sort: { field: 'sort_order', order: 'ASC' }, filter: {} }),
        dataProvider.getList('toefl-reading-tests', { pagination: { page: 1, perPage: 1000 }, sort: { field: 'id', order: 'ASC' }, filter: {} }),
        dataProvider.getList('toefl-reading-questions', { pagination: { page: 1, perPage: 1000 }, sort: { field: 'id', order: 'ASC' }, filter: {} }),
      ]);
      const passageMap = {};
      passagesRes.data.forEach(p => { passageMap[p.toefl_reding_id] = p; });
      const qCountMap = {};
      questionsRes.data.forEach(q => {
        qCountMap[q.toefl_reading_test_id] = (qCountMap[q.toefl_reading_test_id] || 0) + 1;
      });
      setRows(sectionsRes.data.map(s => ({
        ...s,
        passagePreview: passageMap[s.id] ? stripHtml(passageMap[s.id].text).substring(0, 150) : '(no passage)',
        questionCount: passageMap[s.id] ? (qCountMap[passageMap[s.id].id] || 0) : 0,
      })));
      setLoading(false);
    };
    fetchAll().catch(() => setLoading(false));
  }, [dataProvider]);

  if (loading) return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>;

  return (
    <Box>
      <Title title="TOEFL Reading" />
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">TOEFL Reading Sections</Typography>
        <Button variant="contained" startIcon={<AddIcon />} component={RouterLink} to="/toefl-reading/create">
          New Section
        </Button>
      </Box>
      <Card sx={{ mx: 2, mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell width={50}>ID</TableCell>
              <TableCell width={180}>Section Name</TableCell>
              <TableCell>Passage Preview</TableCell>
              <TableCell width={90} align="center">Questions</TableCell>
              <TableCell width={80} align="center">Status</TableCell>
              <TableCell width={60} align="center">Order</TableCell>
              <TableCell width={60}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.id} hover sx={{ cursor: 'pointer' }} onClick={() => navigate(`/toefl-reading/${row.id}`)}>
                <TableCell>{row.id}</TableCell>
                <TableCell><strong>{row.name}</strong></TableCell>
                <TableCell sx={{ maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'text.secondary', fontSize: '0.85rem' }}>
                  {row.passagePreview}
                </TableCell>
                <TableCell align="center">
                  <Chip label={row.questionCount} size="small" color={row.questionCount > 0 ? 'primary' : 'default'} variant={row.questionCount > 0 ? 'filled' : 'outlined'} />
                </TableCell>
                <TableCell align="center">
                  <Chip label={row.status === 1 ? 'Active' : 'Inactive'} color={row.status === 1 ? 'success' : 'default'} size="small" variant={row.status === 1 ? 'filled' : 'outlined'} />
                </TableCell>
                <TableCell align="center">{row.sort_order}</TableCell>
                <TableCell>
                  <EditIcon fontSize="small" color="action" />
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No sections found</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </Box>
  );
};

// === COMBINED EDIT ===
export const ToeflReadingEdit = () => {
  const { id } = useParams();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const navigate = useNavigate();

  const [section, setSection] = useState(null);
  const [passage, setPassage] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const passageTextRef = useRef('');

  const fetchData = useCallback(async () => {
    try {
      const { data: sectionData } = await dataProvider.getOne('toefl-reading', { id });
      setSection(sectionData);

      const { data: passages } = await dataProvider.getList('toefl-reading-tests', {
        pagination: { page: 1, perPage: 1000 }, sort: { field: 'id', order: 'ASC' },
        filter: { toefl_reding_id: id },
      });
      const p = passages[0] || null;
      setPassage(p);
      passageTextRef.current = p?.text || '';

      if (p) {
        const { data: qs } = await dataProvider.getList('toefl-reading-questions', {
          pagination: { page: 1, perPage: 1000 }, sort: { field: 'sort_order', order: 'ASC' },
          filter: { toefl_reading_test_id: p.id },
        });
        const fullQuestions = await Promise.all(
          qs.map(q => dataProvider.getOne('toefl-reading-questions', { id: q.id }).then(r => r.data))
        );
        setQuestions(fullQuestions);
      }
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
      await dataProvider.update('toefl-reading', { id: section.id, data: section, previousData: section });
      notify('Section saved', { type: 'success' });
    } catch (e) { notify('Error saving section', { type: 'error' }); }
    setSaving(p => ({ ...p, section: false }));
  };

  const savePassage = async () => {
    setSaving(p => ({ ...p, passage: true }));
    try {
      const data = { ...passage, text: passageTextRef.current };
      await dataProvider.update('toefl-reading-tests', { id: passage.id, data, previousData: passage });
      setPassage(data);
      notify('Passage saved', { type: 'success' });
    } catch (e) { notify('Error saving passage', { type: 'error' }); }
    setSaving(p => ({ ...p, passage: false }));
  };

  const createPassage = async () => {
    setSaving(p => ({ ...p, passage: true }));
    try {
      const { data } = await dataProvider.create('toefl-reading-tests', {
        data: { toefl_reding_id: parseInt(id), text: '<p></p>', status: 1, sort_order: 0 },
      });
      setPassage(data);
      passageTextRef.current = data.text || '';
      notify('Passage created', { type: 'success' });
    } catch (e) { notify('Error creating passage', { type: 'error' }); }
    setSaving(p => ({ ...p, passage: false }));
  };

  const saveQuestion = async (questionData) => {
    const qId = questionData.id;
    setSaving(p => ({ ...p, [`q_${qId}`]: true }));
    try {
      await dataProvider.update('toefl-reading-questions', { id: qId, data: questionData, previousData: questions.find(q => q.id === qId) });
      setQuestions(prev => prev.map(q => q.id === qId ? questionData : q));
      notify('Question saved', { type: 'success' });
    } catch (e) { notify('Error saving question', { type: 'error' }); }
    setSaving(p => ({ ...p, [`q_${qId}`]: false }));
  };

  const addQuestion = async () => {
    if (!passage) return;
    setSaving(p => ({ ...p, addQ: true }));
    try {
      const { data } = await dataProvider.create('toefl-reading-questions', {
        data: { toefl_reading_test_id: passage.id, text: '', status: 1, sort_order: questions.length, answers: [] },
      });
      const { data: fullQ } = await dataProvider.getOne('toefl-reading-questions', { id: data.id });
      setQuestions(prev => [...prev, fullQ]);
      notify('Question added', { type: 'success' });
    } catch (e) { notify('Error adding question', { type: 'error' }); }
    setSaving(p => ({ ...p, addQ: false }));
  };

  const deleteQuestion = async (qId) => {
    try {
      await dataProvider.delete('toefl-reading-questions', { id: qId, previousData: questions.find(q => q.id === qId) });
      setQuestions(prev => prev.filter(q => q.id !== qId));
      notify('Question deleted', { type: 'success' });
    } catch (e) { notify('Error deleting question', { type: 'error' }); }
  };

  if (loading) return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>;
  if (!section) return <Alert severity="error" sx={{ m: 2 }}>Section not found</Alert>;

  return (
    <Box key={id}>
      <Title title={`TOEFL Reading: ${section.name}`} />
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/toefl-reading')}>Back</Button>
        <Typography variant="h5" sx={{ flex: 1 }}>{section.name}</Typography>
      </Box>

      {/* Section Details */}
      <Card sx={{ mx: 2, mb: 2 }}>
        <CardHeader title="Section Details" titleTypographyProps={{ variant: 'h6' }} />
        <CardContent>
          <Stack spacing={2}>
            <TextField label="Name" value={section.name || ''} onChange={e => setSection(prev => ({ ...prev, name: e.target.value }))} fullWidth />
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

      {/* Passage Text */}
      <Card sx={{ mx: 2, mb: 2 }}>
        <CardHeader title="Passage Text" titleTypographyProps={{ variant: 'h6' }} />
        <CardContent>
          {passage ? (
            <Stack spacing={2}>
              <RichTextEditor key={passage.id} initialValue={passage.text} onChange={val => { passageTextRef.current = val; }} />
              <Stack direction="row" spacing={2} alignItems="center">
                <FormControlLabel
                  control={<Switch checked={passage.status === 1} onChange={e => setPassage(prev => ({ ...prev, status: e.target.checked ? 1 : 0 }))} />}
                  label={passage.status === 1 ? 'Active' : 'Inactive'}
                />
                <TextField label="Sort Order" type="number" value={passage.sort_order ?? 0} onChange={e => setPassage(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))} sx={{ width: 150 }} size="small" />
              </Stack>
              <Button variant="contained" startIcon={saving.passage ? <CircularProgress size={16} /> : <SaveIcon />} onClick={savePassage} disabled={saving.passage} sx={{ alignSelf: 'flex-start' }}>
                Save Passage
              </Button>
            </Stack>
          ) : (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography color="text.secondary" gutterBottom>No passage yet for this section.</Typography>
              <Button variant="contained" startIcon={<AddIcon />} onClick={createPassage} disabled={saving.passage}>
                Create Passage
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Questions */}
      <Card sx={{ mx: 2, mb: 2 }}>
        <CardHeader
          title={`Questions (${questions.length})`}
          titleTypographyProps={{ variant: 'h6' }}
          action={
            <Button startIcon={saving.addQ ? <CircularProgress size={16} /> : <AddIcon />} onClick={addQuestion} disabled={!passage || saving.addQ}>
              Add Question
            </Button>
          }
        />
        <CardContent>
          {questions.length === 0 ? (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
              {passage ? 'No questions yet. Click "Add Question" to create one.' : 'Create a passage first to add questions.'}
            </Typography>
          ) : (
            questions.map((q, idx) => (
              <QuestionAccordion
                key={q.id}
                question={q}
                index={idx}
                saving={saving[`q_${q.id}`]}
                onSave={saveQuestion}
                onDelete={deleteQuestion}
                questionField="text"
                answerTextField="text"
                answerExplanationField="answer_question"
              />
            ))
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

// === CREATE ===
export const ToeflReadingCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" validate={required()} fullWidth />
      <SelectInput source="status" choices={[
        { id: 1, name: 'Active' },
        { id: 0, name: 'Inactive' },
      ]} defaultValue={1} />
      <NumberInput source="sort_order" label="Order" defaultValue={0} />
    </SimpleForm>
  </Create>
);
