import React from 'react';
import {
  List, Datagrid, TextField, NumberField, Filter,
  TextInput, NumberInput, SelectInput,
  useRecordContext,
} from 'react-admin';

const UserHistoryFilter = (props) => (
  <Filter {...props}>
    <NumberInput label="User ID" source="user_id" alwaysOn />
    <TextInput label="Test Type" source="test_type" alwaysOn />
  </Filter>
);

export const UserHistoryList = () => (
  <List filters={<UserHistoryFilter />}>
    <Datagrid>
      <TextField source="id" />
      <NumberField source="user_id" />
      <TextField source="user_name" />
      <NumberField source="test_id" />
      <TextField source="test_type" />
      <TextField source="section" />
      <TextField source="duration" />
      <NumberField source="score" />
      <NumberField source="score_from" />
      <TextField source="created_date" />
    </Datagrid>
  </List>
);
