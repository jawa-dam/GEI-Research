#!/usr/bin/env python3
"""GEI Research V1.0.17 consensus/disagreement validation layer."""
import json,re
from pathlib import Path
from jsonschema import Draft202012Validator
ROOT=Path(__file__).resolve().parents[1]
SCHEMA=json.loads((ROOT/'schema/consensus.schema.json').read_text(encoding='utf-8'))
DATA=ROOT/'data/consensus/CON-GEI-V1017-001.json'
ID_RE=re.compile(r'^[A-Z]{3}(?:-[A-Z0-9]+)+-[0-9]{3}$')
obj=json.loads(DATA.read_text(encoding='utf-8'))
errors=[]
for e in Draft202012Validator(SCHEMA).iter_errors(obj): errors.append('.'.join(str(x) for x in e.absolute_path)+': '+e.message)
for d in obj.get('disagreements',[]):
    if len(d.get('positions',[]))<2: errors.append(f"{d.get('disagreement_id')}: disagreement requires at least two positions")
    if not all(ID_RE.fullmatch(x.get('operator_id','')) for x in d.get('positions',[])): errors.append(f"{d.get('disagreement_id')}: invalid operator reference")
if obj.get('consensus_status')!='not_assessed' and not obj.get('consensus_summary'): errors.append('assessed consensus requires a summary')
print('GEI-Research V1.0.17 Consensus Validation')
print('Errors:',len(errors))
for e in errors: print('ERROR:',e)
raise SystemExit(1 if errors else 0)
