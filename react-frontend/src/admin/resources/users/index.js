import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  EmailField,
  NumberField,
  DateField,
  EditButton,
  DeleteButton,
  Edit,
  Create,
  SimpleForm,
  TextInput,
  SelectInput,
  PasswordInput,
  Filter,
  useRecordContext,
} from 'react-admin';

const UserFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Search" source="q" alwaysOn />
    <SelectInput
      source="status"
      choices={[
        { id: 1, name: 'Active' },
        { id: 0, name: 'Blocked' },
      ]}
    />
  </Filter>
);

const StatusField = () => {
  const record = useRecordContext();
  return <span>{record?.status === 1 ? 'Active' : 'Blocked'}</span>;
};

export const UserList = () => (
  <List filters={<UserFilter />} sort={{ field: 'id', order: 'DESC' }}>
    <Datagrid rowClick="edit">
      <NumberField source="id" />
      <EmailField source="email" />
      <TextField source="first_name" label="First Name" />
      <TextField source="last_name" label="Last Name" />
      <StatusField source="status" label="Status" />
      <DateField source="created_date" label="Created" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const UserEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" disabled />
      <TextInput source="email" type="email" fullWidth required />
      <PasswordInput source="password" label="New Password (leave empty to keep current)" fullWidth />
      <TextInput source="user_name" label="Username" fullWidth />
      <TextInput source="first_name" label="First Name" fullWidth />
      <TextInput source="last_name" label="Last Name" fullWidth />
      <SelectInput
        source="status"
        choices={[
          { id: 1, name: 'Active' },
          { id: 0, name: 'Blocked' },
        ]}
      />
    </SimpleForm>
  </Edit>
);

export const UserCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="email" type="email" fullWidth required />
      <PasswordInput source="password" fullWidth required />
      <TextInput source="user_name" label="Username" fullWidth />
      <TextInput source="first_name" label="First Name" fullWidth />
      <TextInput source="last_name" label="Last Name" fullWidth />
      <SelectInput
        source="status"
        choices={[
          { id: 1, name: 'Active' },
          { id: 0, name: 'Blocked' },
        ]}
        defaultValue={1}
      />
    </SimpleForm>
  </Create>
);
