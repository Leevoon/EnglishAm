import React from 'react';
import {
  List, Datagrid, TextField, EmailField, DateField, BooleanField,
  Show, SimpleShowLayout, ShowButton,
} from 'react-admin';

export const ContactMessagesList = (props) => (
  <List {...props} sort={{ field: 'created_date', order: 'DESC' }}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <BooleanField source="status" looseValue label="Read" />
      <TextField source="name" />
      <EmailField source="email" />
      <TextField source="subject" />
      <DateField source="created_date" />
      <ShowButton />
    </Datagrid>
  </List>
);

export const ContactMessagesShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <EmailField source="email" />
      <TextField source="subject" />
      <TextField source="body" component="pre" />
      <DateField source="created_date" />
    </SimpleShowLayout>
  </Show>
);
