CREATE DATABASE IF NOT EXISTS sih_standards;
USE sih_standards;

CREATE TABLE standards (
    standard_id INT PRIMARY KEY,
    standard_number VARCHAR(100),
    title VARCHAR(500),
    description TEXT,
    category VARCHAR(100),
    status VARCHAR(50),
    document_type VARCHAR(100),
    domain VARCHAR(100),
    keywords TEXT,
    related_terms TEXT,
    application TEXT,
    version_year INT,
    official_source VARCHAR(100),
    verification_status VARCHAR(50)
);

CREATE TABLE standard_references (
    reference_id INT PRIMARY KEY,
    primary_standard_id INT,
    referenced_standard_id INT,
    relationship_type VARCHAR(100),
    description TEXT,
    status VARCHAR(50),
    FOREIGN KEY (primary_standard_id) REFERENCES standards(standard_id),
    FOREIGN KEY (referenced_standard_id) REFERENCES standards(standard_id)
);
