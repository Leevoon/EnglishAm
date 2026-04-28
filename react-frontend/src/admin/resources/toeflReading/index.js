import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  useDataProvider, useNotify, Title,
  Create, SimpleForm, TextInput, NumberInput, SelectInput, required,
} from 'react-admin';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, Card, CardContent, CardHeader, Typography, Chip,
  Table, TableHead, TableBody, TableRow, TableCell, Divider,
  TextField, Button, Switch, FormControlLabel, MenuItem,
  Stack, CircularProgress, Alert,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { stripHtml, RichTextEditor, QuestionAccordion, AccessLevelChip, ACCESS_LEVELS } from '../../components';

// === COMBINED LIST ===
export const ToeflReadingList = () => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
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
      const passagesBySection = {};
      passagesRes.data.forEach(p => {
        if (!passagesBySection[p.toefl_reding_id]) passagesBySection[p.toefl_reding_id] = [];
        passagesBySection[p.toefl_reding_id].push(p);
      });
      const qCountMap = {};
      questionsRes.data.forEach(q => {
        qCountMap[q.toefl_reading_test_id] = (qCountMap[q.toefl_reading_test_id] || 0) + 1;
      });
      setRows(sectionsRes.data.map(s => {
        const sectionPassages = passagesBySection[s.id] || [];
        const firstText = sectionPassages[0]?.text;
        return {
          ...s,
          passagePreview: firstText ? stripHtml(firstText).substring(0, 150) : '(no passage)',
          passageCount: sectionPassages.length,
          questionCount: sectionPassages.reduce((sum, p) => sum + (qCountMap[p.id] || 0), 0),
        };
      }));
      setLoading(false);
    };
    fetchAll().catch(() => setLoading(false));
  }, [dataProvider]);

  const handleDelete = async (e, row) => {
    e.stopPropagation();
    if (!window.confirm(`Delete section "${row.name}" and all its passages/questions?`)) return;
    try {
      await dataProvider.delete('toefl-reading', { id: row.id, previousData: row });
      setRows(prev => prev.filter(r => r.id !== row.id));
      notify('Section deleted', { type: 'success' });
    } catch (err) { notify('Error deleting section', { type: 'error' }); }
  };

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
              <TableCell width={80} align="center">Access</TableCell>
              <TableCell width={80} align="center">Status</TableCell>
              <TableCell width={60} align="center">Order</TableCell>
              <TableCell width={90}></TableCell>
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
                  <AccessLevelChip level={row.required_level} />
                </TableCell>
                <TableCell align="center">
                  <Chip label={row.status === 1 ? 'Active' : 'Inactive'} color={row.status === 1 ? 'success' : 'default'} size="small" variant={row.status === 1 ? 'filled' : 'outlined'} />
                </TableCell>
                <TableCell align="center">{row.sort_order}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5}>
                    <EditIcon fontSize="small" color="action" />
                    <DeleteIcon fontSize="small" color="error" sx={{ cursor: 'pointer' }} onClick={(e) => handleDelete(e, row)} />
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
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
  const [passages, setPassages] = useState([]);
  const [questionsByPassage, setQuestionsByPassage] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const passageTextRefs = useRef({});

  const fetchData = useCallback(async () => {
    try {
      const { data: sectionData } = await dataProvider.getOne('toefl-reading', { id });
      setSection(sectionData);

      const { data: passageList } = await dataProvider.getList('toefl-reading-tests', {
        pagination: { page: 1, perPage: 1000 }, sort: { field: 'id', order: 'ASC' },
        filter: { toefl_reding_id: id },
      });
      setPassages(passageList);
      passageTextRefs.current = {};
      passageList.forEach(p => { passageTextRefs.current[p.id] = p.text || ''; });

      const qByPassage = {};
      await Promise.all(passageList.map(async (p) => {
        const { data: qs } = await dataProvider.getList('toefl-reading-questions', {
          pagination: { page: 1, perPage: 1000 }, sort: { field: 'sort_order', order: 'ASC' },
          filter: { toefl_reading_test_id: p.id },
        });
        const fullQuestions = await Promise.all(
          qs.map(q => dataProvider.getOne('toefl-reading-questions', { id: q.id }).then(r => r.data))
        );
        qByPassage[p.id] = fullQuestions;
      }));
      setQuestionsByPassage(qByPassage);
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

  const updatePassageField = (passageId, field, value) => {
    setPassages(prev => prev.map(p => p.id === passageId ? { ...p, [field]: value } : p));
  };

  const savePassage = async (passageId) => {
    const passage = passages.find(p => p.id === passageId);
    if (!passage) return;
    setSaving(p => ({ ...p, [`p_${passageId}`]: true }));
    try {
      const data = { ...passage, text: passageTextRefs.current[passageId] ?? passage.text };
      await dataProvider.update('toefl-reading-tests', { id: passageId, data, previousData: passage });
      setPassages(prev => prev.map(p => p.id === passageId ? data : p));
      notify('Passage saved', { type: 'success' });
    } catch (e) { notify('Error saving passage', { type: 'error' }); }
    setSaving(p => ({ ...p, [`p_${passageId}`]: false }));
  };

  const createPassage = async () => {
    setSaving(p => ({ ...p, addPassage: true }));
    try {
      const { data } = await dataProvider.create('toefl-reading-tests', {
        data: { toefl_reding_id: parseInt(id), text: '<p></p>', status: 1, sort_order: passages.length },
      });
      setPassages(prev => [...prev, data]);
      passageTextRefs.current[data.id] = data.text || '';
      setQuestionsByPassage(prev => ({ ...prev, [data.id]: [] }));
      notify('Passage created', { type: 'success' });
    } catch (e) { notify('Error creating passage', { type: 'error' }); }
    setSaving(p => ({ ...p, addPassage: false }));
  };

  const deletePassage = async (passageId) => {
    if (!window.confirm('Delete this passage and all its questions?')) return;
    try {
      await dataProvider.delete('toefl-reading-tests', { id: passageId, previousData: passages.find(p => p.id === passageId) });
      setPassages(prev => prev.filter(p => p.id !== passageId));
      setQuestionsByPassage(prev => {
        const next = { ...prev };
        delete next[passageId];
        return next;
      });
      delete passageTextRefs.current[passageId];
      notify('Passage deleted', { type: 'success' });
    } catch (e) { notify('Error deleting passage', { type: 'error' }); }
  };

  const saveQuestion = (passageId) => async (questionData) => {
    const qId = questionData.id;
    setSaving(p => ({ ...p, [`q_${qId}`]: true }));
    try {
      const prevQ = (questionsByPassage[passageId] || []).find(q => q.id === qId);
      await dataProvider.update('toefl-reading-questions', { id: qId, data: questionData, previousData: prevQ });
      setQuestionsByPassage(prev => ({
        ...prev,
        [passageId]: (prev[passageId] || []).map(q => q.id === qId ? questionData : q),
      }));
      notify('Question saved', { type: 'success' });
    } catch (e) { notify('Error saving question', { type: 'error' }); }
    setSaving(p => ({ ...p, [`q_${qId}`]: false }));
  };

  const addQuestion = async (passageId) => {
    setSaving(p => ({ ...p, [`addQ_${passageId}`]: true }));
    try {
      const existing = questionsByPassage[passageId] || [];
      const { data } = await dataProvider.create('toefl-reading-questions', {
        data: { toefl_reading_test_id: passageId, text: '', status: 1, sort_order: existing.length, answers: [] },
      });
      const { data: fullQ } = await dataProvider.getOne('toefl-reading-questions', { id: data.id });
      setQuestionsByPassage(prev => ({ ...prev, [passageId]: [...(prev[passageId] || []), fullQ] }));
      notify('Question added', { type: 'success' });
    } catch (e) { notify('Error adding question', { type: 'error' }); }
    setSaving(p => ({ ...p, [`addQ_${passageId}`]: false }));
  };

  const deleteQuestion = (passageId) => async (qId) => {
    try {
      const prevQ = (questionsByPassage[passageId] || []).find(q => q.id === qId);
      await dataProvider.delete('toefl-reading-questions', { id: qId, previousData: prevQ });
      setQuestionsByPassage(prev => ({
        ...prev,
        [passageId]: (prev[passageId] || []).filter(q => q.id !== qId),
      }));
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
              <TextField select label="Access Level" value={section.required_level ?? 0} onChange={e => setSection(prev => ({ ...prev, required_level: parseInt(e.target.value) }))} sx={{ width: 150 }}>
                {ACCESS_LEVELS.map(al => <MenuItem key={al.value} value={al.value}>{al.label}</MenuItem>)}
              </TextField>
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

      {/* Passages */}
      {passages.length === 0 ? (
        <Card sx={{ mx: 2, mb: 2 }}>
          <CardHeader title="Passages" titleTypographyProps={{ variant: 'h6' }} />
          <CardContent>
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography color="text.secondary" gutterBottom>No passages yet for this section.</Typography>
              <Button variant="contained" startIcon={<AddIcon />} onClick={createPassage} disabled={saving.addPassage}>
                Create Passage
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
        passages.map((passage, pIdx) => {
          const pQuestions = questionsByPassage[passage.id] || [];
          return (
            <Card key={passage.id} sx={{ mx: 2, mb: 2 }}>
              <CardHeader
                title={`Passage #${pIdx + 1}`}
                titleTypographyProps={{ variant: 'h6' }}
                action={
                  <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => deletePassage(passage.id)}>
                    Delete Passage
                  </Button>
                }
              />
              <CardContent>
                <Stack spacing={2}>
                  <RichTextEditor
                    key={passage.id}
                    initialValue={passage.text}
                    onChange={val => { passageTextRefs.current[passage.id] = val; }}
                  />
                  <Stack direction="row" spacing={2} alignItems="center">
                    <FormControlLabel
                      control={<Switch checked={passage.status === 1} onChange={e => updatePassageField(passage.id, 'status', e.target.checked ? 1 : 0)} />}
                      label={passage.status === 1 ? 'Active' : 'Inactive'}
                    />
                    <TextField label="Sort Order" type="number" value={passage.sort_order ?? 0} onChange={e => updatePassageField(passage.id, 'sort_order', parseInt(e.target.value) || 0)} sx={{ width: 150 }} size="small" />
                  </Stack>
                  <Button variant="contained" startIcon={saving[`p_${passage.id}`] ? <CircularProgress size={16} /> : <SaveIcon />} onClick={() => savePassage(passage.id)} disabled={saving[`p_${passage.id}`]} sx={{ alignSelf: 'flex-start' }}>
                    Save Passage
                  </Button>

                  <Divider sx={{ my: 1 }} />

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1">Questions ({pQuestions.length})</Typography>
                    <Button size="small" startIcon={saving[`addQ_${passage.id}`] ? <CircularProgress size={16} /> : <AddIcon />} onClick={() => addQuestion(passage.id)} disabled={saving[`addQ_${passage.id}`]}>
                      Add Question
                    </Button>
                  </Box>
                  {pQuestions.length === 0 ? (
                    <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                      No questions yet. Click "Add Question" to create one.
                    </Typography>
                  ) : (
                    pQuestions.map((q, idx) => (
                      <QuestionAccordion
                        key={q.id}
                        question={q}
                        index={idx}
                        saving={saving[`q_${q.id}`]}
                        onSave={saveQuestion(passage.id)}
                        onDelete={deleteQuestion(passage.id)}
                        questionField="text"
                        answerTextField="text"
                        answerExplanationField="answer_question"
                      />
                    ))
                  )}
                </Stack>
              </CardContent>
            </Card>
          );
        })
      )}

      {passages.length > 0 && (
        <Box sx={{ px: 2, mb: 2 }}>
          <Button variant="outlined" startIcon={saving.addPassage ? <CircularProgress size={16} /> : <AddIcon />} onClick={createPassage} disabled={saving.addPassage}>
            Add Another Passage
          </Button>
        </Box>
      )}
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
