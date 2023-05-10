CREATE DATABASE IF NOT EXISTS markers;

USE markers;

CREATE TABLE IF NOT EXISTS progetti (
	id int(11) AUTO_INCREMENT NOT NULL,
	nome_progetto varchar(255) unique,
	data_inizio_progetto date,
	data_fine_progetto date,
	citta varchar(255),
	latitudine decimal(20,18),
	longitudine decimal(20,18),
	note varchar(1000),
	PRIMARY KEY (id)
	);