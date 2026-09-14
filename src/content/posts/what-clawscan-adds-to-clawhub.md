---
title: 'What ClawScan Adds to ClawHub'
published: 2026-09-14T12:00:00-07:00
draft: true
description: 'ClawHub now runs Tencent Zhuque Lab’s A.I.G scanner alongside its existing skill checks. Here is what changed, why we use multiple scanners, and how to inspect the evidence.'
tags:
  - 'OpenClaw'
  - 'ClawHub'
  - 'Security'
author: 'Patrick Erichsen'
---

Skills are one of the reasons OpenClaw is useful. They can give an agent new instructions, scripts, dependencies, and tools. That also makes installing a skill closer to adding software than copying a prompt.

The uncomfortable part is that no single scanner understands every way a skill can go wrong. A static check may catch an encoded command but miss a plausible-looking instruction that redirects the agent. A model-based review may understand the instruction but overlook a dependency or an obfuscated file. A clean result from either one is useful evidence, not a guarantee.

[ClawScan](https://github.com/openclaw/clawscan) is built for this problem. It is a composable security scanning harness for agent skills: run several scanners against the same artifact, keep their raw evidence, and optionally pass that evidence to a judge. Profiles make a particular scanner and judge configuration repeatable.

ClawScan's built-in `clawhub` profile is the configuration we use for ClawHub. In August, [we added Tencent Zhuque Lab's A.I.G scanner to that production profile](https://github.com/openclaw/clawscan/pull/48). It now runs alongside NVIDIA SkillSpector and ClawScan's deterministic static checks. When A.I.G completes, ClawScan attaches its SARIF evidence to the judge rather than flattening it into a single score.

ClawScan can also take an explicit OpenClaw plugin directory or manifest as a target. The profile runs the scanners that support plugins and passes package-release context to the judge. That is broader than this particular rollout, which requires A.I.G evidence for standalone skills.

## From scanner output to evidence you can inspect

Adding a scanner to a profile was the small part. We also had to make the result useful at the registry boundary.

[The ClawHub integration](https://github.com/openclaw/clawhub/pull/3522) pins the scanner dependencies used by workers, restricts the environment passed to the scanner process, normalizes A.I.G's SARIF output, and stores the result with the skill version it evaluated. For standalone skill scans, missing or unusable A.I.G evidence stops publication instead of quietly turning into a pass. A.I.G supplies evidence; it does not decide ClawHub's final verdict on its own.

The same evidence appears on ClawHub's security audit page. A.I.G reports against nine SkillTrustBench vulnerability patterns, including instruction hijacking, remote payload execution, privilege escalation, persistence, tool hijacking, insecure dependencies, and unsafe coding practices. If it finds something, the audit can show the rule, severity, file and line, description, and remediation supplied by the scanner.

I like this shape because it leaves a trail. The registry does not ask readers to trust a badge with no context. You can inspect which scanners ran, what they returned, and which version of the skill they evaluated.

## What the production canary caught

We shipped the integration through a deliberately harmless canary skill. The canary asks the agent to return one fixed sentence and forbids tools, files, network access, credentials, and mutations. Its job is to exercise the real publication path without hiding failures behind a complicated artifact.

The first run found problems in our own integration. The host-mode publication worker was missing a scanner dependency, so [we restored the pinned SkillSpector install](https://github.com/openclaw/clawhub/pull/3605) and [kept the useful tail of scanner errors](https://github.com/openclaw/clawhub/pull/3606). A.I.G also sent a temperature value that the configured model rejected, so [we pinned a compatible model](https://github.com/openclaw/clawhub/pull/3607).

After those fixes, the [public production canary audit](https://clawhub.ai/patrick-erichsen-2/skills/aig-production-canary/security-audit?version=1.0.7) stored a clean A.I.G result with zero findings. That result covers this exact canary version under the configured checks. Scanners can still miss malicious behavior in other skills.

The current rollout applies to standalone skill scans. Coverage for skills bundled inside plugins remains separate follow-up work.

## Reproduce the profile locally

ClawScan is open source, and the production profile is part of the repository. You can inspect the scanner catalog and run the same profile against a local skill:

```bash
npm install -g @openclaw/clawscan
clawscan scanners aig
clawscan ./my-skill --profile clawhub
```

Command-backed scanners and judges use ClawScan's Docker runtime by default. The [ClawScan README](https://github.com/openclaw/clawscan#quick-start) documents Docker, A.I.G dependency, and provider key requirements, along with the full results artifact.

There is plenty left to improve. We can add scanners, test them against shared benchmarks, and make the evidence easier to compare. The useful starting point is that the production configuration and its output are public enough to inspect, reproduce, and challenge.
