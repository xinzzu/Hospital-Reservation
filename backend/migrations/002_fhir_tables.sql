-- FHIR Patient Extension (links to users table)
CREATE TABLE IF NOT EXISTS fhir_patients (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    nik VARCHAR(20),
    blood_type VARCHAR(5),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Conditions (Diagnosis)
CREATE TABLE IF NOT EXISTS fhir_conditions (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES fhir_patients(id) ON DELETE CASCADE,
    clinical_status VARCHAR(50) NOT NULL,
    verification_status VARCHAR(50),
    category VARCHAR(50),
    severity VARCHAR(50),
    code_system VARCHAR(100),
    code_code VARCHAR(50),
    code_display VARCHAR(255),
    onset_date DATE,
    abatement_date DATE,
    recorder_id INTEGER REFERENCES users(id),
    note TEXT,
    fhir_id UUID DEFAULT gen_random_uuid(),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_conditions_patient ON fhir_conditions(patient_id);
CREATE INDEX IF NOT EXISTS idx_conditions_status ON fhir_conditions(clinical_status);

-- Observations (Vitals, Lab Results)
CREATE TABLE IF NOT EXISTS fhir_observations (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES fhir_patients(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    code_system VARCHAR(100),
    code_code VARCHAR(50),
    code_display VARCHAR(255),
    value_type VARCHAR(20),
    value_quantity DECIMAL(10,4),
    value_quantity_unit VARCHAR(50),
    value_string TEXT,
    effective_date TIMESTAMP,
    interpretation VARCHAR(50),
    reference_range_low DECIMAL(10,4),
    reference_range_high DECIMAL(10,4),
    reference_range_text VARCHAR(255),
    component_json JSONB,
    encounter_id INTEGER REFERENCES reservations(id),
    fhir_id UUID DEFAULT gen_random_uuid(),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_observations_patient ON fhir_observations(patient_id);
CREATE INDEX IF NOT EXISTS idx_observations_category ON fhir_observations(category);
CREATE INDEX IF NOT EXISTS idx_observations_date ON fhir_observations(effective_date DESC);

-- Medication Requests (Prescriptions)
CREATE TABLE IF NOT EXISTS fhir_medication_requests (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES fhir_patients(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    intent VARCHAR(50),
    medication_system VARCHAR(100),
    medication_code VARCHAR(50),
    medication_display VARCHAR(255),
    authored_on DATE,
    requester_id INTEGER REFERENCES users(id),
    dosage_text TEXT,
    dosage_route VARCHAR(50),
    dosage_frequency INTEGER,
    dosage_period INTEGER,
    dosage_period_unit VARCHAR(20),
    dispense_quantity INTEGER,
    dispense_unit VARCHAR(50),
    note TEXT,
    fhir_id UUID DEFAULT gen_random_uuid(),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_medreq_patient ON fhir_medication_requests(patient_id);
CREATE INDEX IF NOT EXISTS idx_medreq_status ON fhir_medication_requests(status);

-- Allergies
CREATE TABLE IF NOT EXISTS fhir_allergies (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES fhir_patients(id) ON DELETE CASCADE,
    clinical_status VARCHAR(50) NOT NULL,
    type VARCHAR(50),
    category VARCHAR(50),
    criticality VARCHAR(50),
    substance_system VARCHAR(100),
    substance_code VARCHAR(50),
    substance_display VARCHAR(255),
    reaction_manifestation VARCHAR(255),
    reaction_severity VARCHAR(50),
    note TEXT,
    fhir_id UUID DEFAULT gen_random_uuid(),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_allergies_patient ON fhir_allergies(patient_id);

-- Resource Audit Log
CREATE TABLE IF NOT EXISTS fhir_audit_log (
    id SERIAL PRIMARY KEY,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(50),
    operation VARCHAR(20) NOT NULL,
    performed_by INTEGER REFERENCES users(id),
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    request_details JSONB,
    response_status INTEGER
);

CREATE INDEX IF NOT EXISTS idx_audit_resource ON fhir_audit_log(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_date ON fhir_audit_log(performed_at DESC);
