import { canonicalGraph } from "../src/lib/domain/canonical";

console.log(`Validated canonical graph: ${canonicalGraph.entities.length} entities, ${canonicalGraph.relationships.length} relationships.`);
