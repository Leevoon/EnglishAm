import React, { useState, useEffect, useCallback } from 'react';
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
import { stripHtml, QuestionAccordion, AccessLevelChip, ACCESS_LEVELS } from '../../components';

// === COMBINED LIST ===
export const ToeflListeningList = () => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const [sectionsRes, partsRes, questionsRes] = await Promise.all([
        dataProvider.getList('toefl-listening', { pagination: { page: 1, perPage: 1000 }, sort: { field: 'sort_order', order: 'ASC' }, filter: {} }),
        dataProvider.getList('toefl-listening-tests', { pagination: { page: 1, perPage: 1000 }, sort: { field: 'id', order: 'ASC' }, filter: {} }),
        dataProvider.getList('toefl-listening-questions', { pagination: { page: 1, perPage: 1000 }, sort: { field: 'id', order: 'ASC' }, filter: {} }),
      ]);
      const partsBySection = {};
      partsRes.data.forEach(p => {
        if (!partsBySection[p.toefl_listening_id]) partsBySection[p.toefl_listening_id] = [];
        partsBySection[p.toefl_listening_id].push(p);
      });
      const qCountMap = {};
      questionsRes.data.forEach(q => {
        qCountMap[q.toefl_listening_test_id] = (qCountMap[q.toefl_listening_test_id] || 0) + 1;
      });
      setRows(sectionsRes.data.map(s => {
        const sectionParts = partsBySection[s.id] || [];
        return {
          ...s,
          partAudio: sectionParts[0]?.audio || '-',
          partCount: sectionParts.length,
          questionCount: sectionParts.reduce((sum, p) => sum + (qCountMap[p.id] || 0), 0),
        };
      }));
      setLoading(false);
    };
    fetchAll().catch(() => setLoading(false));
  }, [dataProvider]);

  const handleDelete = async (e, row) => {
    e.stopPropagation();
    if (!window.confirm(`Delete section "${row.name}" and all its parts/questions?`)) return;
    try {
      await dataProvider.delete('toefl-listening', { id: row.id, previousData: row });
      setRows(prev => prev.filter(r => r.id !== row.id));
      notify('Section deleted', { type: 'success' });
    } catch (err) { notify('Error deleting section', { type: 'error' }); }
  };

  if (loading) return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>;

  return (
    <Box>
      <Title title="TOEFL Listening" />
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">TOEFL Listening Sections</Typography>
        <Button variant="contained" startIcon={<AddIcon />} component={RouterLink} to="/toefl-listening/create">
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
              <TableCell width={80} align="center">Access</TableCell>
              <TableCell width={80} align="center">Status</TableCell>
              <TableCell width={60} align="center">Order</TableCell>
              <TableCell width={90}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.id} hover sx={{ cursor: 'pointer' }} onClick={() => navigate(`/toefl-listening/${row.id}`)}>
                <TableCell>{row.id}</TableCell>
                <TableCell><strong>{row.name}</strong></TableCell>
                <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {row.partAudio}
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
              <TableRow><TableCell colSpan={8} align="center" sx={{ py: 4 }}><Typography color="text.secondary">No sections found</Typography></TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </Box>
  );
};

// === COMBINED EDIT ===
export const ToeflListeningEdit = () => {
  const { id } = useParams();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const navigate = useNavigate();

  const [section, setSection] = useState(null);
  const [parts, setParts] = useState([]);
  const [questionsByPart, setQuestionsByPart] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});

  const fetchData = useCallback(async () => {
    try {
      const { data: sectionData } = await dataProvider.getOne('toefl-listening', { id });
      setSection(sectionData);

      const { data: partList } = await dataProvider.getList('toefl-listening-tests', {
        pagination: { page: 1, perPage: 1000 }, sort: { field: 'id', order: 'ASC' },
        filter: { toefl_listening_id: id },
      });
      setParts(partList);

      const qByPart = {};
      await Promise.all(partList.map(async (p) => {
        const { data: qs } = await dataProvider.getList('toefl-listening-questions', {
          pagination: { page: 1, perPage: 1000 }, sort: { field: 'sort_order', order: 'ASC' },
          filter: { toefl_listening_test_id: p.id },
        });
        const fullQuestions = await Promise.all(
          qs.map(q => dataProvider.getOne('toefl-listening-questions', { id: q.id }).then(r => r.data))
        );
        qByPart[p.id] = fullQuestions;
      }));
      setQuestionsByPart(qByPart);
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
      await dataProvider.update('toefl-listening', { id: section.id, data: section, previousData: section });
      notify('Section saved', { type: 'success' });
    } catch (e) { notify('Error saving section', { type: 'error' }); }
    setSaving(p => ({ ...p, section: false }));
  };

  const updatePartField = (partId, field, value) => {
    setParts(prev => prev.map(p => p.id === partId ? { ...p, [field]: value } : p));
  };

  const savePart = async (partId) => {
    const part = parts.find(p => p.id === partId);
    if (!part) return;
    setSaving(p => ({ ...p, [`p_${partId}`]: true }));
    try {
      await dataProvider.update('toefl-listening-tests', { id: partId, data: part, previousData: part });
      notify('Part saved', { type: 'success' });
    } catch (e) { notify('Error saving part', { type: 'error' }); }
    setSaving(p => ({ ...p, [`p_${partId}`]: false }));
  };

  const createPart = async () => {
    setSaving(p => ({ ...p, addPart: true }));
    try {
      const { data } = await dataProvider.create('toefl-listening-tests', {
        data: { toefl_listening_id: parseInt(id), audio: '', image: '', status: 1 },
      });
      setParts(prev => [...prev, data]);
      setQuestionsByPart(prev => ({ ...prev, [data.id]: [] }));
      notify('Part created', { type: 'success' });
    } catch (e) { notify('Error creating part', { type: 'error' }); }
    setSaving(p => ({ ...p, addPart: false }));
  };

  const deletePart = async (partId) => {
    if (!window.confirm('Delete this part and all its questions?')) return;
    try {
      await dataProvider.delete('toefl-listening-tests', { id: partId, previousData: parts.find(p => p.id === partId) });
      setParts(prev => prev.filter(p => p.id !== partId));
      setQuestionsByPart(prev => {
        const next = { ...prev };
        delete next[partId];
        return next;
      });
      notify('Part deleted', { type: 'success' });
    } catch (e) { notify('Error deleting part', { type: 'error' }); }
  };

  const saveQuestion = (partId) => async (questionData) => {
    const qId = questionData.id;
    setSaving(p => ({ ...p, [`q_${qId}`]: true }));
    try {
      const prevQ = (questionsByPart[partId] || []).find(q => q.id === qId);
      await dataProvider.update('toefl-listening-questions', { id: qId, data: questionData, previousData: prevQ });
      setQuestionsByPart(prev => ({
        ...prev,
        [partId]: (prev[partId] || []).map(q => q.id === qId ? questionData : q),
      }));
      notify('Question saved', { type: 'success' });
    } catch (e) { notify('Error saving question', { type: 'error' }); }
    setSaving(p => ({ ...p, [`q_${qId}`]: false }));
  };

  const addQuestion = async (partId) => {
    setSaving(p => ({ ...p, [`addQ_${partId}`]: true }));
    try {
      const existing = questionsByPart[partId] || [];
      const { data } = await dataProvider.create('toefl-listening-questions', {
        data: { toefl_listening_test_id: partId, question: '', audio: '', status: 1, sort_order: existing.length, answers: [] },
      });
      const { data: fullQ } = await dataProvider.getOne('toefl-listening-questions', { id: data.id });
      setQuestionsByPart(prev => ({ ...prev, [partId]: [...(prev[partId] || []), fullQ] }));
      notify('Question added', { type: 'success' });
    } catch (e) { notify('Error adding question', { type: 'error' }); }
    setSaving(p => ({ ...p, [`addQ_${partId}`]: false }));
  };

  const deleteQuestion = (partId) => async (qId) => {
    try {
      const prevQ = (questionsByPart[partId] || []).find(q => q.id === qId);
      await dataProvider.delete('toefl-listening-questions', { id: qId, previousData: prevQ });
      setQuestionsByPart(prev => ({
        ...prev,
        [partId]: (prev[partId] || []).filter(q => q.id !== qId),
      }));
      notify('Question deleted', { type: 'success' });
    } catch (e) { notify('Error deleting question', { type: 'error' }); }
  };

  if (loading) return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>;
  if (!section) return <Alert severity="error" sx={{ m: 2 }}>Section not found</Alert>;

  return (
    <Box key={id}>
      <Title title={`TOEFL Listening: ${section.name}`} />
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/toefl-listening')}>Back</Button>
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

      {/* Parts */}
      {parts.length === 0 ? (
        <Card sx={{ mx: 2, mb: 2 }}>
          <CardHeader title="Listening Parts" titleTypographyProps={{ variant: 'h6' }} />
          <CardContent>
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography color="text.secondary" gutterBottom>No parts yet for this section.</Typography>
              <Button variant="contained" startIcon={<AddIcon />} onClick={createPart} disabled={saving.addPart}>
                Create Part
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
        parts.map((part, pIdx) => {
          const pQuestions = questionsByPart[part.id] || [];
          return (
            <Card key={part.id} sx={{ mx: 2, mb: 2 }}>
              <CardHeader
                title={`Part #${pIdx + 1}`}
                titleTypographyProps={{ variant: 'h6' }}
                action={
                  <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => deletePart(part.id)}>
                    Delete Part
                  </Button>
                }
              />
              <CardContent>
                <Stack spacing={2}>
                  <TextField label="Audio File URL" value={part.audio || ''} onChange={e => updatePartField(part.id, 'audio', e.target.value)} fullWidth />
                  <TextField label="Image URL" value={part.image || ''} onChange={e => updatePartField(part.id, 'image', e.target.value)} fullWidth />
                  <FormControlLabel
                    control={<Switch checked={part.status === 1} onChange={e => updatePartField(part.id, 'status', e.target.checked ? 1 : 0)} />}
                    label={part.status === 1 ? 'Active' : 'Inactive'}
                  />
                  <Button variant="contained" startIcon={saving[`p_${part.id}`] ? <CircularProgress size={16} /> : <SaveIcon />} onClick={() => savePart(part.id)} disabled={saving[`p_${part.id}`]} sx={{ alignSelf: 'flex-start' }}>
                    Save Part
                  </Button>

                  <Divider sx={{ my: 1 }} />

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1">Questions ({pQuestions.length})</Typography>
                    <Button size="small" startIcon={saving[`addQ_${part.id}`] ? <CircularProgress size={16} /> : <AddIcon />} onClick={() => addQuestion(part.id)} disabled={saving[`addQ_${part.id}`]}>
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
                        onSave={saveQuestion(part.id)}
                        onDelete={deleteQuestion(part.id)}
                        questionField="question"
                        answerTextField="value"
                        extraFields={[{ name: 'audio', label: 'Audio File URL' }]}
                      />
                    ))
                  )}
                </Stack>
              </CardContent>
            </Card>
          );
        })
      )}

      {parts.length > 0 && (
        <Box sx={{ px: 2, mb: 2 }}>
          <Button variant="outlined" startIcon={saving.addPart ? <CircularProgress size={16} /> : <AddIcon />} onClick={createPart} disabled={saving.addPart}>
            Add Another Part
          </Button>
        </Box>
      )}
    </Box>
  );
};

// === CREATE ===
export const ToeflListeningCreate = () => (
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
