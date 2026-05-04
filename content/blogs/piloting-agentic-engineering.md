---
title: Piloting Agentic Engineering - What Software Engineers Can Learn From The Aviation Industry
slug: piloting-agentic-engineering
description: AI coding agents are amazing, but lean on them too hard and your engineering skills atrophy. Aviation already lived through this. Here's what we can steal from how they fixed it.
longDescription: Autopilot made flying safer overall but introduced a new failure mode where pilots couldn't take over when automation handed control back. The same shift is showing up in software engineering. Code churn, design flaws, and stability regressions are climbing as AI assistants get more pervasive. This piece draws the parallel, walks through the data (GitClear, Apiiro, DORA), and proposes how to keep engineers sharp without ditching the tools.
tags: ["ai", "agentic-engineering", "career"]
featured: true
readTime: 9
timestamp: 2026-05-01T17:45:00+00:00
---
## Introduction

Over the last few months I've been thinking a lot about what's starting to get known as **Agentic Engineering**.

> Agentic Engineering: integrating AI agents into your existing development workflow under the supervision of an engineer who actually knows what they're doing. 

Like most of my colleagues and friends, I'm a heavy Claude Code (or insert hyped agent harness of the week) user. These tools are genuinely amazing. They really do accelerate you as a software engineer. But the more I've used them, the more I've come to a painful realization: they come with a cost. Call it **coding atrophy**.

## The Agentic Plane

When autopilot was rolled out widely in commercial aviation, the pitch was almost identical to the one we're hearing about AI coding tools today: reduce load on the human, let them focus on the bigger picture, eliminate human error. Sounds great on paper.

It didn't quite work out that way.

Across the 1980s and 1990s, as glass cockpits and fly-by-wire became standard, something strange started showing up in the data. Overall safety did improve. That part of the pitch was true. But a new _category_ of accident emerged. The [FAA's 2010 review](https://www.faa.gov/sites/faa.gov/files/aircraft/air_cert/design_approvals/human_factors/OUFPMS_Report.pdf) of a decade of crashes found that pilot error was a factor in over 60% of them, and a striking number happened in moments when the autopilot had handed control back to the humans and the humans were no longer up to the job.

A few crashes crystallized the problem:

- **Colgan Air 3407 (2009):** The crew failed to respond properly to a stall warning in manual flight. Automation dependency was cited as a contributing factor. [NTSB Report](https://www.ntsb.gov/investigations/AccidentReports/Reports/AAR1001.pdf)
- **Air France 447 (2009):** Pilots who had spent their careers managing automation couldn't recover from a stall when their automation failed at altitude. They stalled an Airbus A330 into the Atlantic over the course of three and a half minutes. [BEA Report](https://www.faa.gov/sites/faa.gov/files/AirFrance447_BEA.pdf)
- **Asiana 214 (2013):** A 777 hit the seawall short of the runway at SFO because the crew misunderstood how their auto-throttle worked. [NTSB Report](https://www.ntsb.gov/investigations/AccidentReports/Reports/AAR1401.pdf)

The common thread: pilots had been promoted from _operators_ to _supervisors_ of the machine. When the machine needed them to be operators again, the muscle memory wasn't there.

## The Same Thing Is Happening to Us (And the Data Is Starting to Show It)

> Updated 2026-05-04 with a more recent data source (METR 2025).

When I started writing this, I assumed the research hadn't caught up yet. It turns out it has. I just hadn't gone looking.

[GitClear](https://www.gitclear.com/ai_assistant_code_quality_2025_research) analyzed over 200 million lines of changed code across major enterprise and open-source repos from 2020 to 2024. Their findings are uncomfortable: code churn (lines reverted or rewritten within two weeks of being committed) has roughly doubled since the pre-AI baseline. Refactoring as a share of code changes dropped from 25% in 2021 to under 10% in 2024. Copy-pasted code is up by nearly half. Their summary line is brutal: AI-assisted code "more resembles an itinerant contributor" than a careful senior developer.

[Apiiro](https://apiiro.com/blog/4x-velocity-10x-vulnerabilities-ai-coding-assistants-are-shipping-more-risks/)'s 2024 security research found AI-generated code introduced **322% more privilege escalation paths** and **153% more design flaws** than human-written code. And because AI-assisted commits get merged about 4x faster than regular ones, this code is reaching production before anyone reviews it carefully.

The cleanest evidence comes from a 2025 randomized controlled trial by [METR](https://arxiv.org/abs/2507.09089). They put 16 experienced open-source developers in front of Cursor on real tasks in their own repositories. Before starting, the developers predicted AI would make them 24% faster. After the study, they estimated they'd been 20% faster. They were actually 19% slower.

Google's own 2024 [DORA](https://services.google.com/fh/files/misc/2024_final_dora_report.pdf) report (not exactly an AI-skeptical source) quantified a 7.2% decrease in delivery stability for every 25% increase in AI adoption.

A note on the data. AI tooling moves faster than rigorous studies can catch up. METR is from mid-2025 and was studying tools that already aren't quite the current frontier. DORA, GitClear and Apiiro is 2024. Treat the specific numbers as directional rather than current. The pattern is consistent across sources, methodologies, and timeframes, and that consistency is what matters more than any single statistic being today's truth.

This isn't a panic. Aggregate developer productivity is genuinely up. Trivial syntax errors are way down. But the _type_ of failure is shifting, exactly the way it shifted in aviation: fewer of the obvious mistakes, more of the deep, structural, hard-to-catch ones. Things that work in isolation but violate the architecture. Patterns copied from public repos that don't fit a regulated environment. Hard-coded credentials in scaffolding. Bugs that ship in seconds and take months to refactor out.

The obvious objection: the models will get better. And they will. The agent-goes-in-circles failure mode I describe will probably look quaint in two years, or heck, even in six months. But that doesn't make the atrophy problem go away. It probably makes it worse. The better the autopilot gets, the less you fly manually, and the more catastrophic the day you have to.

## My Date Bug Moment

I noticed it in myself before I noticed it in the data.

Humans are mainly reviewers now. The lines of code I've actually written have steadily decreased over the last few months. Most of my time goes into prompting agents, orchestrating them so they don't step on each other, and reading their output well enough to tell whether it's right.

Then one day I had a nasty JavaScript Date bug.

The agent went in circles. Suggested a fix, broke something else, suggested another fix, reintroduced the original bug. Standard. Eventually I closed the session and decided to just fix it myself.

And I couldn't.

I mean, I could, eventually. But I felt a real, physical resistance in my head. A blockage. The "easy mode" of the last several months had quietly fried something. Skills I'd spent years building (holding state in my head, stepping through code mentally, forming a hypothesis and testing it) had gone soft. It took me embarrassingly long to fix a bug that, eighteen months ago, I would have closed in twenty minutes.

That was the moment the aviation analogy stopped being a fun thought experiment and started feeling like a warning.

## What Tech Can Learn From Aviation

The aviation industry didn't respond to this problem by ripping out the autopilots. That would have been insane. Automation has been a net massive win for safety. Instead they responded by changing how pilots are _trained_.

Modern aviation training emphasizes what regulators call **automation management**: knowing when to use automation, when to disengage it, and how to step back in cleanly when something goes sideways. Pilots are now required to regularly hand-fly in simulators specifically to keep those skills from atrophying. The FAA's [SAFO 17007](https://www.faa.gov/sites/faa.gov/files/2022-11/SAFO17007.pdf)explicitly tells airlines to _create more opportunities for manual flight_. [EASA](https://ad.easa.europa.eu/ad/2013-05R1) published similar guidance. After Colgan, the U.S. mandated higher minimum pilot training standards by law.

I think we need a software-engineering equivalent. A few half-formed ideas:

**Teach automation management explicitly.** New engineers shouldn't just learn how to prompt. They should learn where agents excel, where they fail, and what the failure modes actually look like. The signal that an agent is bullshitting you is a learnable skill, and right now we're mostly learning it by accident.

**Manual flying days.** One day a week, or even one day a month, where you write code without an agent. Not as performative Luddism, but as a deliberate gym session for the skills that go soft when you don't use them. Pilots don't hand-fly because they distrust autopilots. They hand-fly because they know the day will come when they have to.

**Hard cases on hard mode.** When something is genuinely tricky (a subtle concurrency bug, a weird performance regression, a piece of business logic with a lot of state) close the agent and reason through it yourself first. Even if you eventually hand it off. The thinking is the workout.

**A simulator for engineers.** This is the one I haven't seen anyone build, and I think there's a real gap. Pilots have flight simulators where they can practice engine failures, instrument failures, every kind of off-nominal scenario. We have LeetCode and toy puzzles. What we don't have is a realistic environment for practicing the _actual_ skill that's atrophying. Debugging unfamiliar production-like code, reasoning about state in a real system, recovering from a nasty incident without help. Someone should build that. (Hit me up if you already are. I would be very eager to try this.)

## The Boring Conclusion

I'm not anti-AI. I'm writing this in an editor with an agent open in the next pane. The tools are real, the gains are real, and the people telling you to throw them out are wrong.

But the gains aren't free. Aviation got a thirty-year head start on figuring this out, paid for it in lives, and eventually arrived at a stable answer: the automation stays, the humans stay sharp, and the training adapts to the new reality. We're somewhere in the messy middle of that same arc, except our crashes are silent, distributed across a thousand subtly broken systems, and won't show up on the news most of the time.

The senior engineers we'll need in five years are the ones who stay sharp now. Don't let the autopilot fly the whole flight.

