# Project Phoenix Judge Cheat Sheet

## What Is Phoenix?

Phoenix is the Decision Intelligence Layer for Software Delivery.

It uses GitLab Orbit context to simulate the future consequences of a merge request before it is merged.

## Why Orbit?

The risk is not visible in the diff alone.

Phoenix needs Orbit context:

- Merge Request
- Team Ownership
- Work Items
- Vulnerabilities
- Historical Incidents
- Pipelines
- Deployment Topology
- Business Objectives

Without Orbit, Phoenix is just a risk score. With Orbit, it becomes a Software Future Twin.

## Why Is It Different?

AI code reviewers answer: "What changed?"

Phoenix answers: "What happens next?"

It is not chatbot-centric. It is visual decision intelligence: graph propagation, future timelines, black swan detection, and agentic mitigation.

## What Is The Black Swan?

MR `#4821` has a green pipeline and approved review.

Phoenix finds a 4.8% critical future:

stale mobile clients + session validation change + JWT dependency drift -> Enterprise SSO login failures after rollout.

## What Actions Did Agents Take?

Phoenix mitigation agents:

- Requested Security review.
- Triggered mobile contract validation.
- Created JWT dependency patch work item.
- Posted MR comment with causal chain.
- Added canary rollout gate.

## Why Should It Win?

Phoenix is memorable because it reframes the hackathon:

Not AI for code review. AI for engineering decisions.

Judge takeaway:

"That was the system that used GitLab Orbit to discover a future incident hiding behind a green pipeline."

