---
title: 'AI Slop Is a Process Problem, Not a People Problem'
published: 2026-02-27
description: 'AI code quality failures are usually process failures. The scalable fix is the same one CI/CD taught us: encode standards into automated checks and enforce them before merge.'
subtitle: 'This article was originally posted on '
subtitleUrl: 'https://blog.continue.dev/ai-slop-is-a-process-problem'
subtitleUrlText: 'blog.continue.dev/ai-slop-is-a-process-problem'
tags:
  - 'Continuous AI'
  - 'Standards-as-Code'
author: 'Patrick Erichsen'
---
Before CI/CD, production stability was personal. Someone pushed broken code on a Friday, the site went down, and the postmortem ended with a name. You broke it, you own it.

CI/CD didn't just automate builds and deployments. It restructured accountability. When tests ran on every push and deployment pipelines enforced quality gates, "who pushed the bug" became less interesting than "why did the pipeline let it through." Teams started writing tests collectively, maintaining pipelines collaboratively, treating production stability as a shared system rather than a sum of individual conscientiousness.

The blame shifted from people to process. That was the real change.

Coding agents are creating the same moment. Most teams are responding the same way we did before CI/CD, by blaming individuals.

## The Blame Is Landing in the Wrong Place

Teams adopting coding agents are shipping 2-5x more PRs, with agents often writing the vast majority of the lines of code, if not all of them. When something substandard ships, the postmortem has a new target: the developer who let the agent write it. They should have reviewed more carefully. They should have prompted differently. They trusted the output too much.

This is the same mistake teams made before CI/CD. It frames a systems problem as a personal one.

The agent didn't ship slop because the developer was careless. It shipped slop because nothing in the process was there to catch it. The code went from agent to PR to merge without any standard enforcement. No gate asked whether that new API endpoint needed rate limiting. No check verified the database query matched your team's established patterns. Nothing flagged the missing input validation.

Blaming the developer doesn't fix that gap. A better process does. Code throughput went up 2-5x, but the number of senior engineers who can review didn't change. Individual review of every agent-generated line doesn't scale.

## What the Systems Answer Looks Like

When CI/CD matured, quality enforcement moved into the pipeline. Tests had to pass. Lint rules had to hold. Security scans blocked merges. Not because developers became less careful, but because care alone wasn't enough at scale.

The systems answer for AI-generated code follows the same pattern: encode your team's standards explicitly, then run them as automated checks on every pull request.

This means writing down what you actually require. Every new endpoint needs rate limiting. New external dependencies need a justification comment. Database queries follow your established patterns. Documentation updates when the code they describe changes. These aren't novel standards; they're the things your senior engineers catch in code review, stated clearly enough for an automated system to evaluate.

AI checks do that evaluation on every PR, before human reviewers see the code. Continue builds them as version-controlled markdown files in your repo, each running as a full agent on every PR, checking exactly what you told it to check. It passes silently or fails with a specific complaint and a suggested fix. The developer using a coding agent doesn't need to hold every team standard in their head on every commit. The pipeline holds them. Not a generic AI reviewer with opinions. Your standards, enforced consistently, without reviewer fatigue. What a staff engineer catches on their first PR review of the week, still caught on their eighth.

## The Question Worth Asking

CI/CD didn't eliminate production incidents. It changed the question teams asked when one happened. Not "who did this?" but "what let this through?" That reframe led to better pipelines, better standards, and a culture where production stability was owned collectively rather than assigned to whoever was last to push.

AI-generated code is generating a new category of incident. Teams are still asking "who let the agent write this?" The more productive question is "what should have caught this before it merged?"

[Continue](https://continue.dev) makes each check a markdown file in your repo. Define one standard your team enforces in review, add it as a check, and run it on your next PR.
