# Changelog

All notable changes to GEI-Research are recorded here.

## V1.0.17 — Consensus & Disagreement Intelligence Engine

- Added `consensus.schema.json` for machine-readable agreement dimensions, operator positions, disagreement records, consensus status, and limitations.
- Added canonical `CON-GEI-V1017-001` consensus baseline linked to the V1.0.16 independent replication framework.
- Added six comparison dimensions: procedural, observational, evidence classification, interpretive, hypothesis, and alternative-explanation agreement.
- Added first-class disagreement categories so disagreement is preserved as research data rather than averaged away.
- Added `interface/consensus-engine.js` to expose the consensus map and disagreement register.
- Added a dedicated V1.0.17 consensus validation layer.
- Preserved the epistemic firewall: agreement among operators concerns repeatability and research-position convergence; it does not establish truth, authorial intent, or confirmation of the GEI hypothesis.
- Preserved the rule: **DISAGREEMENT IS DATA. CONNECTED ≠ SUPPORTED ≠ CORROBORATED ≠ CONFIRMED**.
- Baseline status is explicitly `not_assessed` until independent replication results exist; no consensus is fabricated.

## V1.0.16 — Independent Replication & Cross-Operator Verification Engine

- Added `replication.schema.json` for independent operator definitions, replication runs, blind comparison, agreement metrics, disagreements, and replication status.
- Added canonical `RPL-GEI-V1016-001` replication baseline linked to the V1.0.15 protocol and reproducibility baseline.
- Declared two independent operator slots while explicitly excluding the baseline operator from independent replication counts.
- Added distinct replication-run identifiers so independent executions become append-only research states rather than overwrites.
- Added blind-comparison controls and explicit disagreement preservation.
- Added cross-operator agreement metrics for protocol fidelity, observation agreement, and alternative-explanation agreement.
- Added `interface/replication-engine.js` to expose the replication framework and current operator/run state.
- Extended validation to enforce independent-operator minimums, unique operator/run identifiers, valid run references, terminal-run completeness, and replication-status safeguards.
- Extended GitHub Pages deployment gates to verify V1.0.16 schemas, baseline records, interface integration, and anti-overclaiming conditions.
- Preserved the epistemic firewall: successful replication measures repeatability/robustness of the recorded procedure; it does not establish truth, authorial intent, or confirmation of the GEI hypothesis.
- Preserved the immutable-history principle: future independent runs must be appended as new states and must never overwrite historical runs.
- Preserved the rule: **CONNECTED ≠ SUPPORTED ≠ CORROBORATED ≠ CONFIRMED**.

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
