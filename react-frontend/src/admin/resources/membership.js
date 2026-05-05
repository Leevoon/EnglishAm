import React from 'react';
import {
  List, Datagrid, TextField, BooleanField, NumberField, EditButton,
  Edit, SimpleForm, NumberInput, BooleanInput,
  Create,
} from 'react-admin';

export const MembershipList = (props) => (
  <List {...props} sort={{ field: 'sort_ortder', order: 'ASC' }}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <NumberField source="price" />
      <BooleanField source="vip" looseValue />
      <BooleanField source="status" looseValue />
      <NumberField source="sort_ortder" />
      <EditButton />
    </Datagrid>
  </List>
);

const Form = () => (
  <SimpleForm>
    <NumberInput source="price" defaultValue={0} />
    <BooleanInput source="vip" defaultValue={false} />
    <BooleanInput source="status" defaultValue={true} />
    <NumberInput source="sort_ortder" defaultValue={0} />
  </SimpleForm>
);

export const MembershipEdit = (props) => <Edit {...props}><Form /></Edit>;
export const MembershipCreate = (props) => <Create {...props}><Form /></Create>;
