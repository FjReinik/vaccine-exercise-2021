CREATE TABLE vaccine_order (
id varchar(40),
"healthCareDistrict" varchar(4),
"orderNumber" smallint,
"responsiblePerson" varchar(60),
injections smallint,
arrived timestamp,
vaccine varchar(20)
);

CREATE TABLE vaccine_event (
"vaccination-id" varchar(40),
"sourceBottle" varchar(40),
gender varchar(10),
"vaccinationDate" timestamp
);

/**
set my sql checks what I used alongside development - not really accurate as final solutions will employ knex,
but might illuminate the creation process

summing all injections upto a date - checking if thet counts and sums are divisible with each other -> ex. getting 4,5 or 6 which confirms that its correct
select count(vaccine_order.injections), sum(vaccine_order.injections)
from vaccine_order
where vaccine_order.arrived between (DATE '2021-01-01') and (DATE '2021-03-21')
group by vaccine_order.injections






*/