#!/usr/bin/env python3
"""GEI-Research V1.0.4 validation engine.

Validates every JSON record under data/ against its corresponding schema and
checks cross-record references plus core epistemic-governance rules.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

try:
    from jsonschema import Draft202012Validator, RefResolver
except ImportError:
    print("ERROR: jsonschema is required. Install with: pip install jsonschema", file=sys.stderr)
    raise SystemExit(2)

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
SCHEMA = ROOT / "schema"
ID_RE = re.compile(r"^[A-Z]{3}(?:-[A-Z0-9]+)+-[0-9]{3}$")
TYPE_TO_SCHEMA = {
    "chronology": "chronology.schema.json",
    "civilization": "civilization.schema.json",
    "region": "region.schema.json",
    "text": "text.schema.json",
    "passage": "passage.schema.json",
    "cosmology": "cosmology.schema.json",
    "water": "water.schema.json",
    "technology": "technology.schema.json",
    "linguistics": "linguistics.schema.json",
    "source": "source.schema.json",
    "evidence": "evidence.schema.json",
    "comparison": "comparison.schema.json",
    "interpretation": "interpretation.schema.json",
    "hypothesis": "hypothesis.schema.json",
}
ALLOWED_CONFIDENCE = {f"C{i}" for i in range(6)}
ALLOWED_EVIDENCE = {f"E{i}" for i in range(1, 6)}
REFERENCE_KEYS = {
    "related_ids", "source_ids", "evidence_ids", "subject_ids", "comparison_ids",
    "passage_ids", "text_ids", "civilization_ids", "region_ids", "chronology_ids",
    "water_ids", "technology_ids", "linguistic_ids", "interpretation_ids",
    "hypothesis_ids", "supports_ids", "challenges_ids", "tests_ids", "result_ids"
}


def load_json(path: Path):
    with path.open(encoding="utf-8") as f:
        return json.load(f)


def all_records():
    return sorted(p for p in DATA.rglob("*.json") if p.name != "validation-rules.json")


def walk_refs(value, key=None):
    if isinstance(value, dict):
        for k, v in value.items():
            yield from walk_refs(v, k)
    elif isinstance(value, list):
        for item in value:
            yield from walk_refs(item, key)
    elif isinstance(value, str) and key in REFERENCE_KEYS and ID_RE.fullmatch(value):
        yield value


def main() -> int:
    errors = []
    warnings = []
    records = {}
    parsed = {}

    for path in all_records():
        rel = path.relative_to(ROOT).as_posix()
        try:
            obj = load_json(path)
        except Exception as exc:
            errors.append(f"{rel}: invalid JSON: {exc}")
            continue
        parsed[rel] = obj
        rid = obj.get("id") if isinstance(obj, dict) else None
        if not rid:
            errors.append(f"{rel}: missing id")
            continue
        if rid in records:
            errors.append(f"{rel}: duplicate id {rid} (also {records[rid]})")
        records[rid] = rel
        if not ID_RE.fullmatch(rid):
            errors.append(f"{rel}: invalid id format: {rid}")
        expected = path.stem
        if rid != expected:
            errors.append(f"{rel}: filename/id mismatch: filename={expected}, id={rid}")

        rtype = obj.get("type")
        schema_name = TYPE_TO_SCHEMA.get(rtype)
        if not schema_name:
            errors.append(f"{rel}: unsupported or missing type: {rtype!r}")
            continue
        schema_path = SCHEMA / schema_name
        try:
            schema = load_json(schema_path)
            resolver = RefResolver(schema_path.as_uri(), schema)
            validator = Draft202012Validator(schema, resolver=resolver)
            for problem in validator.iter_errors(obj):
                loc = ".".join(str(x) for x in problem.absolute_path)
                errors.append(f"{rel}: schema: {loc}: {problem.message}")
        except Exception as exc:
            errors.append(f"{rel}: schema engine failure using {schema_name}: {exc}")

        if "version" in obj and not isinstance(obj["version"], str):
            errors.append(f"{rel}: version must be a string")
        if "confidence" in obj and obj["confidence"] not in ALLOWED_CONFIDENCE:
            errors.append(f"{rel}: invalid confidence {obj['confidence']!r}")
        if "evidence_level" in obj and obj["evidence_level"] not in ALLOWED_EVIDENCE:
            errors.append(f"{rel}: invalid evidence_level {obj['evidence_level']!r}")

    # Cross-record reference integrity.
    for rel, obj in parsed.items():
        for ref in walk_refs(obj):
            if ref not in records:
                errors.append(f"{rel}: broken reference: {ref}")
            elif ref == obj.get("id"):
                warnings.append(f"{rel}: self-reference: {ref}")

        status = obj.get("status")
        if status == "deprecated":
            for other_rel, other in parsed.items():
                if other_rel == rel:
                    continue
                if obj.get("id") in set(walk_refs(other)):
                    errors.append(f"{other_rel}: references deprecated record {obj.get('id')}")

        if obj.get("type") == "comparison":
            subjects = obj.get("subject_ids") or obj.get("subjects") or []
            if isinstance(subjects, list) and len(subjects) < 2:
                errors.append(f"{rel}: comparison must contain at least two subjects")

        if obj.get("type") == "interpretation" and not (obj.get("source_ids") or obj.get("evidence_ids") or obj.get("supports_ids")):
            warnings.append(f"{rel}: interpretation has no explicit source/evidence/support linkage")

        if obj.get("type") == "hypothesis" and obj.get("status") == "confirmed":
            errors.append(f"{rel}: hypothesis cannot use status=confirmed in V1.0.4")

    print("GEI-Research Validation Engine V1.0.4")
    print(f"Records scanned: {len(parsed)}")
    print(f"Errors: {len(errors)}")
    print(f"Warnings: {len(warnings)}")
    for item in errors:
        print(f"ERROR: {item}")
    for item in warnings:
        print(f"WARNING: {item}")
    if errors:
        print("VALIDATION: FAIL")
        return 1
    print("VALIDATION: PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
