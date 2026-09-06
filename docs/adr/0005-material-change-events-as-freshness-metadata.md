# ADR 0005: Material-change Events are freshness metadata

## Status

Accepted.

## Context

An ongoing Case already records `asOf`, `lastReviewedAt`, and `freshness`, but those fields cannot identify the documented institutional change that triggered a new editorial review.
Free-text summaries would duplicate claims and could silently turn chronology into a claim that an Event was historically decisive or caused later outcomes.

## Decision

An ongoing Case may list sorted, unique `materialChangeEventIds`.
The field is valid only on an ongoing Case. Each ID must resolve to a reviewed or published Event within the Case review period, and that Event must own at least one reviewed atomic description Statement citing a resolved reviewed or published Source.
The pointer records why editors revisited the Case; it does not assert turning-point status, causal importance, or observed implementation.
Case pages show the freshness dates, the linked Event description evidence, and this non-causal boundary in plain language.

## Consequences

Material change remains independently sourced through Event Statements rather than duplicated on the Case.
Explanations, rival causal accounts, rules in use, and outcomes remain separate Statements and Transition fields.
Ongoing Cases without a documented review trigger may omit the field; ended Cases cannot use it.
