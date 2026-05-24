from django.contrib.auth.models import Group
from django.core.management.base import BaseCommand

from apps.common.admin_roles import EDITOR_GROUP, WORKER_GROUP


class Command(BaseCommand):
    help = "Create the Editors and Workers admin role groups."

    def handle(self, *args, **options):
        for group_name in (EDITOR_GROUP, WORKER_GROUP):
            _group, created = Group.objects.get_or_create(name=group_name)
            status = "created" if created else "already exists"
            self.stdout.write(self.style.SUCCESS(f"{group_name} group {status}."))

        self.stdout.write(
            "Assign users to these groups and enable staff status from the Django admin."
        )
