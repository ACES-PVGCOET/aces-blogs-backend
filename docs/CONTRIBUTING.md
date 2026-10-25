# Contributing

The goal: everyone works on their own module in parallel, and branches merge without conflicts.

## The one rule
**Only edit files inside your own module folder** (plus your `docs/api/<module>.md` and your own `test/<module>.e2e-spec.ts`).
`app.module.ts` already imports all four modules, so you never need to touch it.

Need a change in shared code (`src/common/`, `app.module.ts`, `main.ts`, config files)? Don't edit it on your feature branch. Open a small separate PR named `chore: ...`, get it merged to `main`, then merge `main` into your branch.

## Branches and commits
- Branch from `main`: `feat/user-mgmt-api`, `feat/blog-post-api`, `feat/blog-cat-api`, `feat/blog-uploads-api`. Smaller pieces: `feat/blog-post-api-submit`, `fix/...`, `docs/...`.
- Commit messages: `feat: ...`, `fix: ...`, `docs: ...`, `test: ...`, `chore: ...` (add the module if you like: `feat(blog): ...`).

## Your workflow (PowerShell)
```powershell
git clone https://github.com/<org>/<repo>.git
cd <repo>
npm install
copy .env.example .env              # fill in your own DB password and secrets
git checkout -b feat/blog-post-api

# ...work inside your module folder...
git add .
git commit -m "feat: create blog and save content"
git push -u origin feat/blog-post-api      # then open a Pull Request into main on GitHub
```

Keep up with `main` often, so merges stay small:
```powershell
git checkout main
git pull
git checkout feat/blog-post-api
git merge main
```

## Adding a package
Install it on your branch (`npm install <package>`) and commit `package.json` and `package-lock.json`.
If `package-lock.json` conflicts when merging: `git checkout main -- package-lock.json`, then `npm install` to regenerate it.

## Pull requests
- CI must be green (build + tests). Add tests for what you built in `test/<module>.e2e-spec.ts`.
- At least 1 teammate reviews. Squash-merge, then delete the branch.
- Fill in the checklist in the PR template.

## Never commit
`.env`, `node_modules/`, `dist/`, passwords, API keys, tokens. If a secret gets pushed by accident, tell the team: it must be rotated, deleting the commit isn't enough.

## Testing against the database
Tests use their own database whose name contains `test`. Never point tests at your dev database.
