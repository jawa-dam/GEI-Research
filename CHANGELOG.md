# Changelog

All notable changes to GEI-Research are recorded here.

## V1.0.15 — Research Reproducibility & Protocol Engine

- Added `protocol.schema.json` for versioned, repeatable research procedures.
- Added `reproducibility.schema.json` for machine-readable reproduction runs and reproducibility assessments.
- Added canonical `PRO-GEI-V1015-001` reproducibility baseline protocol.
- Added canonical `REP-GEI-V1015-001` baseline reproducibility assessment without falsely claiming independent reproduction.
- Added explicit protocol steps, predefined acceptance rules, input fidelity controls, observation traceability, deviation recording, and alternative-explanation controls.
- Added `interface/reproducibility-engine.js` to expose the protocol and reproduction state in the research interface.
- Extended validation to recognize protocol and reproducibility records, enforce ordered protocol steps, required criteria, valid run identifiers, and prohibit terminal reproduction runs from silently containing unrun steps.
- Extended GitHub Pages deployment gates to verify V1.0.15 schemas, records, interface integration, and version markers before deployment.
- Preserved the immutable-history principle: a reproduction run is a new research state and must not overwrite the baseline.
- Preserved the epistemic firewall: reproducibility evaluates repeatability of the recorded procedure; it does not establish truth, authorial intent, or confirmation of the GEI hypothesis.
- Preserved the rule: **CONNECTED ≠ SUPPORTED ≠ CORROBORATED ≠ CONFIRMED**.

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
