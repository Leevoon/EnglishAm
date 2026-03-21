import React from 'react';
import {
  List, Datagrid, TextField, NumberField,
  Edit, Create, SimpleForm, TextInput, SelectInput,
  EditButton,
} from 'react-admin';
import { RichTextInput } from 'ra-input-rich-text';
import { StatusField } from '../../components';

const filters = [
  <TextInput source="title" label="Title" alwaysOn />,
  <SelectInput source="status" choices={[
    { id: 1, name: 'Active' },
    { id: 0, name: 'Inactive' },
  ]} />,
];

export const NewsList = () => (
  <List filters={filters} perPage={25}>
    <Datagrid rowClick="edit" bulkActionButtons={false}>
      <NumberField source="id" />
      <TextField source="title" />
      <TextField source="image" label="Image" />
      <StatusField source="status" />
      <EditButton />
    </Datagrid>
  </List>
);

export const NewsEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="title" fullWidth />
      <TextInput source="image" fullWidth />
      <RichTextInput source="content" fullWidth />
      <SelectInput source="status" choices={[
        { id: 1, name: 'Active' },
        { id: 0, name: 'Inactive' },
      ]} />
    </SimpleForm>
  </Edit>
);

export const NewsCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="title" fullWidth />
      <TextInput source="image" fullWidth />
      <RichTextInput source="content" fullWidth />
      <SelectInput source="status" choices={[
        { id: 1, name: 'Active' },
        { id: 0, name: 'Inactive' },
      ]} defaultValue={1} />
    </SimpleForm>
  </Create>
);
