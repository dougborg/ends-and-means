# Testing model boundaries

Use test-local records with `research-needed` status to exercise schema
contracts without publishing synthetic or insufficiently researched claims.
Fixtures should say that they are synthetic and should use stable, descriptive
IDs rather than copied legacy row IDs.

For Means families, exercise every required specification facet through
`specified-by` relationships to focused Statements; prose in
`institutionalForm` is not a substitute for the executable relationship.

For overlapping classifications, assert the exact authored relationships and
the absence of inherited Ends, Means, domains, Placements, and assessments. For
Concept/End/Means distinctions, assert separate IDs and entity kinds. For
fiction, test that context is allowed while fictional support cannot satisfy an
empirical claim. For compiler changes, compile equivalent permutations of the
same documents and relationships and compare the serialized graphs; entity,
relationship, and index order must be stable by ID.
