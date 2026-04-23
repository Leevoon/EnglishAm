import React from 'react';
import {
  List, Datagrid, TextField, NumberField, DateField, FunctionField,
  Edit, Create, SimpleForm, TextInput, NumberInput, SelectInput,
  ReferenceInput, EditButton,
} from 'react-admin';
import { Chip } from '@mui/material';
import { StatusField } from '../../components';

const MembershipChip = ({ source = 'membership_title' }) => (
  <FunctionField
    label="Membership"
    source={source}
    render={(record) =>
      record && record[source]
        ? <Chip size="small" label={record[source]} color="info" />
        : null
    }
  />
);

const filters = [
  <TextInput source="q" label="Search" alwaysOn />,
  <ReferenceInput source="category_id" reference="categories" label="Parent">
    <SelectInput optionText="name" />
  </ReferenceInput>,
  <SelectInput source="status" label="Status" choices={[
    { id: 1, name: 'Active' },
    { id: 0, name: 'Inactive' },
  ]} />,
];

export const TestCategoryList = () => (
  <List filters={filters} sort={{ field: 'created_date', order: 'DESC' }} perPage={25}>
    <Datagrid rowClick="edit">
      <NumberField source="id" />
      <TextField source="name" />
      <MembershipChip />
      <TextField source="parent_category_name" label="Parent Category" />
      <TextField source="level_name" label="Level" />
      <TextField source="time" />
      <StatusField source="status" />
      <DateField source="created_date" label="Created" showTime />
      <NumberField source="sort_order" label="Order" />
      <TextField source="image" />
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
      <ReferenceInput source="category_id" reference="categories" label="Parent Category">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <NumberInput source="parent_id" label="Parent (test_category self-ref)" defaultValue={0} />
      <NumberInput source="level_id" label="Level ID" defaultValue={0} />
      <TextInput source="time" label="Time (HH:MM:SS)" defaultValue="00:10:00" />
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
      <ReferenceInput source="category_id" reference="categories" label="Parent Category">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <NumberInput source="parent_id" label="Parent (test_category self-ref)" defaultValue={0} />
      <NumberInput source="level_id" label="Level ID" defaultValue={0} />
      <TextInput source="time" label="Time (HH:MM:SS)" defaultValue="00:10:00" />
      <TextInput source="image" label="Image Path" fullWidth />
      <SelectInput source="status" choices={[
        { id: 1, name: 'Active' },
        { id: 0, name: 'Inactive' },
      ]} defaultValue={1} />
      <NumberInput source="sort_order" label="Order" defaultValue={0} />
    </SimpleForm>
  </Create>
);
