import React from 'react';
import {
  List, Datagrid, TextField, NumberField,
  Edit, Create, SimpleForm, TextInput, NumberInput, SelectInput,
  EditButton,
} from 'react-admin';
import { StatusField, HtmlPreviewField } from '../../components';

const filters = [
  <TextInput source="q" label="Search" alwaysOn />,
];

export const TestCategoryList = () => (
  <List filters={filters} sort={{ field: 'id', order: 'DESC' }} perPage={25}>
    <Datagrid rowClick="edit">
      <NumberField source="id" />
      <TextField source="name" />
      <HtmlPreviewField source="description" label="Description" maxLength={60} />
      <NumberField source="parent_id" label="Parent" />
      <NumberField source="category_id" label="Category" />
      <StatusField source="status" />
      <NumberField source="sort_order" label="Order" />
      <EditButton />
    </Datagrid>
  </List>
);

export const TestCategoryEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" disabled />
      <TextInput source="name" fullWidth required />
      <TextInput source="description" multiline rows={4} fullWidth />
      <NumberInput source="parent_id" label="Parent ID" defaultValue={0} />
      <NumberInput source="category_id" label="Category ID" defaultValue={0} />
      <TextInput source="image" label="Image Path" fullWidth />
      <SelectInput source="status" choices={[
        { id: 1, name: 'Active' },
        { id: 0, name: 'Inactive' },
      ]} />
      <NumberInput source="sort_order" label="Order" defaultValue={0} />
    </SimpleForm>
  </Edit>
);

export const TestCategoryCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" fullWidth required />
      <TextInput source="description" multiline rows={4} fullWidth />
      <NumberInput source="parent_id" label="Parent ID" defaultValue={0} />
      <NumberInput source="category_id" label="Category ID" defaultValue={0} />
      <TextInput source="image" label="Image Path" fullWidth />
      <SelectInput source="status" choices={[
        { id: 1, name: 'Active' },
        { id: 0, name: 'Inactive' },
      ]} defaultValue={1} />
      <NumberInput source="sort_order" label="Order" defaultValue={0} />
    </SimpleForm>
  </Create>
);
