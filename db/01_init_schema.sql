CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE job_tags (
  id SERIAL PRIMARY KEY
);

CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  title TEXT NOT NULL,
  description TEXT NOT NULL,

  apply_link TEXT,

  languages TEXT[] NOT NULL,

  lat DECIMAL(8,5),
  lng DECIMAL(8,5),

  mode VARCHAR(20) NOT NULL,
  scrapped_from TEXT,

  remuneration DECIMAL(8,2) NOT NULL DEFAULT 0,
  remuneration_period VARCHAR(20) NOT NULL DEFAULT 'Single',

  contract VARCHAR(30) NOT NULL,

  period_start DATE,
  period_duration INTEGER NOT NULL,
  min_formation_duration INTEGER,

  active BOOLEAN NOT NULL DEFAULT FALSE,
  moderation_feedback TEXT
);

CREATE TABLE activity_domains (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NULL
);

CREATE TABLE student_skills (
   id SERIAL PRIMARY KEY
);

CREATE TABLE skills (
   id SERIAL PRIMARY key,
   name TEXT NOT NULL UNIQUE,
   type VARCHAR(20) NOT NULL
);

CREATE TABLE experiences (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description VARCHAR(10000) NOT NULL,
    begin_date DATE NOT NULL,
    end_date DATE NULL,
    company_fallback_name VARCHAR(255)
);

CREATE TABLE formations (
    id SERIAL PRIMARY key,
    title TEXT NOT NULL,
    info_url TEXT NULL,
    description TEXT NULL,
    optention_date DATE NULL,
    duration INTEGER NOT NULL,
    activity_domain_id INTEGER
);

/*CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    birthdate DATE,
    bio TEXT NOT NULL,
    links TEXT NOT NULL
);

CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    bio TEXT NOT NULL,
    creation_date DATE,
    scrapped_from TEXT NULL,
    website TEXT NULL
); déja crée par johan */

CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id INTEGER NOT NULL,
    job_id UUID NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING');


    /* j'ai pas mis les FK et donc aussi je les ais pas référencies aussi. */