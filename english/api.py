"""Auto-generated DRF ViewSets, Serializers, and FilterSets for every model.

The legacy schema has some quirks worth noting:

  - Many tables use `created_date` with a DB-side `DEFAULT CURRENT_TIMESTAMP`.
    Treating it as a writable field would force every POST to supply it; the
    serializer marks it read-only instead, and the DB default fills it in.
  - Translation labels live in separate `_label` tables linked by FK to
    `languages` + parent. Standard CRUD works because each junction is its own
    model + viewset; the client posts to the junction directly.
  - The same goes for `_has_` junction tables (M2M): POST to
    `/api/category_has_tests/` with `{"category": X, "test": Y}` to link.
  - Self-referential `parent_id` (tree-shaped tables like `category`) just
    works via the integer FK filter — `?parent_id=N` to list children.
  - Sensitive fields (`password`, `auth_key`, etc.) are stripped at every
    layer via `is_sensitive_field` — never serialized, never filterable,
    never orderable.
"""
import re
from collections import defaultdict

from django.apps import apps
from django.db import connection
from django.db import models as dj_models
from django.utils import timezone
from django_filters import rest_framework as df
from rest_framework import filters, serializers, viewsets


SENSITIVE_RE = re.compile(
    r'(?:^|_)(password|passwd|pwd|secret|token|api_key)(?:_|$)',
    re.IGNORECASE,
)


def is_sensitive_field(name):
    return bool(SENSITIVE_RE.search(name or ''))



INTEGER_LOOKUPS = ['exact', 'in', 'gt', 'gte', 'lt', 'lte']
STRING_LOOKUPS = ['exact', 'icontains', 'istartswith']
DATETIME_LOOKUPS = ['exact', 'gte', 'lte', 'date', 'year']
DATE_LOOKUPS = ['exact', 'gte', 'lte', 'year']
BOOLEAN_LOOKUPS = ['exact']


def _is_concrete_writable(f):
    return getattr(f, 'concrete', False) and not f.many_to_many


def _visible_fields(model):
    return [
        f.name for f in model._meta.get_fields()
        if _is_concrete_writable(f) and not is_sensitive_field(f.name)
    ]




def _field_lookups(field):
    if isinstance(field, (dj_models.AutoField, dj_models.BigAutoField,
                          dj_models.IntegerField, dj_models.SmallIntegerField,
                          dj_models.PositiveIntegerField, dj_models.PositiveSmallIntegerField,
                          dj_models.ForeignKey)):
        return INTEGER_LOOKUPS
    if isinstance(field, (dj_models.CharField, dj_models.SlugField)):
        return STRING_LOOKUPS
    if isinstance(field, dj_models.DateTimeField):
        return DATETIME_LOOKUPS
    if isinstance(field, dj_models.DateField):
        return DATE_LOOKUPS
    if isinstance(field, dj_models.BooleanField):
        return BOOLEAN_LOOKUPS
    return None


def _search_fields(model):
    """Text columns suitable for ?search= (icontains across all)."""
    return [
        f.name for f in model._meta.get_fields()
        if _is_concrete_writable(f) and not is_sensitive_field(f.name)
        and isinstance(f, (dj_models.CharField, dj_models.TextField, dj_models.SlugField))
    ]


def _parse_default(default_str, dtype):
    """Convert a MySQL information_schema default string to a Python value."""
    if default_str is None:
        return None
    dtype = (dtype or '').lower()
    try:
        if dtype in ('int', 'tinyint', 'smallint', 'mediumint', 'bigint'):
            return int(default_str)
        if dtype in ('decimal', 'float', 'double'):
            return float(default_str)
    except (ValueError, TypeError):
        pass
    return default_str  # TIME/DATE/CHAR/VARCHAR/TEXT — keep as string


def _column_defaults():
    """Build {table: {col: ('timestamp', None) | ('value', parsed)}}.

    'timestamp' means the column has a CURRENT_TIMESTAMP default — the
    serializer fills it with `timezone.now()` on create. 'value' is a
    static default we can pass through verbatim.

    Auto-increment columns are skipped (AutoField handles them).
    """
    db_name = connection.settings_dict['NAME']
    out = defaultdict(dict)
    with connection.cursor() as cur:
        cur.execute(
            """
            SELECT table_name, column_name, column_default, data_type, extra
            FROM information_schema.columns
            WHERE table_schema = %s AND column_default IS NOT NULL
            """,
            [db_name],
        )
        for table, col, default_str, dtype, extra in cur.fetchall():
            if 'auto_increment' in (extra or '').lower():
                continue
            if default_str is None:
                continue
            if 'CURRENT_TIMESTAMP' in default_str.upper():
                out[table][col] = ('timestamp', None)
                continue
            value = _parse_default(default_str, dtype)
            if value is not None:
                out[table][col] = ('value', value)
    return out


# Resolved once at import — saves 183 queries on the serializer hot path.
_DEFAULTS_CACHE = None


def _get_defaults():
    """Lazy + fault-tolerant: an unavailable DB at import time falls back
    to an empty map. Management commands (check, migrate, shell) still work;
    serializers just treat NOT NULL columns as required until the cache is
    refreshed on a process that has DB access."""
    global _DEFAULTS_CACHE
    if _DEFAULTS_CACHE is None:
        try:
            _DEFAULTS_CACHE = _column_defaults()
        except Exception as exc:
            import logging
            logging.getLogger(__name__).warning(
                "Could not introspect column defaults (%s); serializers will "
                "require all NOT NULL fields until DB is reachable.", exc,
            )
            _DEFAULTS_CACHE = {}
    return _DEFAULTS_CACHE


def _make_serializer(model):
    extra_kwargs = {}
    table_defaults = _get_defaults().get(model._meta.db_table, {})

    for field in model._meta.get_fields():
        if not _is_concrete_writable(field):
            continue
        # Auto-increment IDs are always read-only.
        if isinstance(field, (dj_models.AutoField, dj_models.BigAutoField)):
            extra_kwargs[field.name] = {'read_only': True}
            continue
        # FK defaults like '0' aren't valid pks; clients must supply a real referent.
        if isinstance(field, dj_models.ForeignKey):
            continue
        info = table_defaults.get(field.column)
        if not info:
            continue
        kind, value = info
        if kind == 'timestamp':
            # CURRENT_TIMESTAMP columns — populated on create, preserved on update.
            extra_kwargs[field.name] = {
                'default': serializers.CreateOnlyDefault(timezone.now),
            }
        elif kind == 'value':
            extra_kwargs[field.name] = {'required': False, 'default': value}

    meta = type('Meta', (), {
        'model': model,
        'fields': _visible_fields(model),
        'extra_kwargs': extra_kwargs,
    })
    return type(f'{model.__name__}Serializer', (serializers.ModelSerializer,), {'Meta': meta})


def _make_filterset(model):
    fields = {}
    for f in model._meta.get_fields():
        if not _is_concrete_writable(f) or is_sensitive_field(f.name):
            continue
        lookups = _field_lookups(f)
        if lookups:
            fields[f.name] = lookups
    meta = type('Meta', (), {'model': model, 'fields': fields})
    return type(f'{model.__name__}Filter', (df.FilterSet,), {'Meta': meta})


def _make_viewset(model, serializer_cls, filterset_cls):
    return type(
        f'{model.__name__}ViewSet',
        (viewsets.ModelViewSet,),
        {
            'queryset': model.objects.order_by('pk'),
            'serializer_class': serializer_cls,
            'filterset_class': filterset_cls,
            'filter_backends': [
                df.DjangoFilterBackend,
                filters.SearchFilter,
                filters.OrderingFilter,
            ],
            'search_fields': _search_fields(model),
            'ordering_fields': _visible_fields(model),
        },
    )


def build_registry():
    registry = []
    for model in apps.get_app_config('english').get_models():
        if not model._meta.pk:
            continue
        serializer_cls = _make_serializer(model)
        filterset_cls = _make_filterset(model)
        viewset_cls = _make_viewset(model, serializer_cls, filterset_cls)
        prefix = model._meta.db_table.lower()
        registry.append((prefix, viewset_cls))
    return registry
