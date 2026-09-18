revoke all on function public.handle_new_user() from public;
revoke all on function public.set_updated_at() from public;
revoke all on function public.has_role(uuid, public.app_role) from public, anon;