import React from 'react';
import {
  List, Datagrid, TextField, NumberField,
  Edit, Create, SimpleForm, NumberInput, SelectInput,
  EditButton, FunctionField, useRecordContext,
} from 'react-admin';
import { Chip } from '@mui/material';

const typeChoices = [
  { id: 0, name: 'Test' },
  { id: 1, name: 'TOEFL Reading' },
  { id: 2, name: 'TOEFL Listening' },
  { id: 3, name: 'TOEFL Speaking' },
  { id: 4, name: 'TOEFL Writing' },
  { id: 5, name: 'IELTS Reading' },
  { id: 6, name: 'IELTS Listening' },
  { id: 7, name: 'IELTS Speaking' },
  { id: 8, name: 'IELTS Writing' },
];

const typeLabels = {
  0: 'Test', 1: 'TOEFL Reading', 2: 'TOEFL Listening', 3: 'TOEFL Speaking',
  4: 'TOEFL Writing', 5: 'IELTS Reading', 6: 'IELTS Listening',
  7: 'IELTS Speaking', 8: 'IELTS Writing',
};

const TypeField = () => {
  const record = useRecordContext();
  if (!record) return null;
  const label = typeLabels[record.type] || String(record.type);
  const isToefl = record.type >= 1 && record.type <= 4;
  const isIelts = record.type >= 5 && record.type <= 8;
  return (
    <Chip
      label={label}
      color={isToefl ? 'primary' : isIelts ? 'secondary' : 'default'}
      size="small"
      variant="outlined"
    />
  );
};

const filters = [
  <NumberInput source="membership_id" label="Membership ID" alwaysOn />,
  <NumberInput source="test_id" label="Test ID" />,
  <SelectInput source="type" label="Type" choices={typeChoices} />,
];

export const MembershipAccessList = () => (
  <List filters={filters} perPage={25}>
    <Datagrid rowClick="edit" bulkActionButtons={false}>
      <NumberField source="id" />
      <NumberField source="membership_id" label="Membership" />
      <NumberField source="test_id" label="Test" />
      <TypeField label="Type" />
      <TextField source="membership_name" label="Plan Name" />
      <TextField source="membership_level" label="Level" />
      <EditButton />
    </Datagrid>
  </List>
);

export const MembershipAccessEdit = () => (
  <Edit>
    <SimpleForm>
      <NumberInput source="membership_id" label="Membership ID" />
      <NumberInput source="test_id" label="Test ID" />
      <SelectInput source="type" choices={typeChoices} />
    </SimpleForm>
  </Edit>
);

export const MembershipAccessCreate = () => (
  <Create>
    <SimpleForm>
      <NumberInput source="membership_id" label="Membership ID" />
      <NumberInput source="test_id" label="Test ID" />
      <SelectInput source="type" choices={typeChoices} />
    </SimpleForm>
  </Create>
);
