# Changelog

All notable changes to GEI-Research are recorded here.

## V1.0.13 — Provenance Drift Detection & Integrity Attestation Engine

- Added canonical SHA-256 content-digest baselines for provenance-tracked research records.
- Added `attestation.schema.json` and canonical `ATT-GEI-V1013-001` integrity attestation.
- Added `PRV-GEI-V1013-001` as a new verified digest-baseline provenance event without rewriting the V1.0.12 historical checkpoint.
- Added live canonical-JSON SHA-256 calculation in the research interface.
- Added drift detection that flags current record content when it no longer matches its verified baseline.
- Added PASS / WARN / DRIFT / FAIL attestation states and expected-vs-observed digest reporting.
- Added deployment gates that independently recompute attested record digests before GitHub Pages deployment.
- Extended validation to recognize attestation records, digest formats, baseline provenance, expected/observed digest parity, and drift-status consistency.
- Preserved the epistemic firewall: integrity attestation establishes content stability relative to a baseline; it does not establish truth, authorial intent, evidentiary sufficiency, or confirmation.
- Preserved the rule: **CONNECTED ≠ SUPPORTED ≠ CORROBORATED ≠ CONFIRMED**.

## V1.0.12 — Provenance Intelligence & Audit Trail

- Extended the V1.0.12 provenance layer from event display into a canonical **audit-trail system**.
- Added `audit.schema.json` for machine-readable provenance integrity audits.
- Added canonical `AUD-GEI-V1012-001` baseline audit record.
- Added live provenance intelligence checks for target resolution, reverse provenance linkage, verification consistency, change-event version history, and disputed provenance.
- Added a versioned Change Ledger for provenance checks and audit events.
- Added audit summary metrics for provenance events, verified/disputed states, and live PASS/WARN/FAIL status.
- Extended validation to enforce audit summaries, check counts, audit-status consistency, and audit reference integrity.
- Extended GitHub Pages deployment verification to require the audit schema, canonical audit record, and provenance intelligence engine.
- Preserved the epistemic firewall: an audit verifies traceability and integrity metadata; it does not establish that a GEI interpretation is true.
- Preserved the rule: **CONNECTED ≠ SUPPORTED ≠ CORROBORATED ≠ CONFIRMED**.

## V1.0.12 — GEI Research Integrity & Provenance Engine

- Added canonical **provenance** records for research-history and verification events.
- Added `provenance.schema.json` with event type, target records, version history, reason, actor, timestamp, verification status, and integrity notes.
- Added explicit provenance links to the GEI hypothesis and outcome evaluation.
- Added provenance validation for target references and change-event version requirements.
- Added a dedicated **Integrity & Provenance** interface inspector.
- Added provenance visibility for who, what, when, why, version, and verification state.
- Preserved the epistemic firewall: provenance explains the research record but does not constitute substantive evidence.
- Preserved the rule: **CONNECTED ≠ SUPPORTED ≠ CORROBORATED ≠ CONFIRMED**.
- Extended deployment verification and GitHub Pages versioning to V1.0.12.

## V1.0.11 — GEI Research Outcome Intelligence Engine

- Added canonical **outcome evaluation** records.
- Added `evaluation.schema.json` and validation support for the new evaluation layer.
- Added explicit expected-state, observed-state, delta/evidence-gap, disposition, and revision-recommendation fields.
- Upgraded the initial GEI outcome to link its evaluation explicitly.
- Added a dedicated **Outcome Intelligence** interface module.
- Added comparison of expected versus observed research states.
- Added explicit outcome dispositions: supports, partially supports, challenges, inconclusive, and requires revision/further testing.
- Added revision guidance without automatically promoting hypotheses to confirmed status.
- Extended deployment verification and GitHub Pages versioning to V1.0.11.
- Preserved the epistemic firewall: **CONNECTED ≠ SUPPORTED ≠ CORROBORATED ≠ CONFIRMED**.

## V1.0.10 — GEI Research Decision → Execution → Outcome Engine

- Added canonical decision, execution, and observation records.
- Added Decision & Execution workspace and validation rules.
- Preserved explicit research authorization, execution history, and observation provenance.

## V1.0.9 — GEI Research Investigation Engine

- Added canonical **research question**, **claim/proposition**, **investigation**, **result**, and **outcome** records.
- Added investigation schemas, a dedicated workspace, explicit alternative-explanation and counterevidence tracking, and test-plan tracking.
- Extended validation to cover investigation-chain integrity.

## V1.0.8 — Graph Intelligence & Evidence Traceability

- Added evidence-aware graph traceability and epistemic audit capabilities.

## V1.0.7 — Research Graph

- Added explicit-reference relationship graph and auditable relationship table.

## V1.0.6 — Deployment & Verification

- Added GitHub Actions verification and GitHub Pages deployment workflow.

## V1.0.4 — Validation Engine

- Added JSON Schema validation, ID integrity, cross-record reference checks, and epistemic governance rules.

## V1.0.3 — Starter Dataset