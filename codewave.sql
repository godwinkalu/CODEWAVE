CREATE DATABASE codewave;

CREATE TABLE codewave.studenttable(
student_id varchar(234) Not Null default(uuid()),
fullname varchar(234),
email varchar(234) Not null unique,
stack varchar(234) not null,
PRIMARY KEY  (student_id)
);
CREATE TABLE codewave.studentscores(
score_id varchar(234) not null default(uuid()),
student_id varchar(234) not null,
punctuality integer,
assignment integer ,
totalScore integer,
PRIMARY KEY (score_id),
foreign key(student_id) references studenttable(student_id)
);