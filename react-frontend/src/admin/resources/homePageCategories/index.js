import React, { useEffect, useState } from 'react';
import {
  List, Datagrid, TextField, NumberField,
  Edit, Create, SimpleForm, TextInput, NumberInput, SelectInput,
  EditButton, useWatch, required,
} from 'react-admin';
import { StatusField } from '../../components';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const SOURCE_TYPE_CHOICES = [
  { id: 'category', name: 'Category (test header)' },
  { id: 'lessons_filter', name: 'Lessons filter (subject matter)' },
];

// Fetches category/lessons_filter option lists once, then swaps the dropdown
// based on the currently selected source_type.
const SourceIdSelect = () => {
  const sourceType = useWatch({ name: 'source_type' });
  const [options, setOptions] = useState({ category: [], lessons_filter: [] });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    fetch(`${API_URL}/admin/home-page-categories/source-options`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((json) => setOptions(json))
      .catch((err) => console.error('Failed to load source options', err));
  }, []);

  const choices = (options[sourceType] || []).map((opt) => ({
    id: opt.id,
    name: `${opt.name || '(unnamed)'} [#${opt.id}]`,
  }));

  return (
    <SelectInput
      source="source_id"
      label="Source item"
      choices={choices}
      disabled={!sourceType}
      validate={required()}
    />
  );
};

const filters = [
  <SelectInput source="source_type" choices={SOURCE_TYPE_CHOICES} alwaysOn />,
];

export const HomePageCategoriesList = () => (
  <List filters={filters} sort={{ field: 'sort_order', order: 'ASC' }} perPage={25}>
    <Datagrid rowClick="edit">
      <NumberField source="id" />
      <TextField source="source_type" label="Type" />
      <TextField source="source_name" label="Pinned item" />
      <TextField source="icon" />
      <TextField source="color" />
      <NumberField source="sort_order" label="Order" />
      <StatusField source="status" />
      <EditButton />
    </Datagrid>
  </List>
);

const Form = ({ isCreate }) => (
  <SimpleForm>
    {!isCreate && <TextInput source="id" disabled />}
    <SelectInput source="source_type" choices={SOURCE_TYPE_CHOICES} validate={required()} />
    <SourceIdSelect />
    <TextInput source="icon" label="Icon (emoji or name)" helperText='e.g. "📚"' />
    <TextInput source="color" label="Color (hex)" helperText='e.g. "#4CAF50"' />
    <TextInput source="description" multiline fullWidth />
    <NumberInput source="sort_order" label="Order" defaultValue={0} />
    <SelectInput source="status" choices={[
      { id: 1, name: 'Active' },
      { id: 0, name: 'Inactive' },
    ]} defaultValue={1} />
  </SimpleForm>
);

export const HomePageCategoriesEdit = () => (
  <Edit>
    <Form />
  </Edit>
);

export const HomePageCategoriesCreate = () => (
  <Create>
    <Form isCreate />
  </Create>
);
