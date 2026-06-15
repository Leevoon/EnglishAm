import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Page from './Page';

const AUTH = 'Basic ' + btoa('admin:admin');

export default function CategoryTests() {
  const { categoryId } = useParams();
  const [name, setName] = useState(`Category #${categoryId}`);

  useEffect(() => {
    fetch(`/api/category_label/?category=${categoryId}&language=1`, {
      headers: { Authorization: AUTH, Accept: 'application/json' },
    })
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((d) => {
        const first = d.results?.[0];
        if (first) setName(first.value || first.name || `Category #${categoryId}`);
      })
      .catch(() => {});
  }, [categoryId]);

  return (
    <Page
      title={`Tests · ${name}`}
      table="category_has_tests"
      extraQuery={`category=${categoryId}`}
    />
  );
}
