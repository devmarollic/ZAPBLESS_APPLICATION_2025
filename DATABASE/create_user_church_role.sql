create table public."USER_CHURCH_ROLE" (
  "profileId" uuid not null,
  "churchId" character varying(22) not null,
  "roleSlug" text not null,
  constraint constraint_user_church_role_church_2 foreign key ("churchId") references "CHURCH" (id) on delete set null,
  constraint constraint_user_church_role_profile_1 foreign key ("profileId") references "PROFILE" (id) on delete set null,
  constraint constraint_user_church_role_role_3 foreign key ("roleSlug") references "ROLE" (slug) on delete set null,
  primary key ("profileId", "churchId", "roleSlug")
);
