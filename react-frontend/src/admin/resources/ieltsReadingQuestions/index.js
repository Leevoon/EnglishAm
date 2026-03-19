import React from 'react';
import {
  List, Datagrid, TextField, NumberField, EditButton, DeleteButton,
  Edit, Create, SimpleForm, TextInput, NumberInput, SelectInput, Filter,
  useRecordContext, ArrayInput, SimpleFormIterator, BooleanInput,
} from 'react-admin';
import { RichTextInput } from 'ra-input-rich-text';

const IeltsReadingQuestionFilter = (props) => (
  <Filter {...props}>
    <NumberInput label="Reading ID" source="ielts_reading_id" alwaysOn />
  </Filter>
);

export const IeltsReadingQuestionList = (props) => (
  <List {...props} filters={<IeltsReadingQuestionFilter />}>
    <Datagrid>
      <TextField source="id" />
      <NumberField source="ielts_reading_id" />
      <TextField source="question" />
      <NumberField source="answer_count" />
      <NumberField source="sort_order" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const IeltsReadingQuestionEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <NumberInput source="ielts_reading_id" label="Reading ID" />
      <TextInput source="question" multiline />
      <TextInput source="sentences" multiline label="Sentences" />
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

export const IeltsReadingQuestionCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <NumberInput source="ielts_reading_id" label="Reading ID" />
      <TextInput source="question" multiline />
      <TextInput source="sentences" multiline label="Sentences" />
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
