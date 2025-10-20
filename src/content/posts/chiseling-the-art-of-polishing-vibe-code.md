---
title: "Chiseling: The Art of Polishing Vibe Code"
published: 2025-10-19
description: "Vibe coding gives you velocity, but chiseling gives you quality. It's the critical human judgment that separates a prototype from production code."
---

I recently read Mitchell Hashimoto's post on [Vibing a Non-Trivial Ghostty Feature](https://mitchellh.com/writing/non-trivial-vibing), where he describes his "anti-slop sessions":

> Throughout these [prompting sessions], I am usually dropping in and making minor manual changes as well.

> The cleanup step is really important. To cleanup effectively you have to have a pretty good understanding of the code, so this forces me to not blindly accept AI-written code. Subsequently, better organized and documented code helps future agentic sessions perform better.

> I sometimes tongue-in-cheek refer to this as the "anti-slop session".

In the debate around vibe coding, the cleanup step seems to be left out of the conversation. Everyone can agree on the principle of "make it work, make it right, make it fast", and for experienced developers like Mitchell it has become clear that LLMs can rapidly accelerate the "make it work" phase.

But for some reason everyone believes that vibe coding ends there. Instead, at Continue we like to think of the vibe coding process as more akin to sculpture work.

The CLI is your jackhammer, breaking off huge chunks of possibility, letting you verify ideas and explore architectural patterns without getting bogged down in details. As Karpathy outlined in [the original vibe coding post](https://x.com/karpathy/status/1886192184808149383), at this stage you "forget that the code even exists". For many engineers this is uncomfortable, but it's the quickest path to "making it work".

But working code isn't finished code. The kernel of what you actually wanted is buried underneath a mountain of AI-generated slop. Duplicated functionality, 1000 line methods, useless unit tests. Like a sculptor facing a rough-hewn marble block, you need to chisel away the excess to reveal the clean, logical core beneath.

This is when you switch from CLI to IDE, trading the jackhammer for precision tools like [Chat](https://docs.continue.dev/ide-extensions/chat/quick-start) and [Autocomplete](https://docs.continue.dev/ide-extensions/autocomplete/quick-start). You refactor that sprawling function into three focused ones. You strip the over-engineered abstraction that handles one use case. You rename processDataAndTransformResultsIntoFinalFormat() to simply parse().

Chiseling isn't just cleanup, it's comprehension. Each line you refine forces you to understand what the code actually does, not just that it works. This is where "vibe coding" transforms into "vibe engineering." You're no longer just directing an AI, you're taking ownership of every decision, every abstraction, every line that ships.

The temptation is to stop at "working" - after all, the tests pass. But without chiseling, you're not building software, you're accumulating technical debt at a breakneck speed of thousands of tokens per hour. Vibe coding gives you velocity, but chiseling gives you quality. It's the critical human judgment that separates a prototype from production code.

The CLI makes it work. Your chiseling makes it right.
