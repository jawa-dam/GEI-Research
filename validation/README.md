# GEI-Research Validation Engine — V1.0.4

The Validation Engine protects the canonical GEI dataset from structural, referential, and epistemic integrity failures.

## Validation pipeline

```text
JSON records
    ↓
Schema conformance
    ↓
Identity / filename checks
    ↓
Cross-record reference checks
    ↓
Confidence / evidence checks
    ↓
Epistemic firewall checks
    ↓
Comparison integrity
    ↓
PASS / FAIL
```

## Rules

1. Every data record must be valid JSON.
2. Every record must have a unique, correctly formatted ID.
3. A record filename must match its ID.
4. Every record type must map to an approved JSON Schema.
5. Referenced IDs must exist.
6. Deprecated records must not be referenced by active records.
7. Confidence values must use `C0`–`C5`.
8. Evidence values must use `E1`–`E5`.
9. Comparisons must contain at least two subjects.
10. Interpretations and hypotheses remain distinct epistemic objects.
11. A V1.0.4 hypothesis may not be marked `confirmed`.
12. Schema validation and cross-record validation are both required for a PASS.

## Local execution

From the repository root:

```bash
python -m pip install jsonschema
python validation/validate.py
```

A zero exit code means `VALIDATION: PASS`. A nonzero exit code means `VALIDATION: FAIL`.

## Design principle

The validator does not decide whether a GEI interpretation is true. It verifies whether the research record is structurally valid, traceable, and properly separated from source evidence.
