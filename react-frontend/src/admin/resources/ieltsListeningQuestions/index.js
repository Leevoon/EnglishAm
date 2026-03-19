import React from 'react';
import {
  List, Datagrid, TextField, NumberField, EditButton, DeleteButton,
  Edit, Create, SimpleForm, TextInput, NumberInput, SelectInput, Filter,
  useRecordContext, ArrayInput, SimpleFormIterator, BooleanInput,
} from 'react-admin';
import { RichTextInput } from 'ra-input-rich-text';

const IeltsListeningQuestionFilter = (props) => (
  <Filter {...props}>
    <NumberInput label="Listening ID" source="ielts_listening_id" alwaysOn />
  </Filter>
);

export const IeltsListeningQuestionList = (props) => (
  <List {...props} filters={<IeltsListeningQuestionFilter />}>
    <Datagrid>
      <TextField source="id" />
      <NumberField source="ielts_listening_id" />
      <TextField source="question" />
      <NumberField source="answer_count" />
      <NumberField source="sort_order" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const IeltsListeningQuestionEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <NumberInput source="ielts_listening_id" label="Listening ID" />
      <TextInput source="question" multiline />
      <TextInput source="sentences" multiline label="Sentences" />
      <TextInput source="listening_audio" label="Listening Audio" />
      <NumberInput source="sort_order" />
      <ArrayInput source="answers">
        <SimpleFormIterator>
          <TextInput source="answer" />
          <BooleanInput source="is_correct" />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Edit>
);

export const IeltsListeningQuestionCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <NumberInput source="ielts_listening_id" label="Listening ID" />
      <TextInput source="question" multiline />
      <TextInput source="sentences" multiline label="Sentences" />
      <TextInput source="listening_audio" label="Listening Audio" />
      <NumberInput source="sort_order" />
      <ArrayInput source="answers">
        <SimpleFormIterator>
          <TextInput source="answer" />
          <BooleanInput source="is_correct" />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Create>
);
