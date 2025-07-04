CREATE UNIQUE INDEX contact_unique_number_per_church
ON public."CONTACT" (number, "churchId");