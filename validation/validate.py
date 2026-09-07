#!/usr/bin/env python3
"""GEI-Research V1.0.15 validation engine."""
from __future__ import annotations
import hashlib,json,re
from pathlib import Path
from jsonschema import Draft202012Validator,RefResolver
ROOT=Path(__file__).resolve().parents[1];DATA=ROOT/'data';SCHEMA=ROOT/'schema'
ID_RE=re.compile(r'^[A-Z]{3}(?:-[A-Z0-9]+)+-[0-9]{3}$');SHA_RE=re.compile(r'^[0-9a-f]{64}$');STATE_RE=re.compile(r'^STATE-[A-Z0-9-]+-[0-9]{3}$');PRO_RE=re.compile(r'^PRO-[A-Z0-9-]+-[0-9]{3}$');RUN_RE=re.compile(r'^RUN-[A-Z0-9-]+-[0-9]{3}$')
TYPE_TO_SCHEMA={'chronology':'chronology.schema.json','civilization':'civilization.schema.json','region':'region.schema.json','text':'text.schema.json','passage':'passage.schema.json','cosmology':'cosmology.schema.json','water':'water.schema.json','technology':'technology.schema.json','linguistics':'linguistics.schema.json','source':'source.schema.json','evidence':'evidence.schema.json','comparison':'comparison.schema.json','interpretation':'interpretation.schema.json','hypothesis':'hypothesis.schema.json','question':'question.schema.json','claim':'claim.schema.json','investigation':'investigation.schema.json','result':'result.schema.json','outcome':'outcome.schema.json','decision':'decision.schema.json','execution':'execution.schema.json','observation':'observation.schema.json','evaluation':'evaluation.schema.json','provenance':'provenance.schema.json','audit':'audit.schema.json','attestation':'attestation.schema.json','ledger':'ledger.schema.json','protocol':'protocol.schema.json','reproducibility':'reproducibility.schema.json'}
ALLOWED_CONFIDENCE={f'C{i}' for i in range(6)};ALLOWED_EVIDENCE={f'E{i}' for i in range(1,6)}
REFERENCE_KEYS={'related_ids','source_ids','evidence_ids','subject_ids','comparison_ids','passage_ids','text_ids','civilization_ids','region_ids','chronology_ids','water_ids','technology_ids','linguistic_ids','interpretation_ids','hypothesis_ids','supports_ids','challenges_ids','tests_ids','result_ids','question_ids','investigation_ids','claim_ids','counterevidence_ids','outcome_ids','evaluation_ids','decision_ids','execution_ids','observation_ids','provenance_ids','provenance_id','record_ids','audited_record_ids','attestation_ids','protocol_ids','reproduction_ids'}
def load_json(path):
    with path.open(encoding='utf-8') as f:return json.load(f)
def all_records():return sorted(p for p in DATA.rglob('*.json') if p.name!='validation-rules.json')
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
        except Exception as exc:errors.append(f'{rel}: invalid JSON: {exc}');continue
        parsed[rel]=obj;rid=obj.get('id') if isinstance(obj,dict) else None
        if not rid:errors.append(f'{rel}: missing id');continue
        if rid in records:errors.append(f'{rel}: duplicate id {rid} (also {records[rid]})')
        records[rid]=rel
        if not ID_RE.fullmatch(rid) and not PRO_RE.fullmatch(rid):errors.append(f'{rel}: invalid id format: {rid}')
        if rid!=path.stem:errors.append(f'{rel}: filename/id mismatch: filename={path.stem}, id={rid}')
        rtype=obj.get('type');schema_name=TYPE_TO_SCHEMA.get(rtype)
        if not schema_name:errors.append(f'{rel}: unsupported or missing type: {rtype!r}');continue
        try:
            schema=load_json(SCHEMA/schema_name);validator=Draft202012Validator(schema,resolver=RefResolver((SCHEMA/schema_name).as_uri(),schema))
            for problem in validator.iter_errors(obj):errors.append(f"{rel}: schema: {'.'.join(str(x) for x in problem.absolute_path)}: {problem.message}")
        except Exception as exc:errors.append(f'{rel}: schema engine failure using {schema_name}: {exc}')
        if 'confidence' in obj and obj['confidence'] not in ALLOWED_CONFIDENCE:errors.append(f"{rel}: invalid confidence {obj['confidence']!r}")
        if 'evidence_level' in obj and obj['evidence_level'] not in ALLOWED_EVIDENCE:errors.append(f"{rel}: invalid evidence_level {obj['evidence_level']!r}")
    for rel,obj in parsed.items():
        for ref in walk_refs(obj):
            if ref not in records:errors.append(f'{rel}: broken reference: {ref}')
            elif ref==obj.get('id'):warnings.append(f'{rel}: self-reference: {ref}')
        if obj.get('status')=='deprecated':
            for other_rel,other in parsed.items():
                if other_rel!=rel and obj.get('id') in set(walk_refs(other)):errors.append(f'{other_rel}: references deprecated record {obj.get("id")}')
        if obj.get('type')=='comparison' and isinstance(obj.get('subjects'),list) and len(obj.get('subjects',[]))<2:errors.append(f'{rel}: comparison must contain at least two subjects')
        if obj.get('type') in {'interpretation','hypothesis','claim'} and not any(obj.get(k) for k in ('source_ids','evidence_ids','subject_ids','question_ids')):warnings.append(f'{rel}: no explicit source, evidence, subject, or question linkage')
        if obj.get('type')=='hypothesis' and obj.get('status')=='confirmed':errors.append(f'{rel}: hypothesis cannot use status=confirmed')
        if obj.get('type')=='investigation':
            if not obj.get('question_ids'):errors.append(f'{rel}: investigation must identify at least one research question')
            if not obj.get('test_plan'):errors.append(f'{rel}: investigation must contain a test_plan')
            if not(obj.get('counterevidence_ids') or obj.get('alternative_explanation')):warnings.append(f'{rel}: investigation has no explicit counterevidence or alternative explanation')
        if obj.get('type')=='decision' and obj.get('decision_status') in {'approved','executing','executed'} and not obj.get('rationale'):errors.append(f'{rel}: executable decision requires rationale')
        if obj.get('type')=='execution':
            if not obj.get('decision_ids'):errors.append(f'{rel}: execution must link to a decision')
            if obj.get('execution_status')=='completed' and not obj.get('observations'):warnings.append(f'{rel}: completed execution has no observations')
        if obj.get('type')=='observation' and not obj.get('execution_ids'):errors.append(f'{rel}: observation must link to an execution')
        if obj.get('type')=='outcome' and obj.get('disposition') in {'supports','partially_supports'} and obj.get('confidence')=='C0':warnings.append(f'{rel}: supportive outcome has C0 confidence')
        if obj.get('type')=='evaluation':
            if not obj.get('outcome_ids'):errors.append(f'{rel}: evaluation must link to an outcome')
            if obj.get('evaluation_status')=='complete' and not obj.get('assessment'):errors.append(f'{rel}: completed evaluation requires an assessment')
            if obj.get('disposition')=='requires_revision' and not obj.get('revision_recommendation'):warnings.append(f'{rel}: revision disposition has no revision recommendation')
        if obj.get('type')=='provenance':
            if obj.get('event_type') in {'updated','revised','restored'} and not obj.get('previous_versions'):errors.append(f'{rel}: change event requires previous_versions')
            if obj.get('event_type') in {'updated','revised'} and not obj.get('new_versions'):errors.append(f'{rel}: change event requires new_versions')
            if obj.get('verification_status')=='disputed':warnings.append(f'{rel}: provenance record is disputed')
            for rid,digest in obj.get('record_digests',{}).items():
                if obj.get('digest_algorithm')!='SHA-256' or obj.get('digest_scope')!='canonical_json':errors.append(f'{rel}: digest baseline must use SHA-256 canonical_json')
                if not SHA_RE.fullmatch(digest):errors.append(f'{rel}: invalid SHA-256 digest for {rid}')
                if rid not in records:errors.append(f'{rel}: digest target does not exist: {rid}')
        if obj.get('type')=='audit':
            summary=obj.get('summary',{});checks=obj.get('checks',[])
            if summary.get('checks')!=len(checks):errors.append(f'{rel}: audit summary.checks does not match checks length')
            if sum(summary.get(k,0) for k in ('passed','warnings','failed'))!=len(checks):errors.append(f'{rel}: audit summary counts do not equal checks length')
            if obj.get('audit_status')=='pass' and summary.get('failed',0)>0:errors.append(f'{rel}: audit_status=pass cannot contain failed checks')
            if obj.get('audit_status')=='fail' and summary.get('failed',0)==0:errors.append(f'{rel}: audit_status=fail requires at least one failed check')
            if any(c.get('status')=='fail' for c in checks) and obj.get('audit_status')!='fail':errors.append(f'{rel}: failed audit check requires audit_status=fail')
        if obj.get('type')=='attestation':
            exp=obj.get('expected_digests',{});obs=obj.get('observed_digests',{});drift=obj.get('drifted_record_ids',[]);baseline=records.get(obj.get('baseline_provenance_id'))
            if not baseline or parsed.get(baseline,{}).get('type')!='provenance':errors.append(f"{rel}: baseline_provenance_id must resolve to a provenance record")
            if set(exp)!=set(obs) or set(exp)!=set(obj.get('record_ids',[])):errors.append(f'{rel}: attestation digest keys must match record_ids and each other')
            actual=sorted(r for r in exp if exp.get(r)!=obs.get(r))
            if sorted(drift)!=actual:errors.append(f'{rel}: drifted_record_ids does not match digest mismatches')
            if not drift and obj.get('attestation_status') in {'drift','fail'}:errors.append(f'{rel}: no digest drift but attestation_status={obj.get("attestation_status")}')
            if drift and obj.get('attestation_status') not in {'drift','fail'}:errors.append(f'{rel}: digest drift requires attestation_status=drift or fail')
        if obj.get('type')=='protocol':
            orders=[s.get('order') for s in obj.get('protocol_steps',[])]
            if orders!=sorted(orders) or len(set(orders))!=len(orders):errors.append(f'{rel}: protocol step orders must be unique and ascending')
            if not obj.get('reproducibility_criteria'):errors.append(f'{rel}: protocol requires reproducibility criteria')
        if obj.get('type')=='reproducibility':
            if obj.get('reproducibility_status')=='reproduced' and obj.get('match_rate',0)<1:errors.append(f'{rel}: reproduced status requires match_rate=1')
            for run in obj.get('reproduction_runs',[]):
                if not RUN_RE.fullmatch(run.get('run_id','')):errors.append(f'{rel}: invalid reproduction run id {run.get("run_id")}')
                if run.get('status') in {'completed','failed','inconclusive'}:
                    not_run=[s for s in run.get('step_results',[]) if s.get('status')=='not_run']
                    if not_run:errors.append(f'{rel}: completed/terminal reproduction run contains not_run steps')
    for rel,obj in parsed.items():
        if obj.get('type')!='ledger':continue
        chain=obj.get('chain',[]);states={};last_by_record={}
        for s in chain:
            sid=s.get('state_id');rid=s.get('record_id')
            if sid in states:errors.append(f'{rel}: duplicate ledger state {sid}')
            states[sid]=s
            if not STATE_RE.fullmatch(sid or ''):errors.append(f'{rel}: invalid state_id {sid}')
            if rid not in obj.get('record_ids',[]):errors.append(f'{rel}: state {sid} targets unlisted record {rid}')
            if not SHA_RE.fullmatch(s.get('content_digest','')):errors.append(f'{rel}: invalid content_digest for {sid}')
            previous=last_by_record.get(rid)
            if previous:
                if not s.get('parent_state_id'):errors.append(f'{rel}: revision state {sid} lacks parent_state_id')
                elif s.get('parent_state_id')!=previous.get('state_id'):errors.append(f'{rel}: state {sid} parent_state_id must point to prior state for {rid}')
                if s.get('parent_digest')!=previous.get('content_digest'):errors.append(f'{rel}: state {sid} parent_digest does not match prior state')
                if not SHA_RE.fullmatch(s.get('parent_digest','')):errors.append(f'{rel}: invalid parent_digest for {sid}')
            else:
                if s.get('parent_state_id') or s.get('parent_digest'):warnings.append(f'{rel}: root state {sid} contains parent linkage')
            prov=s.get('provenance_id')
            if prov not in records or parsed.get(records.get(prov),{}).get('type')!='provenance':errors.append(f'{rel}: state {sid} provenance_id does not resolve to provenance')
            last_by_record[rid]=s
        if not chain:errors.append(f'{rel}: ledger chain cannot be empty')
        if len(last_by_record)!=len(obj.get('record_ids',[])):errors.append(f'{rel}: ledger does not contain a state for every listed record')
        for rid,s in last_by_record.items():
            if s.get('verification_status')!='verified':warnings.append(f'{rel}: latest state for {rid} is not verified')
    print('GEI-Research Validation Engine V1.0.15');print(f'Records scanned: {len(parsed)}');print(f'Errors: {len(errors)}');print(f'Warnings: {len(warnings)}')
    for x in errors:print(f'ERROR: {x}')
    for x in warnings:print(f'WARNING: {x}')
    if errors:print('VALIDATION: FAIL');return 1
    print('VALIDATION: PASS');return 0
if __name__=='__main__':raise SystemExit(main())
