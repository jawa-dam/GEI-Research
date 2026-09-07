# GEI Research Interface — V1.0.5

The Research Interface is the first presentation layer for the GEI canonical research dataset.

## Architecture

**DATA → LOGIC → INTERFACE**

- `data/` is the canonical research dataset.
- `schema/` defines the structure of canonical records.
- `validation/` checks structural and epistemic integrity.
- `interface/` is a view over the canonical records; it is not a second source of truth.

## Included in V1.0.5

- Research Explorer with full-text search.
- Type, status and confidence filters.
- Record detail panel with canonical JSON preview.
- Master Timeline generated from chronology records.
- Comparison view.
- Epistemic Firewall view showing Source → Evidence → Comparison → Interpretation → Hypothesis.
- Responsive mobile/desktop presentation.
- Direct links back to the canonical GitHub record.

## Data loading

The interface reads the public `main` branch through GitHub's repository contents API and loads JSON records from the canonical `data/` directories. This means the interface does not maintain a duplicate dataset.

## Local preview

Because the browser uses `fetch()` to load repository data, serve this directory with a local HTTP server rather than opening `index.html` directly from `file://`.

Example:

```bash
python -m http.server 8000 --directory interface
```

Then open `http://localhost:8000/`.

## GitHub Pages

This directory can be published as a static GitHub Pages site using an appropriate publishing source or workflow. GitHub Pages supports publishing static files from repositories; a future release can add an automated Pages deployment workflow without changing the canonical data layer.

## Epistemic rule

The interface deliberately presents interpretations and hypotheses as distinct research objects. A visualization or relationship shown by the interface is not, by itself, evidence that a GEI interpretation is historically or scientifically established.
