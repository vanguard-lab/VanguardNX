# Technical Overview: Object Transformation Caching

## Purpose

This system accelerates repeated object-to-object transformations by precomputing and reusing mapping instructions for identical **source class → target class** conversions. It was designed for high-volume transformation pipelines where the same mappings occur hundreds or thousands of times, making traditional per-call computation wasteful.



## Approach

The key concept is to **separate "thinking" from "doing"**:

1. **Thinking Phase**: Classify each field once into transformation categories (custom-mapped, nested object, nested array, direct copy).
2. **Doing Phase**: Apply those precomputed rules directly, skipping redundant classification.

Caching is implemented at the **type-pair level** using weak references to ensure memory is reclaimed when no longer needed.


## How It Works

1. **Identification**: Each transformation is keyed by a combination of the source object's constructor and the target class constructor.
2. **Cache Lookup**: On each transformation request:

   * If a strategy exists in the cache for this type pair, reuse it.
   * Otherwise, compute a new strategy from metadata and optional custom rules, then store it.
3. **Execution**: Apply the cached strategy:

   * Invoke custom mapping functions where defined.
   * Recursively transform nested arrays and nested objects if required.
   * Copy direct fields without transformation overhead.

Weak references allow unused mappings to be garbage collected without manual cleanup.
 
## Why It Was Needed

The original pipeline reanalyzed mapping metadata **for every transformation**, even when processing identical source-target pairs repeatedly. This caused:

* **Unnecessary CPU usage**: Reclassifying identical fields hundreds of times.
* **Increased latency**: Especially visible in large batch processing.
* **Log noise**: Repetitive verbose mapping diagnostics.

By caching transformation strategies:

* Setup cost occurs only once per type pair.
* Runtime overhead per transformation is reduced to a direct application of precomputed rules.
* end-to-end throughput improves significantly in workloads with repeated mappings.

## Limitations and Considerations
* **Cache Warming**: Initial operations incur computation overhead, amortized over time.
* **Memory Trade-offs**: Trades space for speed.
* **Concurrency**: Safe lookups, but misses may duplicate computation briefly in high-thread scenarios.
* **Future Work**: Potential concurrency optimizations.

## Context of Use

* Large-scale DTO ↔ entity conversion layers.
* Batch processing of homogeneous data.
* Systems requiring predictable transformation latency under load.

explore implementation at [object-transformer.ts](./object-transformer.ts)
