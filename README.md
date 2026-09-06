# GEI Research

## Genesis Engineered Interpretations — Canonical Research Repository

GEI-Research is the version-controlled research home for the Genesis Engineered Interpretations (GEI) project.

Its purpose is to preserve, structure, test, compare, and evolve GEI research while maintaining a clear boundary between source material, evidence, comparison, interpretation, and hypothesis.

## Core architecture

**DATA → LOGIC → INTERFACE**

- **DATA** — canonical structured research records and source metadata.
- **LOGIC** — validation, research methods, relationships, comparisons, and analytical rules.
- **INTERFACE** — timelines, explorers, dashboards, and educational experiences generated from the canonical data.

The interface is a view of the research. It must never silently redefine the research.

## Research pipeline

**SOURCE → PASSAGE → OBSERVATION → EVIDENCE → COMPARISON → INTERPRETATION → HYPOTHESIS → TEST → RESULT → OUTCOME**

This pipeline is the repository's epistemic firewall. A statement should be labeled according to what kind of claim it actually is.

### Claim discipline

1. **Source** — what a primary or secondary source provides.
2. **Observation** — what can be directly identified in the source or dataset.
3. **Evidence** — material that supports or challenges a proposition.
4. **Comparison** — a documented relationship or similarity between records.
5. **Interpretation** — a proposed reading of evidence.
6. **Hypothesis** — a testable explanatory proposition.
7. **Test / Result / Outcome** — what happens when a hypothesis is examined.

Similarity alone does not establish borrowing, dependence, common ancestry, or historical causation.

## Research domains

GEI-Research is designed to support structured records for:

- Chronology and historical periods
- Civilizations and cultures
- Regions and geography
- Texts and passages
- Creation and cosmology traditions
- Water and hydraulic systems
- Technology and engineering
- Linguistics and word studies
- Sources and bibliography
- Evidence
- Comparative analysis
- GEI interpretations
- GEI hypotheses
- Research questions, investigations, results, and outcomes

## Stable ID system

Canonical records use stable identifiers with domain prefixes:

`CHR` Chronology  ·  `CIV` Civilization  ·  `REG` Region  ·  `TXT` Text  ·  `PAS` Passage  ·  `COS` Cosmology  ·  `WTR` Water  ·  `TEC` Technology  ·  `LIN` Linguistics  ·  `SRC` Source  ·  `EVD` Evidence  ·  `CMP` Comparison  ·  `INT` Interpretation  ·  `HYP` Hypothesis  ·  `RES` Research Result

IDs should remain stable even when the content of a record is revised.

## Repository structure

```text
GEI-Research/
├── README.md
├── CHANGELOG.md
├── CONTRIBUTING.md
├── RESEARCH-GOVERNANCE.md
├── RIGHTS-AND-PROVENANCE.md
├── schema/
├── data/
├── research/
├── interface/
└── validation/
```

The folders will be populated in controlled build milestones. Canonical records belong in the data layer; schemas define their structure; research workflows define how records are examined; interfaces consume the resulting data.

## Evidence and confidence

GEI uses internal evidence and confidence metadata to make the strength of a claim visible. These labels are repository conventions, not universal academic standards.

- **E1–E5** — evidence strength/category.
- **C0–C5** — confidence in the current proposition.

A low-confidence interpretation is not deleted merely because it is weak. It is labeled correctly so that future evidence can strengthen, modify, or reject it.

## Version control

Research is cumulative. Corrections, new sources, schema changes, competing interpretations, counterevidence, and revised hypotheses should be traceable through Git history and repository changelogs.

Canonical data should favor provenance and reproducibility over convenience.

## V1.0 Foundation roadmap

- [x] Establish canonical repository
- [x] Establish research architecture
- [x] Establish epistemic pipeline
- [x] Establish stable ID namespaces
- [ ] Build JSON Schema layer
- [ ] Load MCT V1.0 starter dataset
- [ ] Build validation rules
- [ ] Build research question and investigation layer
- [ ] Build research explorer
- [ ] Build interactive chronology/timeline
- [ ] Publish versioned research releases

## Research integrity principle

GEI-Research should make it possible for a reader to answer four separate questions:

**What does the source say?**

**What does the evidence demonstrate?**

**What is being compared?**

**What is GEI proposing as an interpretation or hypothesis?**

Keeping those questions separate is a core requirement of the project.

---

**Repository status:** V1.0.1 — Foundation
