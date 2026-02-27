---
title: 'AI Slop Is a Process Problem, Not a People Problem'
published: 2026-02-27
description: 'AI code quality failures are usually process failures. The scalable fix is the same one CI/CD taught us: encode standards into automated checks and enforce them before merge.'
tags:
  - 'Continuous AI'
  - 'Standards-as-Code'
author: 'Patrick Erichsen'
---

This article was originally posted on https://blog.continue.dev/ai-slop-is-a-process-problem

Before CI/CD, production stability was personal. Someone pushed broken code on a Friday, the site went down, and the postmortem ended with a name. You broke it, you own it.

CI/CD didn't just automate builds and deployments. It restructured accountability. When tests ran on every push and deployment pipelines enforced quality gates, "who pushed the bug" became less interesting than "why did the pipeline let it through." Teams started writing tests collectively, maintaining pipelines collaboratively, treating production stability as a shared system rather than a sum of individual conscientiousness.

The blame shifted from people to process. That was the real change.

The same shift is due now, and most teams are missing it.

## The Blame Is Landing in the Wrong Place

Teams adopting AI-assisted coding are shipping 2-5x more PRs. A growing share of that code starts from an agent. When something substandard ships, the postmortem has a new target: the developer who let the agent write it. They should have reviewed more carefully. They should have prompted differently. They trusted the output too much.

This is the same mistake teams made before CI/CD. It frames a systems problem as a personal one.

The agent didn't ship slop because the developer was careless. It shipped slop because nothing in the process was there to catch it. The code went from agent to PR to merge without any standard enforcement. No gate asked whether that new API endpoint needed rate limiting. No check verified the database query matched your team's established patterns. Nothing flagged the missing input validation.

Blaming the developer doesn't fix that gap. A better process does.

## The Pre-CI/CD Parallel

Before automated testing, teams relied on developers to manually verify their changes. Some were thorough. Some weren't. Quality became a function of individual diligence rather than system design. The response to every incident was the same: be more careful.

The same conversation is happening now about AI coding: review Claude's output more carefully, don't trust it blindly, you still need to read every line. The advice is right. It doesn't scale.

The problem with relying on individual review is that it doesn't hold at volume. Before CI/CD, code throughput was limited enough that manual verification was plausible. CI/CD removed that constraint, and suddenly teams had to decide: do we scale review headcount linearly with throughput, or do we encode our standards and automate enforcement?

Teams that chose the latter didn't lower their quality bar. They stopped relying on every developer holding every standard in their head on every PR, and started encoding standards into the pipeline itself.

AI coding tools have made the same case for the same solution. Code throughput went up 2-5x. The number of senior engineers who can review didn't change. Individual review of every AI-generated line is the "be more careful" answer. It doesn't scale.

## What the Systems Answer Looks Like

When CI/CD matured, quality enforcement moved into the pipeline. Tests had to pass. Lint rules had to hold. Security scans blocked merges. Not because developers became less careful, but because care alone wasn't enough at scale.

The systems answer for AI-generated code follows the same pattern: encode your team's standards explicitly, then run them as automated checks on every pull request.

This means writing down what you actually require. Every new endpoint needs rate limiting. New external dependencies need a justification comment. Database queries follow your established patterns. Documentation updates when the code they describe changes. These aren't novel standards; they're the things your senior engineers catch in code review, stated clearly enough for an automated system to evaluate.

AI checks do that evaluation on every PR, before human reviewers see the code. Continue builds them as version-controlled markdown files in your repo, each running as a full agent on every PR, checking exactly what you told it to check. It passes silently or fails with a specific complaint and a suggested fix. The developer using a coding agent doesn't need to hold every team standard in their head on every commit. The pipeline holds them. Not a generic AI reviewer with opinions. Your standards, enforced consistently, without reviewer fatigue. What a staff engineer catches on their first PR review of the week, still caught on their eighth.

## The Question Worth Asking

CI/CD didn't eliminate production incidents. It changed the question teams asked when one happened. Not "who did this?" but "what let this through?" That reframe led to better pipelines, better standards, and a culture where production stability was owned collectively rather than assigned to whoever was last to push.

AI-generated code is generating a new category of incident. Teams are still asking "who let the agent write this?" The more productive question is "what should have caught this before it merged?"

[Continue](https://continue.dev) makes each check a markdown file in your repo. Define one standard your team enforces in review, add it as a check, and run it on your next PR.
