import React from 'react';
import {
  List, Datagrid, TextField, NumberField, DateField,
  Edit, Create, SimpleForm, TextInput, SelectInput, NumberInput,
  EditButton, SearchInput,
} from 'react-admin';
import { StatusField } from '../../components';

const filters = [
  <SearchInput source="q" alwaysOn placeholder="Search name" />,
  <SelectInput source="status" choices={[
    { id: 1, name: 'Active' },
    { id: 0, name: 'Inactive' },
  ]} alwaysOn />,
];

export const CvList = () => (
  <List filters={filters} perPage={25} sort={{ field: 'sort_order', order: 'ASC' }}>
    <Datagrid rowClick="edit" bulkActionButtons={false}>
      <NumberField source="id" />
      <StatusField source="status" />
      <NumberField source="sort_order" label="Sort Order" />
      <DateField source="created_date" label="Created Date" showTime />
      <TextField source="cv_name" label="Cv Name" />
      <EditButton />
    </Datagrid>
  </List>
);

export const CvEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="cv_name" label="Cv Name" fullWidth />
      <SelectInput source="status" choices={[
        { id: 1, name: 'Active' },
        { id: 0, name: 'Inactive' },
      ]} />
      <NumberInput source="sort_order" label="Sort Order" />
    </SimpleForm>
  </Edit>
);

export const CvCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="cv_name" label="Cv Name" fullWidth />
      <SelectInput source="status" choices={[
        { id: 1, name: 'Active' },
        { id: 0, name: 'Inactive' },
      ]} defaultValue={1} />
      <NumberInput source="sort_order" label="Sort Order" defaultValue={0} />
    </SimpleForm>
  </Create>
);
