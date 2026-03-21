import React from 'react';
import {
  List, Datagrid, TextField, NumberField,
  Edit, Create, SimpleForm, TextInput, SelectInput,
  EditButton,
} from 'react-admin';
import { StatusField } from '../../components';

const filters = [
  <SelectInput source="status" choices={[
    { id: 1, name: 'Active' },
    { id: 0, name: 'Inactive' },
  ]} alwaysOn />,
];

export const GalleryList = () => (
  <List filters={filters} perPage={25}>
    <Datagrid rowClick="edit" bulkActionButtons={false}>
      <NumberField source="id" />
      <TextField source="image" />
      <StatusField source="status" />
      <EditButton />
    </Datagrid>
  </List>
);

export const GalleryEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="image" fullWidth />
      <SelectInput source="status" choices={[
        { id: 1, name: 'Active' },
        { id: 0, name: 'Inactive' },
      ]} />
    </SimpleForm>
  </Edit>
);

export const GalleryCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="image" fullWidth />
      <SelectInput source="status" choices={[
        { id: 1, name: 'Active' },
        { id: 0, name: 'Inactive' },
      ]} defaultValue={1} />
    </SimpleForm>
  </Create>
);
