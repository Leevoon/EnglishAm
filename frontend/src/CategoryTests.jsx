import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Page from './Page';
import { apiJson } from './api';

export default function CategoryTests() {
  const { categoryId } = useParams();
  const [name, setName] = useState(`Category #${categoryId}`);

  useEffect(() => {
    apiJson(`/api/category_label/?category=${categoryId}&language=1`)
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
