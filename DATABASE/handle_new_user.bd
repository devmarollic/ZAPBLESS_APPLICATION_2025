create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$ 
begin
  insert into public."PROFILE" (id, email, "firstName", "lastName")
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name'
  );

  raise notice 'Novo perfil inserido para o usuário com email: %', new.raw_user_meta_data ->> 'email';

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();