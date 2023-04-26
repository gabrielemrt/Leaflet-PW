CREATE DATABASE IF NOT EXISTS markers;

USE markers;

CREATE TABLE IF NOT EXISTS progetti (
	nome_progetto varchar(255) unique,
	data_inizio_progetto date,
	data_fine_progetto date,
	latitudine decimal(10,17),
	longitudine decimal(10,17),
	note varchar(1000)
	);