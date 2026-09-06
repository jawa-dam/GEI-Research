# Contributing to GEI-Research

GEI-Research is designed to be a rigorous, traceable research system. Contributions should improve the quality, provenance, reproducibility, and clarity of the dataset.

## Core rules

### 1. Cite factual claims

Canonical factual records should identify the source or sources supporting the claim whenever a source is reasonably available.

### 2. Separate evidence from interpretation

Do not present a GEI interpretation as though it were a direct statement from a historical source. Label interpretations and hypotheses explicitly.

### 3. Preserve provenance

Do not silently replace the origin of a record, source, quotation, date, translation, or interpretation.

### 4. Preserve stable IDs

Once assigned, a canonical record ID should remain stable. If the identity of a record genuinely changes, document the change rather than silently reusing the old ID for an unrelated object.

### 5. Record competing evidence

Evidence that challenges a proposition is valuable research data. Counterevidence and alternative interpretations should be preserved rather than removed merely because they conflict with a preferred interpretation.

### 6. Do not infer causation from similarity alone

A structural or thematic similarity may justify comparison. It does not automatically demonstrate borrowing, dependence, common origin, or historical transmission.

### 7. Keep the interface downstream

Changes to a visual interface must not become the source of truth for canonical research data. Interfaces should consume validated repository data.

## Record lifecycle

Use the following conceptual sequence when developing research records:

**SOURCE → PASSAGE → OBSERVATION → EVIDENCE → COMPARISON → INTERPRETATION → HYPOTHESIS → TEST → RESULT → OUTCOME**

## Changes

Schema changes, taxonomy changes, major interpretive changes, and corrections to established records should be clearly described in commit messages and the changelog when appropriate.

## Quality standard

Before adding a record, ask:

- What exactly is being claimed?
- What kind of record is this?
- What source supports it?
- Is the statement observation, evidence, comparison, interpretation, or hypothesis?
- Could a reasonable researcher disagree?
- If so, have the alternative or counterevidence been represented?
- Can another person trace the claim back to its provenance?
