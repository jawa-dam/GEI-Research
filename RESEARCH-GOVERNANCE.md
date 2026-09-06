# GEI Research Governance

## 1. Purpose

This document defines the internal governance rules for GEI-Research. Its goal is to make the research system auditable, version-controlled, and explicit about the difference between source material and GEI interpretation.

## 2. Canonical authority

The structured repository data is the canonical research layer.

Applications, timelines, dashboards, educational pages, visualizations, and other interfaces are downstream views of that data.

**DATA → LOGIC → INTERFACE**

An interface must not silently alter the meaning of canonical research records.

## 3. Epistemic classification

Research statements should be classified according to their role:

- **SOURCE** — information supplied by a source.
- **PASSAGE** — a bounded textual location within a source.
- **OBSERVATION** — something directly identifiable in a source or dataset.
- **EVIDENCE** — information that supports or challenges a proposition.
- **COMPARISON** — a documented relationship between records.
- **INTERPRETATION** — an analytical reading proposed from evidence.
- **HYPOTHESIS** — a proposition that can be examined or tested.
- **TEST** — an examination designed to evaluate a hypothesis.
- **RESULT** — the finding produced by a test or investigation.
- **OUTCOME** — the current research consequence or disposition.

## 4. Evidence levels

GEI-Research may use the following internal evidence scale. These labels are project metadata and are not presented as universal academic standards.

- **E1 — Direct:** directly attested by the relevant primary source, artifact, dataset, or observation.
- **E2 — Corroborating:** independently supported by strong related primary, archaeological, scientific, or documentary evidence.
- **E3 — Scholarly:** supported by credible secondary scholarship or established specialist analysis.
- **E4 — Comparative:** indirect or comparative evidence that helps evaluate a proposition but does not establish it by itself.
- **E5 — Speculative:** inference, analogy, or possibility requiring substantial additional testing.

## 5. Confidence levels

- **C0 — Not assessed**
- **C1 — Tentative**
- **C2 — Low**
- **C3 — Moderate**
- **C4 — High**
- **C5 — Very high**

Confidence describes the current state of the proposition inside the GEI research system. It does not replace evidence or scholarly review.

## 6. Comparisons

Comparative records should state what is actually being compared. Useful comparison categories include:

- Structural
- Functional
- Symbolic
- Linguistic
- Technological
- Chronological
- Geographic
- Cultural-transmission
- Independent-convergence
- Unknown relationship

A comparison must not be upgraded into historical causation without additional evidence.

## 7. Interpretations and hypotheses

GEI interpretations are part of the research record and should be preserved as interpretations. They should not be rewritten as established historical facts merely because they are central to the GEI project.

A hypothesis should identify, where practical:

- the proposition;
- supporting evidence;
- counterevidence;
- alternative explanations;
- predictions or tests;
- current confidence;
- current status.

## 8. Counterevidence

Counterevidence is first-class research information. When evidence weakens a proposition, the record should document that fact rather than suppress it.

## 9. Versioning

Changes should be traceable through Git history. Significant schema, taxonomy, source, evidence, interpretive, and hypothesis changes should be reflected in release notes or the changelog when appropriate.

Stable record IDs should not be casually recycled.

## 10. Source discipline

Primary sources, archaeological evidence, scientific literature, scholarly secondary sources, reference works, and general educational sources should be distinguished where practical.

A source's existence does not automatically validate every interpretation made from it.

## 11. Research integrity principle

The repository should allow a reader to distinguish:

**What the source says.**

**What the evidence supports.**

**What is being compared.**

**What GEI proposes.**

That distinction is foundational to GEI-Research.
