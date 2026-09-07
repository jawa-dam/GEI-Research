# GEI Research Interface — V1.0.6 Deployment

## Deployment model

The Research Interface is deployed as a GitHub Pages project site from the `interface/` directory.

The deployment workflow copies the interface into the Pages artifact root. The browser interface continues to read the canonical dataset from the public GitHub repository through the GitHub Contents API.

### Canonical boundary

- **Canonical data:** `data/`
- **Canonical schemas:** `schema/`
- **Canonical validation:** `validation/`
- **Presentation layer:** `interface/`
- **Deployment workflow:** `.github/workflows/deploy-research-interface.yml`

The deployed site is a view of the repository. It is not a second research database.

## Verification gates

Every deployment must pass:

1. Canonical JSON validation.
2. Required interface asset checks.
3. Required view/DOM checks.
4. Dataset category registry checks.
5. GitHub Pages artifact creation.
6. GitHub Pages deployment.

## Expected site

Once GitHub Pages is enabled for the repository's Actions-based Pages deployment, the project site is expected at:

`https://jawa-dam.github.io/GEI-Research/`

If Pages has not yet been enabled in repository settings, the workflow will stop at the Pages deployment step until the repository is configured to use **GitHub Actions** as its Pages source.

## V1.0.6 verification checklist

- [ ] Workflow verification job passes.
- [ ] Pages deployment job passes.
- [ ] Interface loads without a JavaScript error.
- [ ] Canonical record count appears.
- [ ] Explorer search works.
- [ ] Timeline opens.
- [ ] Comparisons open.
- [ ] Epistemic Firewall view opens.
- [ ] Record inspector opens.
- [ ] Canonical GitHub record links resolve.
- [ ] Mobile layout is usable.
