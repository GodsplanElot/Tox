# Admin Roles

TOX admin uses two staff roles in addition to superusers.

## Bootstrap Groups

Run this once after migrations:

```powershell
cd backend
python manage.py bootstrap_admin_roles
```

This creates:

- `Editors`
- `Workers`

## Create An Editor

1. Log in as a superuser.
2. Open `/admin/auth/user/add/`.
3. Create the user with username and password.
4. Open the created user detail page.
5. Enable `Staff status`.
6. Add the user to the `Editors` group.
7. Do not enable `Superuser status`.

Editors can review draft and pending content, approve, reject, and move content
back to draft. They cannot manage users, groups, or superuser access unless a
superuser grants separate auth permissions.

## Create A Worker

1. Log in as a superuser.
2. Open `/admin/auth/user/add/`.
3. Create the user with username and password.
4. Open the created user detail page.
5. Enable `Staff status`.
6. Add the user to the `Workers` group.
7. Do not enable `Superuser status`.

Workers can create and edit only their own uploaded content. They can keep
content as draft or submit it for review, but they cannot publish, reject,
delete, manage users, or see another worker's uploads.

## Tracking

Movies, series, seasons, and episodes store:

- `uploaded_by`
- `reviewed_by`
- `submitted_at`
- `published_at`

Workers see a personal upload queue on the admin dashboard. Editors and
superusers see the global review queue.
