import React from 'react';
import {
  List, Datagrid, TextField, NumberField,
  Edit, Create, SimpleForm, TextInput, NumberInput, SelectInput,
  ArrayInput, SimpleFormIterator, BooleanInput,
  required, EditButton,
} from 'react-admin';
import { StatusField, HtmlPreviewField } from '../../components';

const filters = [
  <NumberInput source="toefl_listening_test_id" label="Listening Part ID" alwaysOn />,
];

export const ToeflListeningQuestionList = () => (
  <List filters={filters} perPage={25}>
    <Datagrid rowClick="edit" bulkActionButtons={false}>
      <NumberField source="id" />
      <NumberField source="toefl_listening_test_id" label="Part ID" />
      <HtmlPreviewField source="question" label="Question" maxLength={100} />
      <TextField source="audio" label="Audio" />
      <NumberField source="answer_count" label="Answers" />
      <StatusField source="status" />
      <EditButton />
    </Datagrid>
  </List>
);

export const ToeflListeningQuestionEdit = () => (
  <Edit>
    <SimpleForm>
      <NumberInput source="id" disabled />
      <NumberInput source="toefl_listening_test_id" label="Listening Part ID" validate={required()} />
      <TextInput source="question" label="Question" multiline fullWidth rows={3} />
      <TextInput source="audio" label="Audio File" fullWidth />
      <SelectInput source="status" choices={[
        { id: 1, name: 'Active' },
        { id: 0, name: 'Inactive' },
      ]} />
      <ArrayInput source="answers" label="Answer Options">
        <SimpleFormIterator inline>
          <TextInput source="value" label="Answer Text" sx={{ width: 400 }} />
          <BooleanInput source="true_false" label="Correct?" />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Edit>
);

export const ToeflListeningQuestionCreate = () => (
  <Create>
    <SimpleForm>
      <NumberInput source="toefl_listening_test_id" label="Listening Part ID" validate={required()} />
      <TextInput source="question" label="Question" multiline fullWidth rows={3} />
      <TextInput source="audio" label="Audio File" fullWidth />
      <SelectInput source="status" choices={[
        { id: 1, name: 'Active' },
        { id: 0, name: 'Inactive' },
      ]} defaultValue={1} />
      <ArrayInput source="answers" label="Answer Options">
        <SimpleFormIterator inline>
          <TextInput source="value" label="Answer Text" sx={{ width: 400 }} />
          <BooleanInput source="true_false" label="Correct?" defaultValue={false} />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Create>
);
