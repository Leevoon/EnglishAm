import React from 'react';
export default function Spinner({ inline }) {
  if (inline) return <span className="spinner" />;
  return <div className="container empty"><div className="spinner" /></div>;
}
