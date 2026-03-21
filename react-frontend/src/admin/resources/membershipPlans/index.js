import React from 'react';
import {
  List, Datagrid, TextField, NumberField,
  Edit, Create, SimpleForm, TextInput, NumberInput, SelectInput,
  EditButton, FunctionField,
} from 'react-admin';
import { RichTextInput } from 'ra-input-rich-text';
import { StatusField } from '../../components';
import { Chip } from '@mui/material';

const levelChoices = [
  { id: 0, name: 'Free' },
  { id: 1, name: 'Silver' },
  { id: 2, name: 'Gold' },
];

const vipChoices = [
  { id: 0, name: 'No' },
  { id: 1, name: 'Yes' },
];

const LevelField = () => {
  return (
    <FunctionField render={record => {
      const labels = { 0: 'Free', 1: 'Silver', 2: 'Gold' };
      const colors = { 0: 'default', 1: 'info', 2: 'warning' };
      return <Chip label={labels[record.level] || record.level} color={colors[record.level] || 'default'} size="small" />;
    }} />
  );
};

const filters = [
  <TextInput source="name" label="Name" alwaysOn />,
  <SelectInput source="level" choices={levelChoices} />,
  <SelectInput source="vip" choices={vipChoices} />,
];

export const MembershipPlansList = () => (
  <List filters={filters} perPage={25}>
    <Datagrid rowClick="edit" bulkActionButtons={false}>
      <NumberField source="id" />
      <TextField source="name" />
      <NumberField source="price" label="Price" />
      <LevelField label="Level" />
      <FunctionField label="VIP" render={record => record.vip === 1 ? 'Yes' : 'No'} />
      <StatusField source="status" />
      <NumberField source="sort_ortder" label="Order" />
      <EditButton />
    </Datagrid>
  </List>
);

export const MembershipPlansEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" fullWidth />
      <NumberInput source="price" />
      <SelectInput source="level" choices={levelChoices} />
      <SelectInput source="vip" choices={vipChoices} />
      <RichTextInput source="description" fullWidth />
      <SelectInput source="status" choices={[
        { id: 1, name: 'Active' },
        { id: 0, name: 'Inactive' },
      ]} />
      <NumberInput source="sort_ortder" label="Order" />
    </SimpleForm>
  </Edit>
);

export const MembershipPlansCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" fullWidth />
      <NumberInput source="price" />
      <SelectInput source="level" choices={levelChoices} />
      <SelectInput source="vip" choices={vipChoices} />
      <RichTextInput source="description" fullWidth />
      <SelectInput source="status" choices={[
        { id: 1, name: 'Active' },
        { id: 0, name: 'Inactive' },
      ]} defaultValue={1} />
      <NumberInput source="sort_ortder" label="Order" defaultValue={0} />
    </SimpleForm>
  </Create>
);
