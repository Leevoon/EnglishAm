import React from 'react';
import {
  List, Datagrid, TextField, NumberField, EditButton, DeleteButton,
  Edit, Create, SimpleForm, TextInput, NumberInput, SelectInput, Filter,
  useRecordContext,
} from 'react-admin';

const statusChoices = [
  { id: 'active', name: 'Active' },
  { id: 'inactive', name: 'Inactive' },
];

export const ToeflListeningTestList = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <NumberField source="toefl_listening_id" />
      <TextField source="audio" />
      <TextField source="image" />
      <TextField source="status" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const ToeflListeningTestEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <NumberInput source="toefl_listening_id" />
      <TextInput source="audio" />
      <TextInput source="image" />
      <SelectInput source="status" choices={statusChoices} />
    </SimpleForm>
  </Edit>
);

export const ToeflListeningTestCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <NumberInput source="toefl_listening_id" />
      <TextInput source="audio" />
      <TextInput source="image" />
      <SelectInput source="status" choices={statusChoices} />
    </SimpleForm>
  </Create>
);
