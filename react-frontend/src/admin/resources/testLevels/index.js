import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  EditButton,
  DeleteButton,
  Edit,
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  SelectInput,
  Filter,
  useRecordContext,
} from 'react-admin';

const TestLevelFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Search" source="q" alwaysOn />
  </Filter>
);

const StatusField = () => {
  const record = useRecordContext();
  return <span>{record?.status === 1 ? 'Active' : 'Inactive'}</span>;
};

export const TestLevelList = () => (
  <List filters={<TestLevelFilter />} sort={{ field: 'sort_order', order: 'ASC' }}>
    <Datagrid rowClick="edit">
      <NumberField source="id" />
      <TextField source="name" />
      <StatusField source="status" label="Status" />
      <NumberField source="sort_order" label="Order" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const TestLevelEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" disabled />
      <TextInput source="name" fullWidth required />
      <SelectInput
        source="status"
        choices={[
          { id: 1, name: 'Active' },
          { id: 0, name: 'Inactive' },
        ]}
      />
      <NumberInput source="sort_order" label="Sort Order" defaultValue={0} />
    </SimpleForm>
  </Edit>
);

export const TestLevelCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" fullWidth required />
      <SelectInput
        source="status"
        choices={[
          { id: 1, name: 'Active' },
          { id: 0, name: 'Inactive' },
        ]}
        defaultValue={1}
      />
      <NumberInput source="sort_order" label="Sort Order" defaultValue={0} />
    </SimpleForm>
  </Create>
);

