import React from 'react';
import {
  List, Datagrid, NumberField,
  Edit, Create, SimpleForm, TextInput, NumberInput,
  ArrayInput, SimpleFormIterator, BooleanInput,
  required, EditButton,
} from 'react-admin';
import { HtmlPreviewField } from '../../components';

const filters = [
  <NumberInput source="ielts_listening_id" label="Listening Section ID" alwaysOn />,
];

export const IeltsListeningQuestionList = () => (
  <List filters={filters} perPage={25}>
    <Datagrid rowClick="edit" bulkActionButtons={false}>
      <NumberField source="id" />
      <NumberField source="ielts_listening_id" label="Section ID" />
      <HtmlPreviewField source="question" label="Question" maxLength={100} />
      <NumberField source="answer_count" label="Answers" />
      <NumberField source="sort_order" label="Order" />
      <EditButton />
    </Datagrid>
  </List>
);

export const IeltsListeningQuestionEdit = () => (
  <Edit>
    <SimpleForm>
      <NumberInput source="id" disabled />
      <NumberInput source="ielts_listening_id" label="Listening Section ID" validate={required()} />
      <TextInput source="question" label="Question" multiline fullWidth rows={3} />
      <TextInput source="sentences" label="Sentences" multiline fullWidth rows={2} />
      <TextInput source="listening_audio" label="Audio File" fullWidth />
      <NumberInput source="sort_order" label="Order" />
      <ArrayInput source="answers" label="Answer Options">
        <SimpleFormIterator inline>
          <TextInput source="answer" label="Answer Text" sx={{ width: 400 }} />
          <BooleanInput source="true_false" label="Correct?" />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Edit>
);

export const IeltsListeningQuestionCreate = () => (
  <Create>
    <SimpleForm>
      <NumberInput source="ielts_listening_id" label="Listening Section ID" validate={required()} />
      <TextInput source="question" label="Question" multiline fullWidth rows={3} />
      <TextInput source="sentences" label="Sentences" multiline fullWidth rows={2} />
      <TextInput source="listening_audio" label="Audio File" fullWidth />
      <NumberInput source="sort_order" label="Order" defaultValue={0} />
      <ArrayInput source="answers" label="Answer Options">
        <SimpleFormIterator inline>
          <TextInput source="answer" label="Answer Text" sx={{ width: 400 }} />
          <BooleanInput source="true_false" label="Correct?" defaultValue={false} />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Create>
);
