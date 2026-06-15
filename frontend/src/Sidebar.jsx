import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { menu } from './menu';
import { useTestMenuSections } from './useSections';

function TreeNode({ node, dynamicChildren }) {
  const [open, setOpen] = useState(false);
  const children = dynamicChildren ?? node.children ?? [];
  return (
    <li className={`treeview ${open ? 'open' : ''}`}>
      <a href="#" onClick={(e) => { e.preventDefault(); setOpen(!open); }}>
        <i className={`fa ${node.icon} fa-fw`} />
        <span>{node.label}</span>
        <i className={`fa fa-angle-${open ? 'down' : 'left'} pull-right`} />
      </a>
      {open && (
        <ul className="treeview-menu">
          {children.length === 0 && <li><span style={{ padding: '8px 35px', color: '#777', fontSize: 13 }}>No items</span></li>}
          {children.map((c) => (
            <li key={c.path}>
              <NavLink to={c.path}>
                <i className="fa fa-circle-o" />
                {c.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function DynamicTestsTree({ node }) {
  const { items, loading, error } = useTestMenuSections();
  const children = items.map((s) => ({ path: `/${s.slug}`, label: s.label }));
  if (loading) return <TreeNode node={node} dynamicChildren={[{ path: '#', label: 'Loading…' }]} />;
  if (error) return <TreeNode node={node} dynamicChildren={[{ path: '#', label: `Error: ${error}` }]} />;
  return <TreeNode node={node} dynamicChildren={children} />;
}

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <ul className="sidebar-menu">
        {menu.map((node, i) => {
          if (node.type === 'header') return <li key={i} className="header">{node.label}</li>;
          if (node.type === 'tree' && node.dynamic === 'tests') return <DynamicTestsTree key={i} node={node} />;
          if (node.type === 'tree') return <TreeNode key={i} node={node} />;
          return (
            <li key={i}>
              <NavLink to={node.path}>
                <i className={`fa ${node.icon} fa-fw`} />
                <span>{node.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
