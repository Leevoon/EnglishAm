import React from 'react';
import {
  List, Datagrid, TextField, NumberField, DateField,
  Edit, Create, SimpleForm, TextInput, NumberInput, SelectInput,
  required, EditButton,
} from 'react-admin';
import { StatusField, ViewRelatedButton } from '../../components';

const filters = [
  <TextInput source="q" label="Search" alwaysOn />,
];

export const IeltsListeningList = () => (
  <List filters={filters} sort={{ field: 'sort_order', order: 'ASC' }} perPage={25}>
    <Datagrid rowClick="edit" bulkActionButtons={false}>
      <NumberField source="id" />
      <TextField source="name" />
      <TextField source="listening_audio" label="Audio" />
      <TextField source="image" label="Image" />
      <StatusField source="status" />
      <NumberField source="sort_order" label="Order" />
      <DateField source="created_date" label="Created" />
      <ViewRelatedButton resource="ielts-listening-questions" filterField="ielts_listening_id" label="Questions" />
      <EditButton />
    </Datagrid>
  </List>
);

export const IeltsListeningEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" disabled />
      <TextInput source="name" validate={required()} fullWidth />
      <TextInput source="listening_audio" label="Audio File" fullWidth />
      <TextInput source="image" label="Image" fullWidth />
      <SelectInput source="status" choices={[
        { id: 1, name: 'Active' },
        { id: 0, name: 'Inactive' },
      ]} />
      <NumberInput source="sort_order" label="Order" />
    </SimpleForm>
  </Edit>
);

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
