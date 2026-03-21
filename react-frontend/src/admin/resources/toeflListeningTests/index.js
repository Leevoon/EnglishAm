import React from 'react';
import {
  List, Datagrid, TextField, NumberField,
  Edit, Create, SimpleForm, TextInput, NumberInput, SelectInput,
  required, EditButton,
} from 'react-admin';
import { StatusField, ViewRelatedButton } from '../../components';

const filters = [
  <NumberInput source="toefl_listening_id" label="Listening Section ID" alwaysOn />,
];

export const ToeflListeningTestList = () => (
  <List filters={filters} perPage={25}>
    <Datagrid rowClick="edit" bulkActionButtons={false}>
      <NumberField source="id" />
      <NumberField source="toefl_listening_id" label="Section ID" />
      <TextField source="audio" label="Audio File" />
      <TextField source="image" label="Image" />
      <StatusField source="status" />
      <ViewRelatedButton resource="toefl-listening-questions" filterField="toefl_listening_test_id" label="Questions" />
      <EditButton />
    </Datagrid>
  </List>
);

export const ToeflListeningTestEdit = () => (
  <Edit>
    <SimpleForm>
      <NumberInput source="id" disabled />
      <NumberInput source="toefl_listening_id" label="Listening Section ID" validate={required()} />
      <TextInput source="audio" label="Audio File" fullWidth />
      <TextInput source="image" label="Image" fullWidth />
      <SelectInput source="status" choices={[
        { id: 1, name: 'Active' },
        { id: 0, name: 'Inactive' },
      ]} />
    </SimpleForm>
  </Edit>
);

export const ToeflListeningTestCreate = () => (
  <Create>
    <SimpleForm>
      <NumberInput source="toefl_listening_id" label="Listening Section ID" validate={required()} />
      <TextInput source="audio" label="Audio File" fullWidth />
      <TextInput source="image" label="Image" fullWidth />
      <SelectInput source="status" choices={[
        { id: 1, name: 'Active' },
        { id: 0, name: 'Inactive' },
      ]} defaultValue={1} />
    </SimpleForm>
  </Create>
);
