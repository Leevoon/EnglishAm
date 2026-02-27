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

const LanguageFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Search" source="q" alwaysOn />
  </Filter>
);

const StatusField = () => {
  const record = useRecordContext();
  return <span>{record?.status === 1 ? 'Active' : 'Inactive'}</span>;
};

export const LanguageList = () => (
  <List filters={<LanguageFilter />} sort={{ field: 'sort_order', order: 'ASC' }}>
    <Datagrid rowClick="edit">
      <NumberField source="id" />
      <TextField source="name" />
      <TextField source="code" />
      <StatusField source="status" label="Status" />
      <NumberField source="sort_order" label="Order" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const LanguageEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" disabled />
      <TextInput source="name" fullWidth required />
      <TextInput source="code" label="Language Code (e.g., en, hy, ru)" required />
      <TextInput source="image" label="Flag Image Path" fullWidth />
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

export const LanguageCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" fullWidth required />
      <TextInput source="code" label="Language Code (e.g., en, hy, ru)" required />
      <TextInput source="image" label="Flag Image Path" fullWidth />
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

