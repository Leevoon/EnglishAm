import React from 'react';
import {
  List, Datagrid, TextField, NumberField,
  Edit, Create, SimpleForm, TextInput, SelectInput,
  EditButton,
} from 'react-admin';
import { StatusField } from '../../components';

const filters = [
  <TextInput source="value" label="Value" alwaysOn />,
  <SelectInput source="status" choices={[
    { id: 1, name: 'Active' },
    { id: 0, name: 'Inactive' },
  ]} />,
];

export const SlideshowList = () => (
  <List filters={filters} perPage={25}>
    <Datagrid rowClick="edit" bulkActionButtons={false}>
      <NumberField source="id" />
      <TextField source="value" />
      <StatusField source="status" />
      <EditButton />
    </Datagrid>
  </List>
);

export const SlideshowEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="value" fullWidth />
      <SelectInput source="status" choices={[
        { id: 1, name: 'Active' },
        { id: 0, name: 'Inactive' },
      ]} />
    </SimpleForm>
  </Edit>
);

export const SlideshowCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="value" fullWidth />
      <SelectInput source="status" choices={[
        { id: 1, name: 'Active' },
        { id: 0, name: 'Inactive' },
      ]} defaultValue={1} />
    </SimpleForm>
  </Create>
);
