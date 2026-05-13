# DTIFx Minimal Stack Example

A production-ready example showing how design tokens authored in [DTIF](docs/glossary.md#dtif) become enforced code constraints — so developers cannot accidentally use a colour, spacing value, or animation timing that the design system hasn't approved.

---

## Who are you?

| I am a… | Start here |
|---|---|
| **Designer** who wants to understand how my tokens reach code | [GETTING_STARTED.md → Designer path](GETTING_STARTED.md#im-a-designer) |
| **Developer** setting up or working with this repo | [GETTING_STARTED.md → Developer path](GETTING_STARTED.md#im-a-developer) |
| **Platform/CI engineer** integrating this into a pipeline | [GETTING_STARTED.md → Platform path](GETTING_STARTED.md#im-setting-up-ci--platform-engineering) |

---

## Quick start

```bash
pnpm install
pnpm run kernel:start
pnpm run verify
```

Expected output: `N problems (0 errors, N warnings)`. Warnings about unused tokens are normal in this minimal example.

---

## Learn more

| Topic | Document |
|---|---|
| Why the stack is built this way | [docs/architecture.md](docs/architecture.md) |
| How tokens work end to end | [docs/token-system.md](docs/token-system.md) |
| How design-lint rules and the kernel work | [docs/design-lint.md](docs/design-lint.md) |
| Governance, ownership, and the audit step | [docs/governance.md](docs/governance.md) |
| Dark mode and theme overrides | [docs/theming.md](docs/theming.md) |
| Every CI step explained | [docs/ci-pipeline.md](docs/ci-pipeline.md) |
| Every script, grouped and annotated | [docs/script-reference.md](docs/script-reference.md) |
| Adding a token | [docs/how-to-add-a-token.md](docs/how-to-add-a-token.md) |
| Adding a component | [docs/how-to-add-a-component.md](docs/how-to-add-a-component.md) |
| Glossary of all acronyms | [docs/glossary.md](docs/glossary.md) |
| Something broke | [docs/troubleshooting.md](docs/troubleshooting.md) |
| Contributing a change | [CONTRIBUTING.md](CONTRIBUTING.md) |

---

## Reference

- DTIFx Toolkit: <https://dtifx.lapidist.net/>
- [design-lint](https://github.com/bylapidist/design-lint)
