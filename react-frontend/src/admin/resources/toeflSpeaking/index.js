import React from 'react';
import {
  List, Datagrid, TextField, NumberField, DateField,
  Edit, Create, SimpleForm, TextInput, NumberInput, SelectInput,
  required, EditButton,
} from 'react-admin';
import { StatusField } from '../../components';

const filters = [
  <TextInput source="q" label="Search" alwaysOn />,
];

export const ToeflSpeakingList = () => (
  <List filters={filters} sort={{ field: 'sort_order', order: 'ASC' }} perPage={25}>
    <Datagrid rowClick="edit" bulkActionButtons={false}>
      <NumberField source="id" />
      <TextField source="name" />
      <StatusField source="status" />
      <NumberField source="sort_order" label="Order" />
      <DateField source="created_date" label="Created" />
      <EditButton />
    </Datagrid>
  </List>
);

export const ToeflSpeakingEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" disabled />
      <TextInput source="name" validate={required()} fullWidth />
      <SelectInput source="status" choices={[
        { id: 1, name: 'Active' },
        { id: 0, name: 'Inactive' },
      ]} />
      <NumberInput source="sort_order" label="Order" />
    </SimpleForm>
  </Edit>
);

export const ToeflSpeakingCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" validate={required()} fullWidth />
      <SelectInput source="status" choices={[
        { id: 1, name: 'Active' },
        { id: 0, name: 'Inactive' },
      ]} defaultValue={1} />
      <NumberInput source="sort_order" label="Order" defaultValue={0} />
    </SimpleForm>
  </Create>
);
