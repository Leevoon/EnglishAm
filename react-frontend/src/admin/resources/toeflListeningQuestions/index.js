import React from 'react';
import {
  List, Datagrid, TextField, NumberField, EditButton, DeleteButton,
  Edit, Create, SimpleForm, TextInput, NumberInput, SelectInput, Filter,
  useRecordContext,
  ArrayInput, SimpleFormIterator, BooleanInput,
} from 'react-admin';

const statusChoices = [
  { id: 'active', name: 'Active' },
  { id: 'inactive', name: 'Inactive' },
];

const ToeflListeningQuestionFilter = (props) => (
  <Filter {...props}>
    <NumberInput source="toefl_listening_test_id" label="Listening Test ID" alwaysOn />
  </Filter>
);

export const ToeflListeningQuestionList = (props) => (
  <List {...props} filters={<ToeflListeningQuestionFilter />}>
    <Datagrid>
      <TextField source="id" />
      <NumberField source="toefl_listening_test_id" />
      <TextField source="question" />
      <TextField source="audio" />
      <NumberField source="answer_count" />
      <TextField source="status" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const ToeflListeningQuestionEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <NumberInput source="toefl_listening_test_id" />
      <TextInput source="question" multiline fullWidth />
      <TextInput source="audio" />
      <SelectInput source="status" choices={statusChoices} />
      <ArrayInput source="answers">
        <SimpleFormIterator>
          <TextInput source="value" />
          <BooleanInput source="is_correct" label="Correct?" />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Edit>
);

export const ToeflListeningQuestionCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <NumberInput source="toefl_listening_test_id" />
      <TextInput source="question" multiline fullWidth />
      <TextInput source="audio" />
      <SelectInput source="status" choices={statusChoices} />
      <ArrayInput source="answers">
        <SimpleFormIterator>
          <TextInput source="value" />
          <BooleanInput source="is_correct" label="Correct?" />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Create>
);
