"""Data-derived menu structure.

Sources (all from the database — nothing about which sections exist or what
they contain is hardcoded):

  1. settings.menu_control (JSON) — defines which top-level slugs exist
     and their visibility flag. This is the authoritative list.

  2. category.key — when a menu_control slug matches a category row's `key`
     (e.g. menu_control 'tests' ↔ category.key='test'), the section is a
     category picker: its sub-items are the children of that category.

  3. Table prefix scan — for slugs that don't match a category key, look for
     `<slug>_<skill>` tables (and `<slug>_<skill>_test` as fallback).
     Whatever skill tables exist become the subsections. Skills checked are
     the four English exam skills + 'complete' aggregator.

Sections that produce no subsections (no matching category, no matching
tables) are returned with `kind='unsupported'` and an empty subsections
list. The frontend can decide whether to show them dimmed or hide them.
"""
import json
import re

from django.apps import apps
from django.db import connection
from rest_framework.decorators import api_view, permission_classes
from rest_framework.metadata import SimpleMetadata
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

SKILLS = [
    ('reading', 'Reading', 'fa-book'),
    ('listening', 'Listening', 'fa-headphones'),
    ('speaking', 'Speaking', 'fa-microphone'),
    ('writing', 'Writing', 'fa-pencil'),
    ('complete', 'Complete', 'fa-check-circle'),
]


def _menu_control():
    with connection.cursor() as cur:
        cur.execute("SELECT value FROM settings WHERE `key`='menu_control'")
        row = cur.fetchone()
    if not row:
        return {}
    try:
        raw = json.loads(row[0])
    except (TypeError, ValueError):
        return {}
    return {k: v == '1' for k, v in raw.items()}


def _category_by_key():
    """Map of category.key → category.id for rows that have a key."""
    with connection.cursor() as cur:
        cur.execute("SELECT `key`, id FROM category WHERE `key` IS NOT NULL AND `key`<>''")
        return dict(cur.fetchall())


def _all_tables():
    return {m._meta.db_table for m in apps.get_app_config('english').get_models()}


def _slug_variants(slug):
    """Possible singular/plural forms a menu slug might match in data."""
    variants = {slug}
    if slug.endswith('s'):
        variants.add(slug[:-1])
    else:
        variants.add(slug + 's')
    return variants


def _find_skill_table(tables, slug, skill):
    """Exact match only — try `<slug>_<skill>` then `<slug>_<skill>_test`."""
    for candidate in (f'{slug}_{skill}', f'{slug}_{skill}_test'):
        if candidate in tables:
            return candidate
    return None


def _humanize(slug):
    return ' '.join(w.capitalize() for w in re.split(r'[_\s]+', slug))


def _resolve_section(slug, tables, cat_by_key):
    """Decide what kind of section this slug is and return its config."""
    # 1) Category-style: a category row has this slug (or its singular) as key.
    for v in _slug_variants(slug):
        if v in cat_by_key:
            return {
                'kind': 'categories',
                'category_id': cat_by_key[v],
                'subsections': [],
            }

    # 2) Skill-style: look for `<slug>_<skill>` tables.
    subs = []
    for skill_slug, label, icon in SKILLS:
        table = _find_skill_table(tables, slug, skill_slug)
        if table:
            subs.append({'slug': skill_slug, 'label': label, 'icon': icon, 'table': table})
    if subs:
        return {'kind': 'skills', 'subsections': subs}

    # 3) Nothing matched — no data backing for this slug.
    return {'kind': 'unsupported', 'subsections': []}


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def sections(request):
    menu_control = _menu_control()
    tables = _all_tables()
    cat_by_key = _category_by_key()

    out = {}
    for slug, visible in menu_control.items():
        cfg = _resolve_section(slug, tables, cat_by_key)
        cfg['slug'] = slug
        cfg['label'] = _humanize(slug)
        cfg['visible'] = visible
        out[slug] = cfg

    return Response({
        'menu_control': menu_control,
        'sections': out,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def relations(request, table):
    """Children of `table` — every table that has a FK column pointing to it.

    Used by the composite editor to know which child tables to show as tabs
    under a parent row. Field metadata for the table itself stays in
    /api/schema/<table>/ — relations is only about the FK graph.
    """
    db_name = connection.settings_dict['NAME']
    with connection.cursor() as cur:
        cur.execute(
            """
            SELECT TABLE_NAME, COLUMN_NAME
            FROM information_schema.KEY_COLUMN_USAGE
            WHERE TABLE_SCHEMA = %s AND REFERENCED_TABLE_NAME = %s
            ORDER BY TABLE_NAME, COLUMN_NAME
            """,
            [db_name, table],
        )
        rows = cur.fetchall()
    children = [{'table': t, 'fk_column': c, 'fk_field': c.removesuffix('_id')} for t, c in rows]
    return Response({'table': table, 'children': children})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def schema(request, table):
    """Field metadata for a table — same shape as DRF's OPTIONS `actions.POST`.

    Exposed under GET because dev-server proxies (Vite, webpack) typically
    intercept OPTIONS as CORS preflight and never forward them to Django.
    """
    from .api import build_registry  # local import: serializers depend on app registry

    viewset_cls = next((vs for prefix, vs in build_registry() if prefix == table), None)
    if viewset_cls is None:
        return Response({'detail': f'No viewset for table {table!r}'}, status=404)

    view = viewset_cls()
    view.request = request
    view.format_kwarg = None
    serializer = view.get_serializer()
    fields = SimpleMetadata().get_serializer_info(serializer)
    return Response({'fields': fields})
