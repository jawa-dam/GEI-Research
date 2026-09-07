# Changelog

All notable changes to GEI-Research are recorded here.

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

- Added canonical **research question** records.
- Added canonical **claim/proposition** records.
- Added canonical **investigation** records.
- Added canonical **result** and **outcome** records.
- Added investigation schemas for machine validation.
- Added a dedicated Investigation Workspace to the research interface.
- Added chain visualization for Question → Claim → Source → Evidence → Comparison → Interpretation → Hypothesis → Test → Result → Outcome.
- Added explicit alternative-explanation and counterevidence tracking.
- Added test-plan tracking and non-confirmatory outcomes such as inconclusive / requires further testing.
- Extended validation to cover the new record types and investigation-chain integrity.
- Preserved the rule that relationships are derived from canonical references and do not manufacture evidence.

## V1.0.8 — Graph Intelligence & Evidence Traceability

- Added evidence-aware graph traceability and epistemic audit capabilities.
- Added structural checks for broken references and unsupported research linkage.

## V1.0.7 — Research Graph

- Added explicit-reference relationship graph and auditable relationship table.

## V1.0.6 — Deployment & Verification

- Added GitHub Actions verification and GitHub Pages deployment workflow.

## V1.0.4 — Validation Engine

- Added JSON Schema validation, ID integrity, cross-record reference checks, and epistemic governance rules.

## V1.0.3 — Starter Dataset

- Added initial chronology, civilization, region, text, cosmology, water, source, evidence, comparison, interpretation, and hypothesis records.

## V1.0.2 — Schema Layer

- Added machine-readable schemas for canonical research records.

## V1.0.1 — Foundation

- Established the canonical GEI research repository and structured research pipeline.
