import React, { useState, useEffect, useRef } from 'react';
import { useRecordContext } from 'react-admin';
import {
  Chip, Button, Box, Typography, Divider, Stack, Tooltip,
  TextField as MuiTextField, IconButton, Switch, FormControlLabel,
  Accordion, AccordionSummary, AccordionDetails, CircularProgress,
} from '@mui/material';
import { Link } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

// === Shared helpers ===
export const stripHtml = (html) =>
  (html || '').replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').replace(/\s+/g, ' ').trim();

export const ACCESS_LEVELS = [
  { value: 0, label: 'Free', color: 'default' },
  { value: 1, label: 'Silver', color: 'info' },
  { value: 2, label: 'Gold', color: 'warning' },
];

export const AccessLevelChip = ({ level }) => {
  const al = ACCESS_LEVELS.find(a => a.value === (level || 0)) || ACCESS_LEVELS[0];
  return <Chip label={al.label} size="small" color={al.color} variant={level > 0 ? 'filled' : 'outlined'} />;
};

// === React-Admin Field Components ===

export const StatusField = ({ source = 'status' }) => {
  const record = useRecordContext();
  if (!record) return null;
  const value = record[source];
  const isActive = value === 1 || value === '1' || value === 'active' || value === 'Active';
  return (
    <Chip
      label={isActive ? 'Active' : 'Inactive'}
      color={isActive ? 'success' : 'default'}
      size="small"
      variant={isActive ? 'filled' : 'outlined'}
    />
  );
};
StatusField.defaultProps = { label: 'Status', source: 'status' };

export const BlockStatusField = ({ source = 'status' }) => {
  const record = useRecordContext();
  if (!record) return null;
  const value = record[source];
  const isActive = value === 1 || value === '1';
  return (
    <Chip
      label={isActive ? 'Active' : 'Blocked'}
      color={isActive ? 'success' : 'error'}
      size="small"
      variant={isActive ? 'filled' : 'outlined'}
    />
  );
};
BlockStatusField.defaultProps = { label: 'Status', source: 'status' };

export const HtmlPreviewField = ({ source, maxLength = 80 }) => {
  const record = useRecordContext();
  if (!record || !record[source]) return <span style={{ color: '#999' }}>-</span>;
  const stripped = stripHtml(record[source]);
  return (
    <span title={stripped} style={{ fontSize: '0.8125rem' }}>
      {stripped.length > maxLength ? stripped.substring(0, maxLength) + '...' : stripped}
    </span>
  );
};
HtmlPreviewField.defaultProps = { label: 'Preview' };

export const ViewRelatedButton = ({ resource, filterField, label }) => {
  const record = useRecordContext();
  if (!record) return null;
  return (
    <Button
      component={Link}
      to={`/${resource}?filter=${encodeURIComponent(JSON.stringify({ [filterField]: record.id }))}`}
      size="small"
      color="primary"
      variant="outlined"
      startIcon={<VisibilityIcon />}
      sx={{ textTransform: 'none', fontSize: '0.75rem', whiteSpace: 'nowrap' }}
    >
      {label}
    </Button>
  );
};

// === Rich Text Editor (TipTap) ===

export const RichTextEditor = ({ initialValue, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialValue || '',
    editorProps: {
      transformPastedHTML(html) {
        const cleaned = html.replace(/<meta[^>]*>/g, '').trim();
        const pMatches = cleaned.match(/<p[^>]*>/g);
        if (pMatches && pMatches.length === 1 && /^<p[^>]*>([\s\S]*)<\/p>$/.test(cleaned)) {
          return cleaned.replace(/^<p[^>]*>([\s\S]*)<\/p>$/, '$1');
        }
        return html;
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const btn = (label, active, action) => (
    <Button
      size="small"
      variant={active ? 'contained' : 'text'}
      onClick={action}
      sx={{ minWidth: 36, px: 1, fontSize: '0.75rem' }}
    >
      {label}
    </Button>
  );

  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
      <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', p: 0.5, display: 'flex', gap: 0.5, flexWrap: 'wrap', bgcolor: 'grey.50' }}>
        {btn(<strong>B</strong>, editor.isActive('bold'), () => editor.chain().focus().toggleBold().run())}
        {btn(<em>I</em>, editor.isActive('italic'), () => editor.chain().focus().toggleItalic().run())}
        {btn('H2', editor.isActive('heading', { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run())}
        {btn('H3', editor.isActive('heading', { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run())}
        {btn('List', editor.isActive('bulletList'), () => editor.chain().focus().toggleBulletList().run())}
        {btn('1.', editor.isActive('orderedList'), () => editor.chain().focus().toggleOrderedList().run())}
        {btn('Quote', editor.isActive('blockquote'), () => editor.chain().focus().toggleBlockquote().run())}
      </Box>
      <Box sx={{
        p: 1.5, minHeight: 200,
        '& .ProseMirror': { outline: 'none', minHeight: 200 },
        '& .ProseMirror p': { margin: '0.5em 0' },
        '& .ProseMirror h2': { margin: '0.75em 0 0.25em' },
        '& .ProseMirror h3': { margin: '0.5em 0 0.25em' },
        '& .ProseMirror ul, & .ProseMirror ol': { paddingLeft: '1.5em' },
        '& .ProseMirror blockquote': { borderLeft: '3px solid #ccc', pl: 1.5, color: 'text.secondary' },
      }}>
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
};

// === Question Accordion (Reusable) ===

export const QuestionAccordion = ({
  question, index, saving, onSave, onDelete,
  questionField = 'question',
  answerTextField = 'answer',
  answerExplanationField = null,
  extraFields = [],
}) => {
  const [q, setQ] = useState(question);
  useEffect(() => { setQ(question); }, [question]);

  const updateField = (field, value) => setQ(prev => ({ ...prev, [field]: value }));

  const updateAnswer = (i, field, value) => setQ(prev => ({
    ...prev,
    answers: (prev.answers || []).map((a, idx) => idx === i ? { ...a, [field]: value } : a),
  }));

  const addAnswer = () => setQ(prev => ({
    ...prev,
    answers: [
      ...(prev.answers || []),
      { [answerTextField]: '', true_false: false, ...(answerExplanationField ? { [answerExplanationField]: '' } : {}) },
    ],
  }));

  const removeAnswer = (i) => setQ(prev => ({
    ...prev,
    answers: (prev.answers || []).filter((_, idx) => idx !== i),
  }));

  const preview = stripHtml(q[questionField] || '').substring(0, 80) || `Question ${index + 1}`;
  const correctCount = (q.answers || []).filter(a => a.true_false).length;

  return (
    <Accordion sx={{ mb: 1, '&:before': { display: 'none' } }} TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%', pr: 1 }}>
          <Chip label={`#${index + 1}`} size="small" color="primary" variant="outlined" />
          <Typography sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.875rem' }}>
            {preview}
          </Typography>
          <Chip
            label={`${(q.answers || []).length} ans${correctCount > 0 ? ` / ${correctCount} correct` : ''}`}
            size="small" variant="outlined"
          />
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={2}>
          <MuiTextField
            label="Question"
            value={q[questionField] || ''}
            onChange={e => updateField(questionField, e.target.value)}
            multiline rows={2} fullWidth size="small"
          />
          {extraFields.map(ef => (
            <MuiTextField
              key={ef.name}
              label={ef.label}
              value={q[ef.name] || ''}
              onChange={e => updateField(ef.name, e.target.value)}
              multiline={ef.multiline} rows={ef.multiline ? 2 : 1}
              fullWidth size="small"
            />
          ))}
          <Stack direction="row" spacing={2}>
            <MuiTextField
              label="Sort Order" type="number" value={q.sort_order ?? 0}
              onChange={e => updateField('sort_order', parseInt(e.target.value) || 0)}
              sx={{ width: 130 }} size="small"
            />
            <FormControlLabel
              control={<Switch checked={q.status === 1} onChange={e => updateField('status', e.target.checked ? 1 : 0)} size="small" />}
              label={q.status === 1 ? 'Active' : 'Inactive'}
            />
          </Stack>

          <Divider />
          <Typography variant="subtitle2" color="text.secondary">Answers</Typography>

          {(q.answers || []).map((answer, i) => (
            <Stack key={i} direction="row" spacing={1} alignItems="center" sx={{ pl: 1 }}>
              <Chip
                label={String.fromCharCode(65 + i)}
                size="small"
                color={answer.true_false ? 'success' : 'default'}
                variant={answer.true_false ? 'filled' : 'outlined'}
                sx={{ minWidth: 28 }}
              />
              <MuiTextField
                value={answer[answerTextField] || ''}
                onChange={e => updateAnswer(i, answerTextField, e.target.value)}
                size="small" sx={{ flex: 1 }} placeholder="Answer text"
              />
              {answerExplanationField && (
                <MuiTextField
                  value={answer[answerExplanationField] || ''}
                  onChange={e => updateAnswer(i, answerExplanationField, e.target.value)}
                  size="small" sx={{ width: 200 }} placeholder="Explanation"
                />
              )}
              <Tooltip title={answer.true_false ? 'Correct (click to unmark)' : 'Mark as correct'}>
                <IconButton
                  size="small"
                  color={answer.true_false ? 'success' : 'default'}
                  onClick={() => updateAnswer(i, 'true_false', !answer.true_false)}
                >
                  {answer.true_false ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                </IconButton>
              </Tooltip>
              <IconButton size="small" color="error" onClick={() => removeAnswer(i)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          ))}

          <Button startIcon={<AddIcon />} onClick={addAnswer} size="small" sx={{ alignSelf: 'flex-start' }}>
            Add Answer
          </Button>

          <Divider />
          <Stack direction="row" spacing={1} justifyContent="space-between">
            <Button
              variant="contained" size="small"
              startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
              onClick={() => onSave(q)} disabled={saving}
            >
              Save Question
            </Button>
            <Button
              variant="outlined" size="small" color="error"
              startIcon={<DeleteIcon />}
              onClick={() => onDelete(q.id)}
            >
              Delete
            </Button>
          </Stack>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};
