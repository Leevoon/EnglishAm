from django.apps import apps
from django.contrib import admin
from django.contrib.admin.sites import AlreadyRegistered

from .api import is_sensitive_field


def _sensitive_field_names(model):
    return [
        f.name for f in model._meta.get_fields()
        if getattr(f, 'concrete', False) and not f.many_to_many and is_sensitive_field(f.name)
    ]


for model in apps.get_app_config('english').get_models():
    sensitive = _sensitive_field_names(model)
    admin_cls = type(
        f'{model.__name__}Admin',
        (admin.ModelAdmin,),
        {'exclude': tuple(sensitive)} if sensitive else {},
    )
    try:
        admin.site.register(model, admin_cls)
    except AlreadyRegistered:
        pass
