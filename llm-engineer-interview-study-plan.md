# LLM Engineer — Build-Driven Interview Study Plan & Syllabus

A learn-by-doing prep plan for the ₹25–50 LPA LLM/GenAI engineer switch. Every module is **a thing you build**, with an exhaustive **TOPICS** checklist (cover all of it), the **UNLOCKS** interview questions that build lets you answer, and a **DRILL** to rehearse out loud.

> ~75% of 2026 AI technical rounds are GenAI (RAG, evals, prompting, agents); ~25% classical/core. One well-built RAG project answers questions across LLM fundamentals, architecture, system design, and behavioral rounds at once.

**How to use:** BUILD the artifact → tick every TOPIC (if you can't explain it, go break/fix that part of the build) → answer every UNLOCKS question aloud → DRILL the whiteboard version. ~14–16 hrs/week while employed (Track A ~10, Track B ~5); ramp mocks in the final 3 weeks.

---

# TRACK A — AI (build-driven)

## Module 0 — Python (the primary language) — Week 1–3

### 0a — Python core, the Java→Python delta (Week 1)
**TOPICS:** data types & mutability (list, tuple, set, dict, str, bytes); variables & references; comprehensions (list/dict/set/generator); slicing; `*args`/`**kwargs`; default args + the mutable-default trap; functions as first-class objects; closures & late binding; decorators; generators, iterators, `yield`, lazy evaluation; context managers & `with`; exceptions & custom exceptions; `enumerate`/`zip`/`map`/`filter`; f-strings; `dataclasses`; modules, packages, imports; `pip` + virtualenv/`uv`/`poetry`; duck typing; EAFP vs LBYL; truthiness; `is` vs `==`; shallow vs deep copy; name mangling (`_`/`__`).
**BUILD:** Port a small Java utility you know to idiomatic Python; then 10 micro-scripts, one per feature above, run with `pytest`.
**UNLOCKS:** list vs tuple vs set vs dict (mutability/hashability); comprehensions; `*args`/`**kwargs`; write a decorator; generators vs lists (memory); context managers; shallow vs deep copy; duck typing; mutable-default & late-binding closure traps; how Python does "private"/"interfaces".
**DRILL:** The 5 things that bite Java devs in Python — indentation-as-syntax, dynamic typing, mutable defaults, the GIL, no compile step.

### 0b — Typing, OOP & async (Week 2)
**TOPICS:** type hints & `typing` module; `mypy`; Pydantic models & runtime validation; classes; dunder/magic methods (`__init__`, `__repr__`, `__eq__`, `__len__`, `__enter__/__exit__`, `__call__`); `@property`; inheritance, MRO; abstract base classes & `Protocol`; `@dataclass` vs Pydantic vs plain class; `asyncio`, event loop, coroutines, `async`/`await`, `gather`, tasks, `async with`/`async for`; the GIL; threading vs multiprocessing vs asyncio (CPU- vs I/O-bound); memory management (reference counting + cyclic GC).
**BUILD:** A typed module (classes + dunders + `@property` + Pydantic + `mypy` clean); an async script firing 20 concurrent `httpx` calls via `asyncio.gather`, timed vs a sync loop.
**UNLOCKS:** type hints + Pydantic; five dunder methods; dataclass vs Pydantic vs class; event loop & coroutines; the GIL and why async (not threads) wins for I/O-bound LLM work but multiprocessing for CPU-bound; async vs Java threads; Python memory management.
**DRILL:** Why an LLM gateway is I/O-bound, and how one event loop juggles hundreds of in-flight calls on one thread despite the GIL.

### 0c — The AI service scaffold (Week 3)
**TOPICS:** FastAPI (routing, path/query/body, dependency injection, middleware, background tasks); Pydantic request/response models; streaming responses (SSE); async endpoints; error handling & exception handlers; `pytest` (fixtures, mocking, async tests); logging; packaging (`pyproject`/`requirements`); `httpx`/`requests`; reading-level Pandas & NumPy.
**BUILD:** A typed FastAPI service proxying chat completions — async, Pydantic-validated, streaming, `/health`, validated JSON output, tests. The scaffold for every later project.
**UNLOCKS:** FastAPI vs Flask vs Django; enforce structured output + handle malformed JSON; request/response validation & error handling; token streaming to a client.
**DRILL:** Stand up a streaming, validated LLM endpoint; explain each layer (router → Pydantic → async client → stream).

---

## Module 1 — LLM foundations playground — Week 4–6

**TOPICS:** transformer architecture; self-attention (Query/Key/Value, scaled dot-product); multi-head attention; feedforward layers, residual connections, layer normalization; positional encoding (sinusoidal, learned, RoPE, ALiBi) & context-length extrapolation (YaRN); tokenization (BPE, WordPiece, SentencePiece, vocabulary, special tokens, subwords); token count → cost & context; embeddings & semantic similarity; embedding models & dimensions; context window & "lost in the middle"; decoding/sampling (greedy, beam, temperature, top-p, top-k, repetition penalty, logits); quantization (8-bit, 4-bit/NF4, GGUF) & tradeoffs; training pipeline (pretraining → SFT → RLHF/DPO, reward model, PPO); scaling laws (Chinchilla 20:1), emergent abilities, inference-time compute / reasoning models; open vs closed models (GPT, Claude, Llama, Mistral, Gemini); causes of hallucination; (intro) multimodal models.
**BUILD:** A "model lab": tokenizer visualizer + token counter; temperature/top-p/top-k sliders showing output change; one interface over 3 providers (Anthropic, OpenAI, local Ollama); per-call cost & latency logging.
**UNLOCKS — the foundations round (one wrong and the loop is over):** how attention works (Q/K/V, multi-head); why positional encoding, RoPE vs ALiBi; BPE vs WordPiece vs SentencePiece + why tokens drive cost/context; what an embedding is; context window & what breaks past it; temperature vs top-p vs top-k, logits; quantization tradeoffs; pretraining→SFT→RLHF & why aligned models over-refuse; open vs closed tradeoffs.
**DRILL:** Whiteboard attention (Q·Kᵀ → softmax → ·V) in 4 minutes; explain why a 10k-token prompt costs ~10× a 1k one.

---

## Module 2 — Production RAG service — Week 7–10  ← hero project

**TOPICS:** RAG pipeline (ingest → chunk → embed → store → retrieve → augment → generate); document loading & parsing (PDF, tables, layout, OCR, HTML, Markdown); chunking (fixed-size, overlap, recursive, semantic, parent-child, document-aware) & sizing; embeddings (model choice, normalization, Matryoshka, anisotropy); vector DBs (pgvector, Qdrant, Weaviate, Pinecone, Chroma, Milvus, FAISS); ANN indexes (HNSW, IVF, product quantization) & metadata filtering; sharding & re-indexing (zero-downtime); retrieval (dense, sparse/BM25, hybrid, reciprocal rank fusion, top-k, MMR); reranking (cross-encoders); query transformation (HyDE, decomposition, step-back, multi-query, rewriting); advanced RAG (corrective/CRAG, self-RAG, agentic RAG, GraphRAG, contextual retrieval); citations & source attribution; access control (RBAC/ABAC, per-user/per-doc) & multi-tenancy; scaling to millions of docs under latency budgets + caching; freshness/index updates, knowledge conflict, dedup; RAG metrics (faithfulness, answer relevance, context precision/recall, RAGAS); RAG vs fine-tuning vs long-context.
**BUILD:** FastAPI RAG service over a real corpus (few-thousand docs/PDFs): chunk → embed → store (pgvector, then a managed DB) → hybrid retrieval (dense+BM25+RRF) → cross-encoder rerank → generate with citations. Measure NDCG@k before/after rerank. Small UI.
**UNLOCKS:** RAG's four stages; choosing a chunking strategy (fixed/semantic/recursive/parent-child, size+overlap); hybrid search, RRF, reranking, "lost in the middle"; query transformation; citations; scaling to 500M docs <200ms (HNSW/PQ/sharding); per-user access control; failure debugging (hallucinating with correct context, slow retrieval, duplicates/dedup, domain jargon, PDF tables); RAG vs fine-tuning with cost awareness.
**DRILL:** "Design a RAG system for customer support" end-to-end in 8 min — the most-asked AI system-design question.

---

## Module 3 — Agent + MCP — Week 11–13

**TOPICS:** agent vs chain vs simple call; reasoning loops (ReAct, ReWoo, Plan-and-Execute, Reflexion, LLMCompiler); tool/function calling, tool design & JSON schemas; memory (in-context buffer, vector/semantic, episodic, procedural, summarization); planning & self-correction; single vs multi-agent (orchestrator-worker, supervisor, hierarchical, debate) & why most break past ~5 steps; frameworks (LangChain, LangGraph state machines, LlamaIndex, CrewAI, AutoGen); MCP (JSON-RPC, transports: stdio/HTTP-SSE/streamable; primitives: tools/resources/prompts/sampling; capability negotiation, federation; security: tool poisoning, TOFU pinning, least-privilege); control (loop/step caps, timeouts, infinite-loop handling); cost (token budget, model routing, caching); human-in-the-loop (approval gates, interruption semantics, durable execution, idempotent resume); agent failure-mode taxonomy (specification, execution, environmental, alignment); agent guardrails.
**BUILD:** A multi-step agent (research/triage over APIs + your RAG store): ReAct loop, tool defs, short/long-term memory, step cap, human approval gate before risky actions, one MCP integration; orchestrate with LangGraph or CrewAI.
**UNLOCKS:** agent vs LLM call; ReAct + tool design; single vs multi-agent, orchestrator-worker, why demos break past 5 steps; memory types; MCP (transports, primitives, vs function calling/REST); infinite-loop fix; token/cost budget & model routing; human-in-the-loop semantics.
**DRILL:** "Design an insurance-claim (or Spotify-support) agent using RAG with cost control + human fallback" — tools, loop cap, guardrails, escalation.

---

## Module 4 — Evaluation + observability harness — Week 11–14 (parallel)

**TOPICS:** why eval is hard (non-determinism); offline eval (curated/golden sets); online eval (LLM-as-judge + its biases/failure modes); metrics (task success; faithfulness, answer relevance, context precision/recall; tool-call accuracy; trajectory vs outcome; why BLEU/ROUGE/exact-match are limited); RAGAS; agent eval & the GAIA gap; regression testing on non-deterministic output; non-deterministic CI gates; shadow evaluation; A/B testing; benchmark contamination; observability (OpenTelemetry, GenAI semantic conventions, spans, attributes, trace propagation; Langfuse/LangSmith/Helicone); production metrics (p50/p95/p99 latency, token usage, cost-per-task, error rate); drift & silent quality decay; layered hallucination defense; guardrails (input/output validation, PII, prompt injection, jailbreak, content moderation).
**BUILD:** An eval harness for your RAG + agent: offline set (~150 examples) + online LLM-as-judge over traces + a CI gate that blocks deploys on regression; RAGAS metrics; OpenTelemetry → Langfuse/LangSmith dashboard (latency, tokens, cost-per-task).
**UNLOCKS:** evaluate a RAG system (faithfulness, relevance, precision/recall); offline vs online + LLM-as-judge biases; evaluate an agent (trajectory vs outcome, tool-call accuracy, GAIA); regression on non-deterministic output + shadow eval; catching silent decay; what becomes a span & how trace IDs propagate; layered hallucination defense.
**DRILL:** "We ship by vibe — make deploys safe": versioned eval set + numeric gate + regression alarm + shadow eval; alert on regression, not absolute thresholds.

---

## Module 5 — Fine-tuning run — Week 15–16

**TOPICS:** when to fine-tune (vs RAG/prompt); training types (pretraining, continued pretraining, SFT, instruction tuning, alignment: RLHF/DPO/ORPO); PEFT (LoRA, QLoRA, adapters, prefix tuning); quantization for training (4-bit/NF4, bitsandbytes); GPU-memory math; distributed training (FSDP, ZeRO/DeepSpeed); data prep (instruction formatting, chat templates, loss masking, data quality > quantity); catastrophic forgetting & mitigation; evaluating fine-tunes; serving many fine-tunes (multi-LoRA); privacy/security in training data (PII exclusion, masking, provenance); Hugging Face stack (`transformers`, `peft`, `trl`, `datasets`, Hub).
**BUILD:** One real QLoRA fine-tune of a small open model (Llama/Mistral 7–8B) on Colab/Lambda for a narrow task; publish the adapter to HF Hub; compare tuned-small vs prompted-large on cost/latency/quality.
**UNLOCKS:** pretraining vs SFT vs instruction tuning vs RLHF vs RAG vs prompt; LoRA/QLoRA/PEFT/DPO + QLoRA GPU-memory math; catastrophic forgetting & mitigation; when to fine-tune vs RAG; fintech scenario — fine-tune without exposing sensitive data, exclude/verify training data.
**DRILL:** RAG-vs-fine-tune decision framework with real numbers (run cost, retraining cadence, forgetting risk).

---

## Module 6 — Go live: serving, cost & production system design — Week 17–18

**TOPICS:** LLM serving (vLLM, SGLang, TGI; continuous batching; KV-cache reuse; paged attention); inference optimization (quantization, speculative decoding, prompt caching, semantic caching); cost optimization (model routing, prompt compression, caching, batching); scaling (load balancing, autoscaling, rate limiting, queueing, backpressure & overflow path); latency (streaming, time-to-first-token, SLAs, sync vs async, QPS); reliability (retries, fallbacks, circuit breakers, timeouts); guardrails/safety (prompt injection, PII, content filtering, output validation, jailbreak defense); security/compliance (access control, audit logging, data residency, RBAC/ABAC); deployment (Docker, Kubernetes, CI/CD, IaC); cloud AI (AWS Bedrock/SageMaker, GCP Vertex, Azure OpenAI); LLMOps (model & prompt versioning, monitoring, rollback, canary); AI system-design patterns.
**BUILD:** Deploy one project as a **live, always-on, monitored** service — Dockerized on AWS/GCP, CI/CD, usage+cost tracking, rate limiting, retries, prompt-injection/PII guardrails, public demo link. Keep it running.
**UNLOCKS:** design an LLM-serving system (continuous batching, KV-cache, backpressure + overflow, QPS/SLA, sync vs async); inference cost/latency optimization (routing, caching, vLLM/SGLang); guardrails (injection, leakage, PII; RBAC/ABAC in pipeline/RAG/prompts); security/compliance (block unauthorized data, audit/log, prevent output leakage); GenAI safety in consumer products.
**DRILL:** "Design an AI system integrating a third party's data + workflows" — ingestion (batch/stream/hybrid) → retrieval/agent → serving (batching/caching) → eval → guardrails → cost controls.

---

# TRACK B — Core engineering interview rounds (runs throughout)

These fail more senior candidates than the AI rounds. ~4–5 hrs/week, ramp before loops.

## Module 7 — Java + Spring
**TOPICS:** core Java & OOP; collections + internals (`HashMap`, `ConcurrentHashMap`, `ArrayList`, `TreeMap`); generics; concurrency (threads, `ExecutorService`, `CompletableFuture`, locks, `volatile`, `synchronized`, atomics, `java.util.concurrent`, fork-join, race conditions, deadlocks); Java 21 virtual threads & structured concurrency; JVM (memory model, heap/stack, classloading, JIT); GC (G1, ZGC) & tuning; memory leaks & profiling; streams & functional Java; exceptions, `Optional`; records, sealed classes, pattern matching, switch expressions; Spring (IoC/DI, AOP, bean lifecycle, Boot auto-config, MVC, Data/JPA, `@Transactional`, Security); REST design; testing (JUnit, Mockito).
**BUILD/REFRESH:** Use virtual threads in a concurrent client for your LLM gateway.
**DRILL:** Explain virtual threads vs platform threads; walk a GC pause you'd debug.

## Module 8 — Databases
**TOPICS:** SQL (joins, aggregations, subqueries, CTEs, window functions); indexing (B-tree, composite, covering, partial); query optimization & `EXPLAIN`/plans; N+1; transactions & ACID; isolation levels; MVCC; locking & deadlocks; normalization vs denormalization; schema design; partitioning; sharding; replication (leader/follower, sync/async); NoSQL types (document, key-value, wide-column, graph); CAP & eventual consistency; caching (Redis, cache-aside, write-through, TTL, invalidation, stampede); connection pooling.
**BUILD/REFRESH:** Tune `pgvector` + metadata queries with `EXPLAIN`; add a Redis cache before RAG retrieval.
**DRILL:** Read an `EXPLAIN` plan; pick isolation level for a given consistency need.

## Module 9 — Kafka & event-driven
**TOPICS:** architecture (broker, topic, partition, offset, replication, ISR, leader election); producers (acks, idempotence, batching, partitioning, keys); consumers (groups, rebalancing, offset commit, lag); delivery semantics (at-most/at-least/exactly-once); ordering guarantees; transactions/EOS; schema registry; Kafka Streams & Connect; DLQ, retries, backpressure; outbox pattern; Kafka vs RabbitMQ vs SQS; event-driven patterns (event sourcing, CQRS, saga).
**BUILD/REFRESH:** Re-architect Project 2's ingestion as a Kafka pipeline (producer → consumer chunks/embeds/indexes).
**DRILL:** Achieve exactly-once + ordering in a pipeline; explain the tradeoffs.

## Module 10 — System design
**TOPICS:** fundamentals (scalability, availability, reliability, latency vs throughput, consistency); back-of-envelope estimation; load balancing (L4/L7, algorithms); caching (layers, eviction, CDN); databases (SQL/NoSQL choice, sharding, replication, indexing); messaging & queues; consistency (CAP, PACELC, quorums); API design (REST, gRPC, GraphQL, idempotency, pagination); rate limiting; microservices (gateway, service discovery, circuit breaker, saga, bulkhead); data-intensive patterns; observability; security; **AI system design** (RAG platform, multi-tenant LLM gateway, agent orchestration with cost controls).
**DRILL the canon out loud:** URL shortener, news feed, chat, rate limiter, distributed cache, payment/ledger, notification service. Method: clarify → estimate → high-level → deep-dive one component → bottlenecks/tradeoffs. **Your edge:** fuse both tracks in one answer.

## Module 11 — DSA (background drip; in Python)
**TOPICS / patterns:** arrays & strings; hashing; two pointers; sliding window; stacks & queues; linked lists; trees & BST; heaps/priority queues; tries; graphs (BFS, DFS, Dijkstra, union-find, topological sort); recursion & backtracking; binary search; sorting; greedy; dynamic programming (1-D, 2-D, knapsack, LIS, edit distance); intervals; bit manipulation; Big-O time/space analysis.
**BUILD:** Solve in Python (doubles as language fluency). ~3–5/week, daily in the final 2–3 weeks. Heavy only if the target tests it.

---

# Behavioral round (prep now)

**TOPICS:** STAR method; quantified results ("p95 4s → 900ms"); ownership/shipping stories; a confident-then-wrong story (show the debugging path); a production incident diagnosed via traces; a cost-vs-latency-vs-quality tradeoff; GenAI safety/reliability approach; conflict resolution; learning a new domain fast.
**Have ready:** the end-to-end live LLM system you shipped; an incident you debugged; a hard tradeoff; a disagreement you resolved; "why the switch to AI."

---

# The capstone logic (why this works)

Your shipped artifacts are arranged so one project answers many rounds:
- **RAG service** → LLM fundamentals, RAG architecture, vector DBs, system design, behavioral.
- **Agent + eval harness** → agents, MCP, evaluation, observability, failure modes.
- **QLoRA run** → fine-tuning, RAG-vs-finetune, security/compliance.
- **Live deployment** → serving, cost/latency, guardrails, the "I operate production AI" story.

Every answer starts with "When I built X, I hit exactly this — here's what I did and the number it moved." That sentence wins the ₹25–50 LPA band.

---

# Final 3 weeks — interview mode

- **Daily:** 2 system-design or RAG/agent-design drills out loud.
- **Mocks:** 2–3/week (one AI technical, one system design, one core-eng) — peer or LLM as interviewer.
- **Flashcards:** run your own TOPICS + UNLOCKS lists; any gap → reopen the build and break/fix that part.
- **Per company:** map the JD to these modules; rehearse the 3 likeliest questions.
- Keep the live demo running and READMEs sharp — interviewers click them.
