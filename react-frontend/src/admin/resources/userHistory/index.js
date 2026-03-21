import React from 'react';
import {
  List, Datagrid, TextField, NumberField, DateField,
  TextInput, NumberInput, FunctionField,
} from 'react-admin';

const filters = [
  <NumberInput source="user_id" label="User ID" alwaysOn />,
  <TextInput source="test_type" label="Test Type" alwaysOn />,
];

export const UserHistoryList = () => (
  <List filters={filters} sort={{ field: 'id', order: 'DESC' }} perPage={25}>
    <Datagrid bulkActionButtons={false}>
      <NumberField source="id" />
      <NumberField source="user_id" label="User" />
      <TextField source="user_name" label="Username" />
      <NumberField source="test_id" label="Test" />
      <TextField source="test_type" label="Type" />
      <TextField source="section" />
      <TextField source="duration" />
      <FunctionField label="Score" render={record =>
        record.score != null ? `${record.score}/${record.score_from || '?'}` : '-'
      } />
      <DateField source="created_date" label="Date" showTime />
    </Datagrid>
  </List>
);
