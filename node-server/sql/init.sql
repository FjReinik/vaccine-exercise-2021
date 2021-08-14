
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
id varchar(40),
"sourceBottle" varchar(40),
gender varchar(10),
injected varchar(30)
);

