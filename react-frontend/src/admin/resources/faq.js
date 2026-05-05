import React from 'react';
import {
  List, Datagrid, TextField, BooleanField, DateField, NumberField, EditButton,
  Edit, SimpleForm, TextInput, BooleanInput, NumberInput,
  Create,
} from 'react-admin';

export const FaqList = (props) => (
  <List {...props} sort={{ field: 'sort_order', order: 'ASC' }}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <BooleanField source="status" looseValue />
      <NumberField source="sort_order" />
      <DateField source="created_date" />
      <EditButton />
    </Datagrid>
  </List>
);

const Form = ({ create }) => (
  <SimpleForm>
    {!create && <TextInput disabled source="id" />}
    <BooleanInput source="status" defaultValue={true} />
    <NumberInput source="sort_order" defaultValue={0} />
  </SimpleForm>
);

export const FaqEdit = (props) => <Edit {...props}><Form /></Edit>;
export const FaqCreate = (props) => <Create {...props}><Form create /></Create>;
