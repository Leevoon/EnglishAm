import React from 'react';
import {
  List, Datagrid, TextField, NumberField,
  Edit, Create, SimpleForm, TextInput, NumberInput, SelectInput,
  EditButton,
} from 'react-admin';
import { StatusField } from '../../components';

const filters = [
  <TextInput source="q" label="Search" alwaysOn />,
];

export const LanguageList = () => (
  <List filters={filters} sort={{ field: 'sort_order', order: 'ASC' }} perPage={25}>
    <Datagrid rowClick="edit">
      <NumberField source="id" />
      <TextField source="name" />
      <TextField source="code" label="Code" />
      <StatusField source="status" />
      <NumberField source="sort_order" label="Order" />
      <EditButton />
    </Datagrid>
  </List>
);

export const LanguageEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" disabled />
      <TextInput source="name" fullWidth required />
      <TextInput source="code" label="Language Code (e.g., en, hy, ru)" required />
      <TextInput source="image" label="Flag Image Path" fullWidth />
      <SelectInput source="status" choices={[
        { id: 1, name: 'Active' },
        { id: 0, name: 'Inactive' },
      ]} />
      <NumberInput source="sort_order" label="Order" defaultValue={0} />
    </SimpleForm>
  </Edit>
);

export const LanguageCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" fullWidth required />
      <TextInput source="code" label="Language Code (e.g., en, hy, ru)" required />
      <TextInput source="image" label="Flag Image Path" fullWidth />
      <SelectInput source="status" choices={[
        { id: 1, name: 'Active' },
        { id: 0, name: 'Inactive' },
      ]} defaultValue={1} />
      <NumberInput source="sort_order" label="Order" defaultValue={0} />
    </SimpleForm>
  </Create>
);
