import React from 'react';
import {
  List, Datagrid, TextField, NumberField, EditButton, DeleteButton,
  Edit, Create, SimpleForm, TextInput, NumberInput, SelectInput, Filter,
  useRecordContext,
} from 'react-admin';

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
  0: 'Test',
  1: 'TOEFL Reading',
  2: 'TOEFL Listening',
  3: 'TOEFL Speaking',
  4: 'TOEFL Writing',
  5: 'IELTS Reading',
  6: 'IELTS Listening',
  7: 'IELTS Speaking',
  8: 'IELTS Writing',
};

const TypeField = ({ source }) => {
  const record = useRecordContext();
  if (!record) return null;
  return <span>{typeLabels[record[source]] || record[source]}</span>;
};

const MembershipAccessFilter = (props) => (
  <Filter {...props}>
    <NumberInput label="Membership ID" source="membership_id" alwaysOn />
    <NumberInput label="Test ID" source="test_id" />
    <SelectInput label="Type" source="type" choices={typeChoices} />
  </Filter>
);

export const MembershipAccessList = () => (
  <List filters={<MembershipAccessFilter />}>
    <Datagrid>
      <TextField source="id" />
      <NumberField source="membership_id" />
      <NumberField source="test_id" />
      <TypeField source="type" label="Type" />
      <TextField source="membership_name" />
      <TextField source="membership_level" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const MembershipAccessEdit = () => (
  <Edit>
    <SimpleForm>
      <NumberInput source="membership_id" />
      <NumberInput source="test_id" />
      <SelectInput source="type" choices={typeChoices} />
    </SimpleForm>
  </Edit>
);

export const MembershipAccessCreate = () => (
  <Create>
    <SimpleForm>
      <NumberInput source="membership_id" />
      <NumberInput source="test_id" />
      <SelectInput source="type" choices={typeChoices} />
    </SimpleForm>
  </Create>
);
