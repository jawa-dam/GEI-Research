#!/usr/bin/env python3
"""GEI-Research V1.0.11 validation engine."""
from __future__ import annotations
import json,re,sys
from pathlib import Path
from jsonschema import Draft202012Validator, RefResolver
ROOT=Path(__file__).resolve().parents[1];DATA=ROOT/"data";SCHEMA=ROOT/"schema"
ID_RE=re.compile(r"^[A-Z]{3}(?:-[A-Z0-9]+)+-[0-9]{3}$")
TYPE_TO_SCHEMA={"chronology":"chronology.schema.json","civilization":"civilization.schema.json","region":"region.schema.json","text":"text.schema.json","passage":"passage.schema.json","cosmology":"cosmology.schema.json","water":"water.schema.json","technology":"technology.schema.json","linguistics":"linguistics.schema.json","source":"source.schema.json","evidence":"evidence.schema.json","comparison":"comparison.schema.json","interpretation":"interpretation.schema.json","hypothesis":"hypothesis.schema.json","question":"question.schema.json","claim":"claim.schema.json","investigation":"investigation.schema.json","result":"result.schema.json","outcome":"outcome.schema.json","decision":"decision.schema.json","execution":"execution.schema.json","observation":"observation.schema.json","evaluation":"evaluation.schema.json"}
ALLOWED_CONFIDENCE={f"C{i}" for i in range(6)};ALLOWED_EVIDENCE={f"E{i}" for i in range(1,6)}
REFERENCE_KEYS={"related_ids","source_ids","evidence_ids","subject_ids","comparison_ids","passage_ids","text_ids","civilization_ids","region_ids","chronology_ids","water_ids","technology_ids","linguistic_ids","interpretation_ids","hypothesis_ids","supports_ids","challenges_ids","tests_ids","result_ids","question_ids","investigation_ids","claim_ids","counterevidence_ids","outcome_ids","evaluation_ids","decision_ids","execution_ids","observation_ids"}
def load_json(path):
    with path.open(encoding="utf-8") as f:return json.load(f)
def all_records():return sorted(p for p in DATA.rglob("*.json") if p.name!="validation-rules.json")
def walk_refs(value,key=None):
    if isinstance(value,dict):
        for k,v in value.items():yield from walk_refs(v,k)
    elif isinstance(value,list):
        for item in value:yield from walk_refs(item,key)
    elif isinstance(value,str) and key in REFERENCE_KEYS and ID_RE.fullmatch(value):yield value
def main():
    errors=[];warnings=[];records={};parsed={}
    for path in all_records():
        rel=path.relative_to(ROOT).as_posix()
        try:obj=load_json(path)
        except Exception as exc:errors.append(f"{rel}: invalid JSON: {exc}");continue
        parsed[rel]=obj;rid=obj.get("id") if isinstance(obj,dict) else None
        if not rid:errors.append(f"{rel}: missing id");continue
        if rid in records:errors.append(f"{rel}: duplicate id {rid} (also {records[rid]})")
        records[rid]=rel
        if not ID_RE.fullmatch(rid):errors.append(f"{rel}: invalid id format: {rid}")
        if rid!=path.stem:errors.append(f"{rel}: filename/id mismatch: filename={path.stem}, id={rid}")
        rtype=obj.get("type");schema_name=TYPE_TO_SCHEMA.get(rtype)
        if not schema_name:errors.append(f"{rel}: unsupported or missing type: {rtype!r}");continue
        try:
            schema=load_json(SCHEMA/schema_name);validator=Draft202012Validator(schema,resolver=RefResolver((SCHEMA/schema_name).as_uri(),schema))
            for problem in validator.iter_errors(obj):
                loc=".".join(str(x) for x in problem.absolute_path);errors.append(f"{rel}: schema: {loc}: {problem.message}")
        except Exception as exc:errors.append(f"{rel}: schema engine failure using {schema_name}: {exc}")
        if "confidence" in obj and obj["confidence"] not in ALLOWED_CONFIDENCE:errors.append(f"{rel}: invalid confidence {obj['confidence']!r}")
        if "evidence_level" in obj and obj["evidence_level"] not in ALLOWED_EVIDENCE:errors.append(f"{rel}: invalid evidence_level {obj['evidence_level']!r}")
    for rel,obj in parsed.items():
        refs=list(walk_refs(obj))
        for ref in refs:
            if ref not in records:errors.append(f"{rel}: broken reference: {ref}")
            elif ref==obj.get("id"):warnings.append(f"{rel}: self-reference: {ref}")
        if obj.get("status")=="deprecated":
            for other_rel,other in parsed.items():
                if other_rel!=rel and obj.get("id") in set(walk_refs(other)):errors.append(f"{other_rel}: references deprecated record {obj.get('id')}")
        if obj.get("type")=="comparison" and isinstance(obj.get("subjects"),list) and len(obj.get("subjects",[]))<2:errors.append(f"{rel}: comparison must contain at least two subjects")
        if obj.get("type") in {"interpretation","hypothesis","claim"} and not any(obj.get(k) for k in ("source_ids","evidence_ids","subject_ids","question_ids")):warnings.append(f"{rel}: no explicit source, evidence, subject, or question linkage")
        if obj.get("type")=="hypothesis" and obj.get("status")=="confirmed":errors.append(f"{rel}: hypothesis cannot use status=confirmed")
        if obj.get("type")=="investigation":
            if not obj.get("question_ids"):errors.append(f"{rel}: investigation must identify at least one research question")
            if not obj.get("test_plan"):errors.append(f"{rel}: investigation must contain a test_plan")
            if not(obj.get("counterevidence_ids") or obj.get("alternative_explanation")):warnings.append(f"{rel}: investigation has no explicit counterevidence or alternative explanation")
        if obj.get("type")=="decision" and obj.get("decision_status") in {"approved","executing","executed"} and not obj.get("rationale"):errors.append(f"{rel}: executable decision requires rationale")
        if obj.get("type")=="execution":
            if not obj.get("decision_ids"):errors.append(f"{rel}: execution must link to a decision")
            if obj.get("execution_status")=="completed" and not obj.get("observations"):warnings.append(f"{rel}: completed execution has no observations")
        if obj.get("type")=="observation" and not obj.get("execution_ids"):errors.append(f"{rel}: observation must link to an execution")
        if obj.get("type")=="outcome" and obj.get("disposition") in {"supports","partially_supports"} and obj.get("confidence")=="C0":warnings.append(f"{rel}: supportive outcome has C0 confidence")
        if obj.get("type")=="evaluation":
            if not obj.get("outcome_ids"):errors.append(f"{rel}: evaluation must link to an outcome")
            if obj.get("evaluation_status")=="complete" and not obj.get("assessment"):errors.append(f"{rel}: completed evaluation requires an assessment")
            if obj.get("disposition")=="requires_revision" and not obj.get("revision_recommendation"):warnings.append(f"{rel}: revision disposition has no revision recommendation")
    print("GEI-Research Validation Engine V1.0.11");print(f"Records scanned: {len(parsed)}");print(f"Errors: {len(errors)}");print(f"Warnings: {len(warnings)}")
    for x in errors:print(f"ERROR: {x}")
    for x in warnings:print(f"WARNING: {x}")
    if errors:print("VALIDATION: FAIL");return 1
    print("VALIDATION: PASS");return 0
if __name__=="__main__":raise SystemExit(main())
