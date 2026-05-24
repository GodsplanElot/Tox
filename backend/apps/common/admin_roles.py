from django.core.exceptions import PermissionDenied


EDITOR_GROUP = "Editors"
WORKER_GROUP = "Workers"
WORKER_STATUSES = ("draft", "pending_review")


def is_editor(user):
    return bool(
        user
        and user.is_active
        and (user.is_superuser or user.groups.filter(name=EDITOR_GROUP).exists())
    )


def is_worker(user):
    return bool(
        user
        and user.is_active
        and not user.is_superuser
        and user.groups.filter(name=WORKER_GROUP).exists()
    )


def is_content_staff(user):
    return is_editor(user) or is_worker(user)


class ContentRoleAdminMixin:
    worker_statuses = WORKER_STATUSES
    worker_actions = ("submit_for_review", "move_to_draft")

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        if request.user.is_superuser or is_editor(request.user):
            return queryset
        if is_worker(request.user):
            return queryset.filter(uploaded_by=request.user)
        return queryset.none()

    def has_module_permission(self, request):
        return request.user.is_superuser or is_content_staff(request.user)

    def has_view_permission(self, request, obj=None):
        if request.user.is_superuser or is_editor(request.user):
            return True
        if is_worker(request.user):
            return obj is None or obj.uploaded_by_id == request.user.id
        return False

    def has_add_permission(self, request):
        return request.user.is_superuser or is_content_staff(request.user)

    def has_change_permission(self, request, obj=None):
        if request.user.is_superuser or is_editor(request.user):
            return True
        if is_worker(request.user):
            if obj is None:
                return True
            return obj.uploaded_by_id == request.user.id and obj.status in self.worker_statuses
        return False

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser

    def get_actions(self, request):
        actions = super().get_actions(request)
        if request.user.is_superuser or is_editor(request.user):
            return actions
        if is_worker(request.user):
            return {
                name: action
                for name, action in actions.items()
                if name in self.worker_actions
            }
        return {}

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        status_field = form.base_fields.get("status")
        if status_field and is_worker(request.user):
            status_field.choices = [
                choice
                for choice in status_field.choices
                if choice[0] in self.worker_statuses
            ]
        return form

    def save_model(self, request, obj, form, change):
        if is_worker(request.user) and obj.status not in self.worker_statuses:
            raise PermissionDenied("Workers can only save drafts or submit content for review.")
        if not obj.uploaded_by_id:
            obj.uploaded_by = request.user
        super().save_model(request, obj, form, change)

    def save_formset(self, request, form, formset, change):
        instances = formset.save(commit=False)
        for obj in instances:
            if hasattr(obj, "status") and is_worker(request.user) and obj.status not in self.worker_statuses:
                raise PermissionDenied("Workers can only save drafts or submit content for review.")
            if hasattr(obj, "uploaded_by_id") and not obj.uploaded_by_id:
                obj.uploaded_by = request.user
            obj.save()
        formset.save_m2m()
