import React, { useState, useEffect, useCallback } from 'react';
import {
  useDataProvider, useNotify, Title,
  Create, SimpleForm, TextInput, NumberInput, SelectInput, required,
} from 'react-admin';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, Card, CardContent, CardHeader, Typography, Chip,
  Table, TableHead, TableBody, TableRow, TableCell, TablePagination,
  TextField, Button, Switch, FormControlLabel, MenuItem,
  Stack, CircularProgress, Alert, IconButton, Tooltip,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { QuestionAccordion, AccessLevelChip, ACCESS_LEVELS } from '../../components';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
const ADMIN_API_URL = `${API_URL}/admin`;

const fetchWithAuth = (url) => {
  const token = localStorage.getItem('adminToken');
  return fetch(url, {
    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
  }).then(r => r.json());
};

// =============================================
// Factory: Creates List, Edit, Create components
// =============================================
function createSectionTestComponents(config) {
  const {
    resource,
    title,
    hasLevels = true,
    hasSubcategories = false,
    hasVariant = false,
    questionExtraFields = [],
  } = config;

  // === LIST ===
  const SectionTestList = () => {
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const navigate = useNavigate();

    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [perPage, setPerPage] = useState(25);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [levelFilter, setLevelFilter] = useState('');
    const [subcategoryFilter, setSubcategoryFilter] = useState('');
    const [variantFilter, setVariantFilter] = useState('');

    const [levels, setLevels] = useState([]);
    const [subcategories, setSubcategories] = useState([]);

    // Load filters
    useEffect(() => {
      fetchWithAuth(`${ADMIN_API_URL}/${resource}/filters`)
        .then(data => {
          setLevels(data.levels || []);
          setSubcategories(data.subcategories || []);
        })
        .catch(() => {});
    }, []);

    // Load data
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const filter = {};
          if (search) filter.q = search;
          if (levelFilter) filter.level_id = levelFilter;
          if (subcategoryFilter) filter.parent_id = subcategoryFilter;
          if (variantFilter) filter.english_variant = variantFilter;

          const result = await dataProvider.getList(resource, {
            pagination: { page: page + 1, perPage },
            sort: { field: 'id', order: 'DESC' },
            filter,
          });
          setRows(result.data || []);
          setTotal(result.total || 0);
        } catch (err) {
          notify('Error loading data', { type: 'error' });
        }
        setLoading(false);
      };
      fetchData();
    }, [dataProvider, notify, page, perPage, search, levelFilter, subcategoryFilter, variantFilter]);

    const handleDelete = async (e, row) => {
      e.stopPropagation();
      if (!window.confirm(`Delete "${row.name}" and all its questions?`)) return;
      try {
        await dataProvider.delete(resource, { id: row.id, previousData: row });
        setRows(prev => prev.filter(r => r.id !== row.id));
        setTotal(prev => prev - 1);
        notify('Deleted successfully', { type: 'success' });
      } catch (err) {
        notify('Error deleting', { type: 'error' });
      }
    };

    const handleSearch = (e) => {
      e.preventDefault();
      setSearch(searchInput);
      setPage(0);
    };

    return (
      <Box>
        <Title title={title} />
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">{title}</Typography>
          <Button variant="contained" startIcon={<AddIcon />} component={RouterLink} to={`/${resource}/create`}>
            New Test
          </Button>
        </Box>

        {/* Filters */}
        <Card sx={{ mx: 2, mb: 2 }}>
          <CardContent sx={{ pb: '12px !important' }}>
            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
              <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  size="small" placeholder="Search..."
                  value={searchInput} onChange={e => setSearchInput(e.target.value)}
                  sx={{ width: 200 }}
                />
                <Button type="submit" variant="outlined" size="small" startIcon={<SearchIcon />}>Search</Button>
              </Box>

              {hasLevels && (
                <TextField
                  select size="small" label="Difficulty" value={levelFilter}
                  onChange={e => { setLevelFilter(e.target.value); setPage(0); }}
                  sx={{ minWidth: 160 }}
                >
                  <MenuItem value="">All Levels</MenuItem>
                  {levels.map(l => <MenuItem key={l.id} value={l.id}>{l.name}</MenuItem>)}
                </TextField>
              )}

              {hasSubcategories && subcategories.length > 0 && (
                <TextField
                  select size="small" label="Category" value={subcategoryFilter}
                  onChange={e => { setSubcategoryFilter(e.target.value); setPage(0); }}
                  sx={{ minWidth: 180 }}
                >
                  <MenuItem value="">All</MenuItem>
                  {subcategories.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
                </TextField>
              )}

              {hasVariant && (
                <TextField
                  select size="small" label="Accent" value={variantFilter}
                  onChange={e => { setVariantFilter(e.target.value); setPage(0); }}
                  sx={{ minWidth: 160 }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="british">British English</MenuItem>
                  <MenuItem value="american">American English</MenuItem>
                </TextField>
              )}

              {(search || levelFilter || subcategoryFilter || variantFilter) && (
                <Button size="small" onClick={() => {
                  setSearch(''); setSearchInput(''); setLevelFilter('');
                  setSubcategoryFilter(''); setVariantFilter(''); setPage(0);
                }}>
                  Clear Filters
                </Button>
              )}
            </Stack>
          </CardContent>
        </Card>

        {/* Table */}
        <Card sx={{ mx: 2, mb: 2 }}>
          {loading ? (
            <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>
          ) : (
            <>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell width={50}>ID</TableCell>
                    <TableCell>Name</TableCell>
                    {hasLevels && <TableCell width={130}>Level</TableCell>}
                    {hasSubcategories && <TableCell width={150}>Category</TableCell>}
                    {hasVariant && <TableCell width={120}>Accent</TableCell>}
                    <TableCell width={90} align="center">Questions</TableCell>
                    <TableCell width={80} align="center">Access</TableCell>
                    <TableCell width={80} align="center">Status</TableCell>
                    <TableCell width={60} align="center">Order</TableCell>
                    <TableCell width={70}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map(row => (
                    <TableRow key={row.id} hover sx={{ cursor: 'pointer' }} onClick={() => navigate(`/${resource}/${row.id}`)}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell><strong>{row.name || `Test #${row.id}`}</strong></TableCell>
                      {hasLevels && <TableCell>{row.level_name || '-'}</TableCell>}
                      {hasSubcategories && <TableCell>{row.parent_name || '-'}</TableCell>}
                      {hasVariant && (
                        <TableCell>
                          {row.english_variant === 'american' ? 'American' : row.english_variant === 'british' ? 'British' : 'Both'}
                        </TableCell>
                      )}
                      <TableCell align="center">
                        <Chip
                          label={row.question_count || 0} size="small"
                          color={row.question_count > 0 ? 'primary' : 'default'}
                          variant={row.question_count > 0 ? 'filled' : 'outlined'}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <AccessLevelChip level={row.required_level} />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={row.status === 1 ? 'Active' : 'Inactive'}
                          color={row.status === 1 ? 'success' : 'default'}
                          size="small"
                          variant={row.status === 1 ? 'filled' : 'outlined'}
                        />
                      </TableCell>
                      <TableCell align="center">{row.sort_order}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5}>
                          <EditIcon fontSize="small" color="action" />
                          <DeleteIcon
                            fontSize="small" color="error"
                            sx={{ cursor: 'pointer' }}
                            onClick={(e) => handleDelete(e, row)}
                          />
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">No tests found</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={total}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                rowsPerPage={perPage}
                onRowsPerPageChange={e => { setPerPage(parseInt(e.target.value)); setPage(0); }}
                rowsPerPageOptions={[10, 25, 50, 100]}
              />
            </>
          )}
        </Card>
      </Box>
    );
  };

  // === EDIT ===
  const SectionTestEdit = () => {
    const { id } = useParams();
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const navigate = useNavigate();

    const [testCategory, setTestCategory] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState({});
    const [levels, setLevels] = useState([]);
    const [subcategories, setSubcategories] = useState([]);

    // Load filters
    useEffect(() => {
      fetchWithAuth(`${ADMIN_API_URL}/${resource}/filters`)
        .then(data => {
          setLevels(data.levels || []);
          setSubcategories(data.subcategories || []);
        })
        .catch(() => {});
    }, []);

    // Load data
    const fetchData = useCallback(async () => {
      try {
        const { data } = await dataProvider.getOne(resource, { id });
        setTestCategory(data);
        setQuestions(data.questions || []);
        setLoading(false);
      } catch (error) {
        notify('Error loading data', { type: 'error' });
        setLoading(false);
      }
    }, [id, dataProvider, notify]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const saveTestCategory = async () => {
      setSaving(p => ({ ...p, section: true }));
      try {
        await dataProvider.update(resource, {
          id: testCategory.id,
          data: testCategory,
          previousData: testCategory,
        });
        notify('Saved successfully', { type: 'success' });
      } catch (e) {
        notify('Error saving', { type: 'error' });
      }
      setSaving(p => ({ ...p, section: false }));
    };

    const saveQuestion = async (questionData) => {
      const qId = questionData.id;
      setSaving(p => ({ ...p, [`q_${qId}`]: true }));
      try {
        // Map true_false -> is_correct for the tests API
        const saveData = {
          ...questionData,
          test_category_id: parseInt(id),
          answers: (questionData.answers || []).map(a => ({
            text: a.text,
            is_correct: a.true_false ? 1 : 0,
          })),
        };
        await dataProvider.update('tests', { id: qId, data: saveData, previousData: questionData });
        notify('Question saved', { type: 'success' });
      } catch (e) {
        notify('Error saving question', { type: 'error' });
      }
      setSaving(p => ({ ...p, [`q_${qId}`]: false }));
    };

    const addQuestion = async () => {
      setSaving(p => ({ ...p, addQ: true }));
      try {
        const { data } = await dataProvider.create('tests', {
          data: {
            test_category_id: parseInt(id),
            question: '',
            status: 1,
            sort_order: questions.length,
            answers: [],
          },
        });
        // Fetch full question with answers
        const { data: fullQ } = await dataProvider.getOne('tests', { id: data.id });
        // Map is_correct -> true_false
        const mapped = {
          ...fullQ,
          answers: (fullQ.answers || []).map(a => ({
            ...a, true_false: a.is_correct ? true : false,
          })),
        };
        setQuestions(prev => [...prev, mapped]);
        notify('Question added', { type: 'success' });
      } catch (e) {
        notify('Error adding question', { type: 'error' });
      }
      setSaving(p => ({ ...p, addQ: false }));
    };

    const deleteQuestion = async (qId) => {
      if (!window.confirm('Delete this question?')) return;
      try {
        await dataProvider.delete('tests', { id: qId, previousData: questions.find(q => q.id === qId) });
        setQuestions(prev => prev.filter(q => q.id !== qId));
        notify('Question deleted', { type: 'success' });
      } catch (e) {
        notify('Error deleting question', { type: 'error' });
      }
    };

    if (loading) return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>;
    if (!testCategory) return <Alert severity="error" sx={{ m: 2 }}>Test not found</Alert>;

    return (
      <Box key={id}>
        <Title title={`${title}: ${testCategory.name || `Test #${id}`}`} />
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(`/${resource}`)}>Back</Button>
          <Typography variant="h5" sx={{ flex: 1 }}>{testCategory.name || `Test #${id}`}</Typography>
        </Box>

        {/* Test Category Details */}
        <Card sx={{ mx: 2, mb: 2 }}>
          <CardHeader title="Test Details" titleTypographyProps={{ variant: 'h6' }} />
          <CardContent>
            <Stack spacing={2}>
              <TextField
                label="Name" value={testCategory.name || ''} fullWidth
                onChange={e => setTestCategory(prev => ({ ...prev, name: e.target.value }))}
              />
              <TextField
                label="Description" value={testCategory.description || ''} fullWidth multiline rows={2}
                onChange={e => setTestCategory(prev => ({ ...prev, description: e.target.value }))}
              />
              <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
                <TextField
                  label="Sort Order" type="number" value={testCategory.sort_order ?? 0}
                  onChange={e => setTestCategory(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                  sx={{ width: 120 }}
                />
                <TextField
                  label="Time Limit" value={testCategory.time || '00:10:00'}
                  onChange={e => setTestCategory(prev => ({ ...prev, time: e.target.value }))}
                  sx={{ width: 130 }} placeholder="HH:MM:SS"
                />
                <TextField
                  select label="Access Level" value={testCategory.required_level ?? 0}
                  onChange={e => setTestCategory(prev => ({ ...prev, required_level: parseInt(e.target.value) }))}
                  sx={{ width: 130 }}
                >
                  {ACCESS_LEVELS.map(al => <MenuItem key={al.value} value={al.value}>{al.label}</MenuItem>)}
                </TextField>
                {hasLevels && (
                  <TextField
                    select label="Difficulty Level" value={testCategory.level_id || ''}
                    onChange={e => setTestCategory(prev => ({ ...prev, level_id: e.target.value ? parseInt(e.target.value) : null }))}
                    sx={{ width: 180 }}
                  >
                    <MenuItem value="">None</MenuItem>
                    {levels.map(l => <MenuItem key={l.id} value={l.id}>{l.name}</MenuItem>)}
                  </TextField>
                )}
                {hasSubcategories && subcategories.length > 0 && (
                  <TextField
                    select label="Category" value={testCategory.parent_id || ''}
                    onChange={e => setTestCategory(prev => ({ ...prev, parent_id: e.target.value ? parseInt(e.target.value) : null }))}
                    sx={{ width: 200 }}
                  >
                    <MenuItem value="">None</MenuItem>
                    {subcategories.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
                  </TextField>
                )}
                {hasVariant && (
                  <TextField
                    select label="Accent" value={testCategory.english_variant || 'both'}
                    onChange={e => setTestCategory(prev => ({ ...prev, english_variant: e.target.value }))}
                    sx={{ width: 160 }}
                  >
                    <MenuItem value="both">Both</MenuItem>
                    <MenuItem value="british">British English</MenuItem>
                    <MenuItem value="american">American English</MenuItem>
                  </TextField>
                )}
                <FormControlLabel
                  control={
                    <Switch
                      checked={testCategory.status === 1}
                      onChange={e => setTestCategory(prev => ({ ...prev, status: e.target.checked ? 1 : 0 }))}
                    />
                  }
                  label={testCategory.status === 1 ? 'Active' : 'Inactive'}
                />
              </Stack>
              <TextField
                label="Image Path" value={testCategory.image || ''} fullWidth
                onChange={e => setTestCategory(prev => ({ ...prev, image: e.target.value }))}
              />
              <Button
                variant="contained"
                startIcon={saving.section ? <CircularProgress size={16} /> : <SaveIcon />}
                onClick={saveTestCategory}
                disabled={saving.section}
                sx={{ alignSelf: 'flex-start' }}
              >
                Save Details
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
              <Button
                startIcon={saving.addQ ? <CircularProgress size={16} /> : <AddIcon />}
                onClick={addQuestion}
                disabled={saving.addQ}
              >
                Add Question
              </Button>
            }
          />
          <CardContent>
            {questions.length === 0 ? (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                No questions yet. Click "Add Question" to create one.
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
                  questionField="question"
                  answerTextField="text"
                  extraFields={questionExtraFields}
                />
              ))
            )}
          </CardContent>
        </Card>
      </Box>
    );
  };

  // === CREATE ===
  const SectionTestCreate = () => {
    const [levels, setLevels] = useState([]);
    const [subcategories, setSubcategories] = useState([]);

    useEffect(() => {
      fetchWithAuth(`${ADMIN_API_URL}/${resource}/filters`)
        .then(data => {
          setLevels(data.levels || []);
          setSubcategories(data.subcategories || []);
        })
        .catch(() => {});
    }, []);

    return (
      <Create resource={resource}>
        <SimpleForm>
          <TextInput source="name" validate={required()} fullWidth />
          <TextInput source="description" multiline rows={2} fullWidth />
          {hasLevels && (
            <SelectInput
              source="level_id" label="Difficulty Level"
              choices={levels.map(l => ({ id: l.id, name: l.name }))}
            />
          )}
          {hasSubcategories && subcategories.length > 0 && (
            <SelectInput
              source="parent_id" label="Category"
              choices={subcategories.map(s => ({ id: s.id, name: s.name }))}
            />
          )}
          {hasVariant && (
            <SelectInput
              source="english_variant" label="Accent"
              choices={[
                { id: 'both', name: 'Both' },
                { id: 'british', name: 'British English' },
                { id: 'american', name: 'American English' },
              ]}
              defaultValue="both"
            />
          )}
          <SelectInput source="required_level" label="Access Level" choices={[
            { id: 0, name: 'Free' },
            { id: 1, name: 'Silver' },
            { id: 2, name: 'Gold' },
          ]} defaultValue={0} />
          <SelectInput source="status" choices={[
            { id: 1, name: 'Active' },
            { id: 0, name: 'Inactive' },
          ]} defaultValue={1} />
          <NumberInput source="sort_order" label="Order" defaultValue={0} />
          <TextInput source="time" label="Time Limit" defaultValue="00:10:00" />
          <TextInput source="image" label="Image Path" fullWidth />
        </SimpleForm>
      </Create>
    );
  };

  return { List: SectionTestList, Edit: SectionTestEdit, Create: SectionTestCreate };
}

// =============================================
// Export components for each test section
// =============================================

export const {
  List: AudioTestList,
  Edit: AudioTestEdit,
  Create: AudioTestCreate,
} = createSectionTestComponents({
  resource: 'audio-tests',
  title: 'Audio Tests',
  hasLevels: true,
  hasSubcategories: false,
  hasVariant: true,
  questionExtraFields: [
    { name: 'audio', label: 'Audio Path' },
  ],
});

export const {
  List: SynonymTestList,
  Edit: SynonymTestEdit,
  Create: SynonymTestCreate,
} = createSectionTestComponents({
  resource: 'synonym-tests',
  title: 'Synonyms',
  hasLevels: true,
  hasSubcategories: false,
  hasVariant: false,
});

export const {
  List: AntonymTestList,
  Edit: AntonymTestEdit,
  Create: AntonymTestCreate,
} = createSectionTestComponents({
  resource: 'antonym-tests',
  title: 'Antonyms',
  hasLevels: true,
  hasSubcategories: false,
  hasVariant: false,
});

export const {
  List: GeneralEnglishTestList,
  Edit: GeneralEnglishTestEdit,
  Create: GeneralEnglishTestCreate,
} = createSectionTestComponents({
  resource: 'general-english-tests',
  title: 'General English',
  hasLevels: true,
  hasSubcategories: true,
  hasVariant: false,
});

export const {
  List: ProfessionalEnglishTestList,
  Edit: ProfessionalEnglishTestEdit,
  Create: ProfessionalEnglishTestCreate,
} = createSectionTestComponents({
  resource: 'professional-english-tests',
  title: 'Professional English',
  hasLevels: true,
  hasSubcategories: true,
  hasVariant: false,
});

export const {
  List: PhotoTestList,
  Edit: PhotoTestEdit,
  Create: PhotoTestCreate,
} = createSectionTestComponents({
  resource: 'photo-tests',
  title: 'Photo Tests',
  hasLevels: false,
  hasSubcategories: true,
  hasVariant: false,
  questionExtraFields: [
    { name: 'image', label: 'Image Path' },
  ],
});
