# Curriculum Deep Dive — Beginner → Advanced

This is the long-form, narrative companion to [`llm-engineer-interview-study-plan.md`](llm-engineer-interview-study-plan.md)
and the in-app content (`src/data/content.json`). The study plan gives you the *checklist*; this
document gives you the *explanation* — written assuming you're a strong backend engineer (e.g. senior
Java) with **zero prior ML background**, walking each module from "what is this and why does it exist"
up to the depth an interview loop actually probes.

**How to use it:** read a module's section before (or instead of) staring at its topic checklist in the
app — it's written to be read top to bottom, not skimmed as bullets. Click any link below to jump
straight to that module.

---

## Table of contents

### Track A — AI / LLM engineering
1. [0a · Python core — the Java→Python delta](#m0a)
2. [0b · Typing, OOP & async](#m0b)
3. [0c · The AI service scaffold (FastAPI)](#m0c)
4. [0d · AI/ML foundations & PyTorch](#m0d)
5. [1 · LLM foundations playground](#m1)
6. [2 · Production RAG service (hero project)](#m2)
7. [3 · Agents + MCP](#m3)
8. [4 · Evaluation + observability](#m4)
9. [5 · Fine-tuning run](#m5)
10. [6 · Go live — serving, cost & system design](#m6)

### Track B — Core engineering (runs in parallel)
11. [7 · Java + Spring](#m7)
12. [8 · Databases](#m8)
13. [9 · Kafka & event-driven](#m9)
14. [10 · System design](#m10)
15. [11 · DSA](#m11)
16. [12 · Behavioral round](#m12)

---

<a id="m0a"></a>
## 🐍 0a · Python core — the Java→Python delta
*Track A · Week 1*

Python and Java agree on the basics (variables, functions, loops) and disagree on almost everything
structural, and most of the pain for a Java engineer comes from not knowing *where* the disagreement is.
Start with **data types**: Python's `list` is mutable and ordered (like an `ArrayList`), `tuple` is
immutable and ordered, `set` is like a `HashSet` (unordered, hashable elements only), and `dict` is like a
`HashMap`. The catch Java doesn't prepare you for is that **variables are references to objects, not
typed boxes** — `x = [1, 2, 3]` doesn't declare a list-typed slot, it binds the name `x` to a list object,
and `y = x` makes `y` point at the *same* object, so mutating it through `y` is visible through `x` too.
This is exactly why the **mutable-default-argument trap** (`def f(items=[]):`) bites everyone once: the
default list is created *once*, at function-definition time, and shared across every call that doesn't
pass its own — the fix is `def f(items=None): items = items or []`.

**Comprehensions** (`[x*2 for x in items if x > 0]`, plus dict/set/generator variants) are Python's
terse replacement for the `for`-loop-building-a-list pattern, and **slicing** (`items[1:-1]`,
`items[::2]`) is a first-class operation on any sequence. `*args`/`**kwargs` let a function accept
arbitrary positional/keyword arguments — the same mechanism that lets every `requests.get(*args,
**kwargs)`-style wrapper stay generic. Functions are **first-class objects** — you can pass them as
values, return them from other functions, and store them in data structures — which is what makes
**closures** possible: an inner function that captures a variable from its enclosing scope. The
classic gotcha is **late binding** in loops: `[lambda: i for i in range(3)]` produces three closures that
all print `2`, because they capture the *variable* `i`, not its value at creation time — you fix it with
a default argument (`lambda i=i: i`) to snapshot the value.

A **decorator** (`@decorator` above a `def`) is just a higher-order function that wraps another function
to add behavior — logging, timing, caching — without touching its source:
```python
import functools

def timed(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        import time
        start = time.perf_counter()
        result = func(*args, **kwargs)
        print(f"{func.__name__} took {time.perf_counter() - start:.4f}s")
        return result
    return wrapper

@timed
def slow_call(n):
    return sum(range(n))
```
`functools.wraps` copies over `__name__`/`__doc__` so introspection still works on the wrapped function.
**Generators** (functions using `yield`) produce values lazily, one at a time, instead of building a
full list in memory — critical once you're streaming millions of rows or token-by-token LLM output later
in the curriculum. **Context managers** (`with open(...) as f:`) guarantee cleanup (closing a file,
releasing a lock) even if an exception fires partway through, implemented via `__enter__`/`__exit__`.

Round out the module with: **exceptions** (custom exception classes, `try/except/else/finally`);
`enumerate`/`zip`/`map`/`filter` as the idiomatic alternatives to manual index-tracking loops;
**f-strings** for interpolation; `@dataclass` for boilerplate-free value classes; how `import`/packages
work and why you isolate dependencies per-project with a virtualenv (`venv`, `uv`, or `poetry` — Python
has no single built-in package manager the way Maven/Gradle anchor Java); **duck typing** ("if it walks
like a duck" — Python checks behavior, not declared type, the opposite of Java's interface contracts);
**EAFP vs LBYL** ("easier to ask forgiveness than permission" — Python idiom is `try`/`except` over
pre-checking, the inverse of Java's defensive-check style); Python's **truthiness** rules (`0`, `""`,
`[]`, `None` are all falsy); `is` (identity) vs `==` (equality); shallow vs deep copy (`copy.copy` vs
`copy.deepcopy` — does copying a list of lists copy the inner lists too?); and name-mangling
(`_protected`, `__private`) as Python's *convention-based*, not enforced, stand-in for Java's access
modifiers.

**🔨 Build:** Port a small Java utility you know to idiomatic Python, then 10 micro-scripts (one per
feature above) under `pytest`.
**🎤 Drill:** The 5 things that bite Java devs hardest — indentation-as-syntax, dynamic typing, mutable
defaults, the GIL, no compile step.

---

<a id="m0b"></a>
## 🧵 0b · Typing, OOP & async
*Track A · Week 2*

Python is dynamically typed at runtime but supports **type hints** (`def f(x: int) -> str:`) that tools
like `mypy` statically check — hints are *not enforced* at runtime (Python will happily run code that
violates them), they're documentation that a linter/IDE/CI step verifies, closer to a lightweight,
optional version of Java's compile-time type checking. **Pydantic** goes further and *does* enforce
types at runtime: you define a model (`class User(BaseModel): name: str; age: int`), and Pydantic
validates and coerces incoming data (e.g. parsed JSON) against it, raising a clear validation error on
mismatch — this is the backbone of every FastAPI request/response model you'll write starting next
module.

Python **classes** support the dunder ("double underscore") methods that hook into language syntax:
`__init__` (constructor), `__repr__` (debug string), `__eq__` (equality, since Python doesn't
auto-generate `equals()` like a Java `record`), `__len__` (powers `len(obj)`), `__enter__`/`__exit__`
(context-manager protocol from module 0a), `__call__` (makes an instance callable like a function).
`@property` turns a method into something accessed like an attribute (`obj.value` instead of
`obj.value()`), Python's answer to getters/setters without the ceremony. **Inheritance** works
similarly to Java single-inheritance-of-state, but Python supports true **multiple inheritance**,
resolved via the **MRO** (Method Resolution Order, the C3 linearization algorithm) — important because
it's a real interview gotcha ("which parent's method wins?"). **Abstract base classes** (`abc.ABC` +
`@abstractmethod`) are Python's `abstract class`; **`Protocol`** (structural typing) is Python's closer
analogue to a Java `interface` — a class satisfies a `Protocol` just by having the right methods, no
explicit `implements` needed, which is duck typing formalized for the type checker. `@dataclass`,
Pydantic models, and plain classes form a spectrum: dataclass for boilerplate-free internal value
objects with no validation, Pydantic when you need runtime validation (any data crossing a trust
boundary — an API request, a config file), plain class when you need custom behavior beyond data
holding.

The other half of this module is **async** — the single most important Python concept for AI service
work, because LLM calls are I/O-bound (you're mostly *waiting* on a network response, not computing).
`asyncio` runs an **event loop** on a single thread; an `async def` function is a **coroutine** that
*suspends* at each `await` point instead of blocking the thread, letting the event loop run other
coroutines while waiting:
```python
import asyncio, httpx

async def fetch(client, url):
    resp = await client.get(url)
    return resp.json()

async def main():
    async with httpx.AsyncClient() as client:
        results = await asyncio.gather(*(fetch(client, url) for url in urls))
```
`asyncio.gather` runs many coroutines concurrently and waits for all of them — this is how one Python
process can have hundreds of in-flight LLM/API calls on a single thread. This only works because of
**the GIL** (Global Interpreter Lock — only one thread executes Python bytecode at a time): for
**I/O-bound** work (network calls), `asyncio` wins because threads would mostly sit blocked on I/O anyway
and the GIL costs you nothing; for **CPU-bound** work (heavy computation), the GIL means threads don't
actually parallelize CPU work, so you reach for **multiprocessing** (separate processes, separate GILs,
true parallelism) instead. This is a sharp contrast with Java, where platform threads give you real
parallelism for both cases — Python's concurrency story is genuinely different, not just syntactically
different. Round out with Python's **memory management**: reference counting (an object is freed the
instant its refcount hits zero) plus a cyclic garbage collector to catch reference cycles refcounting
alone can't clear — no JVM-style generational heap, no GC pause tuning to think about.

**🔨 Build:** A typed module (classes + dunders + `@property` + Pydantic, `mypy`-clean) and an async
script firing 20 concurrent `httpx` calls via `asyncio.gather`, timed against a naive sync loop.
**🎤 Drill:** Why an LLM gateway is I/O-bound, and how one event loop juggles hundreds of in-flight calls
on a single thread despite the GIL.

---

<a id="m0c"></a>
## 🛰️ 0c · The AI service scaffold (FastAPI)
*Track A · Week 3*

Every project for the rest of the curriculum is a FastAPI service wearing a different hat — RAG today,
an agent later, a fine-tuned model behind an endpoint after that — so this module builds the scaffold
once. **FastAPI** routes HTTP requests to Python functions via decorators (`@app.post("/chat")`),
reads path/query/body parameters directly from type-hinted function signatures, and uses **dependency
injection** (`Depends(...)`) to share things like a DB session or an auth check across routes without
manually wiring them — conceptually similar to Spring's `@Autowired`, but function-based rather than
class/bean-based. **Middleware** runs code around every request (logging, CORS, auth headers);
**background tasks** let a route return a response immediately while continuing work (e.g. logging an
analytics event) after the response is sent.

Every request/response body is a **Pydantic model** — FastAPI validates incoming JSON against it
automatically and rejects malformed input with a structured 422 error before your handler code even
runs, which is exactly how you "enforce structured output" from an LLM-backed endpoint: validate the
model's JSON output against a Pydantic schema and retry/repair on failure. **Streaming responses**
(Server-Sent Events, SSE) push a response incrementally instead of all at once — essential for chat UIs,
where you want to show the model's tokens as they're generated rather than waiting for the full
response:
```python
from fastapi import FastAPI
from fastapi.responses import StreamingResponse

app = FastAPI()

async def token_stream():
    async for token in call_llm_streaming(prompt):
        yield f"data: {token}\n\n"

@app.post("/chat")
async def chat():
    return StreamingResponse(token_stream(), media_type="text/event-stream")
```
Routes are typically `async def` so they don't block the event loop while waiting on the LLM provider's
API (tying directly back to module 0b's async story). **Error handling** uses FastAPI's exception
handlers to turn raised exceptions into consistent JSON error responses rather than leaking stack
traces. `pytest` (with fixtures for shared setup, `unittest.mock`/`pytest-mock` for stubbing external
calls, and `pytest-asyncio` for testing coroutines) is the testing layer; structured **logging**,
`pyproject.toml`-based **packaging**, and `httpx` (the async-capable successor to `requests`) round out
the engineering hygiene. Finally, **Pandas/NumPy at reading level** — you don't need to be a data
scientist, but you do need to read `df.groupby(...).agg(...)` or a NumPy shape error without panicking,
since both show up constantly in ML tooling from here on.

**🔨 Build:** A typed FastAPI service proxying chat completions — async, Pydantic-validated, streaming,
a `/health` endpoint, validated JSON output, tests. This literally becomes the skeleton for every later
project.
**🎤 Drill:** Stand up a streaming, validated LLM endpoint and explain each layer out loud — router →
Pydantic → async client → stream.

---

<a id="m0d"></a>
## 🔥 0d · AI/ML foundations & PyTorch
*Track A · Week 4–5*

This is the bridge module — everything here exists so that Module 1's "self-attention" and "softmax over
logits" land as *applications of things you already understand*, not new magic. **Machine learning**
inverts how you're used to writing software: instead of hand-coding rules, you show a system many
(input, correct-output) examples and search for a function — a set of numbers called **parameters** —
that reproduces the mapping and generalizes to new inputs. Frame every problem as **X → Y**: features
(X) predict a label (Y); if Y is a number it's **regression**, if Y is a category it's
**classification**. **Linear regression** (`y = w·x + b`) is the simplest learnable model; for
classification, you squash the linear output through **sigmoid** (binary) or **softmax** (multi-class)
to get a valid probability distribution — softmax over vocabulary logits is *literally* an LLM's last
layer, and temperature/top-p/top-k (from Module 1) are just different ways of sampling that same
distribution.

A **loss function** is a single number measuring how wrong the model currently is — **MSE** for
regression, **cross-entropy** for classification (and **perplexity**, the standard LLM metric, is just
`e^cross-entropy`, the exact same number transformed for readability). **Gradient descent** is the
search algorithm: compute the gradient (direction of steepest loss increase) and step the opposite way,
governed by a **learning rate**; in practice you do this over small **mini-batches**, not the whole
dataset at once. For a multi-layer network, **backpropagation** computes every layer's gradient
efficiently via the calculus chain rule, propagating error backward from output to input — you'll derive
this by hand once in this module's build specifically so that **PyTorch's `autograd`** (which does this
chain-rule bookkeeping automatically) stops being a black box.

A single **neuron** is `activation(w·x + b)` — nonlinear activations (**ReLU**, **GELU**, sigmoid,
tanh) are mandatory, because stacking purely linear layers collapses into one linear layer no matter how
many you chain; an **MLP** stacks neurons into hidden layers, and the transformer's "feedforward" block
you'll meet next module is exactly a small MLP applied per token. Everything is **tensors** — the
n-dimensional generalization of vectors/matrices — and the operation that dominates all of deep learning
is **matrix multiplication**, the same `QKᵀ` you'll see in attention. Standard ML hygiene applies before
any of this is useful: **train/val/test splits** (never evaluate on training data), watching for
**overfitting vs underfitting** (the bias-variance tradeoff), and **regularization** (weight decay,
dropout, early stopping, batch/layer norm — LayerNorm being the exact normalization inside every
transformer block) to fight overfitting on purpose. **Precision/recall/F1/ROC-AUC** round out
evaluation, reused later for RAG-retrieval quality. **AdamW** — momentum + adaptive per-parameter
learning rates + decoupled weight decay — is the optimizer that trains essentially every modern LLM;
**parameters** (learned weights) vs **hyperparameters** (learning rate, batch size, etc., chosen by you)
is a distinction worth never confusing when debugging a bad run. **GPUs** win because matmul is
embarrassingly parallel across thousands of simple cores; **mixed precision** (fp16/bf16) is the same
idea behind the **quantization** you'll meet in fine-tuning, pushed further. Two closing-context pieces:
**classical ML** (decision trees, random forests, XGBoost — often the *right* choice for tabular data,
and kNN, which is literally what vector-DB similarity search does) and **why transformers beat RNNs**
(RNNs process sequentially — no GPU parallelism — and suffer vanishing gradients over long sequences;
attention solves both by letting every token reach every other token in one hop, in parallel).

The PyTorch-specific run: tensors with `requires_grad=True` track operations for `.backward()` to walk
later; `nn.Module` subclasses define layers in `__init__` and the forward pass in `forward()`;
`Dataset`/`DataLoader` handle batching/shuffling; and the **5-line training loop** —
`zero_grad → forward → loss → backward → step` — is the one shape you'll reuse, unchanged, for every
model for the rest of this curriculum:
```python
model = MLP(in_dim=2, hidden_dim=16, out_dim=1).to(device)
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3)
loss_fn = nn.MSELoss()

for epoch in range(num_epochs):
    for x_batch, y_batch in dataloader:
        x_batch, y_batch = x_batch.to(device), y_batch.to(device)
        optimizer.zero_grad()
        loss = loss_fn(model(x_batch), y_batch)
        loss.backward()
        optimizer.step()
```
At inference time, `model.eval()` switches Dropout/BatchNorm into inference behavior and
`torch.no_grad()` stops building the autograd graph to save memory — both forgotten independently, both
silent bugs.

**🔨 Build:** A 2-layer NN on a toy dataset (e.g. XOR), implemented *twice* — by hand in NumPy (manual
backprop, no autograd) and in PyTorch — confirming both converge to the same loss curve.
**🎤 Drill:** Write a 2-layer MLP in PyTorch from memory in under 10 minutes, narrating each line to a
non-ML engineer.

---

<a id="m1"></a>
## 🧠 1 · LLM foundations playground
*Track A · Week 6–8*

The **transformer** (2017) replaced recurrence with **self-attention**: every token attends to every
other token directly and in parallel. A decoder-only block (GPT/Claude/Llama-style) stacks: masked
self-attention → residual add → LayerNorm → feedforward (the MLP from module 0d) → residual add →
LayerNorm, repeated N times, ending in a projection to vocabulary logits. **Self-attention** projects
each token into **Query, Key, Value** vectors; `Attention(Q,K,V) = softmax(QKᵀ/√d_k)V` — the `√d_k`
scaling stops dot products from saturating softmax (and killing gradients) in high dimensions.
**Multi-head attention** runs several of these attention computations in parallel with different learned
projections, letting different heads specialize (one might track syntax, another long-range
coreference), then concatenates the results. **Positional encoding** matters because attention alone is
permutation-invariant — it needs an explicit signal for token order; the original transformer used fixed
sinusoidal vectors, modern models lean on **RoPE** (rotary position embeddings, encoding *relative*
position directly into the Q/K dot product) or **ALiBi** (a distance-based penalty added to attention
scores), both chosen partly for how well they extrapolate to longer contexts than seen in training
(further pushed by techniques like **YaRN**).

**Tokenization** (BPE, WordPiece, SentencePiece) splits text into subword units from a fixed vocabulary
— this is *why* a 10k-token prompt costs roughly 10× a 1k one: cost and context usage are measured in
tokens, not characters or words, and a token is rarely a whole word. **Embeddings** turn a token (or
later, a whole chunk of text) into a dense vector positioned so that semantically similar things land
near each other — the same concept from module 0d's word2vec discussion, just learned end-to-end inside
the model now. The **context window** is the maximum number of tokens the model can attend over at
once; push past it and you either get truncated or hit **"lost in the middle"** — models attend more
reliably to the start/end of a long context than its middle. **Decoding** turns the final logits into
actual text: **greedy** (always pick the top token) is deterministic but bland; **temperature** reshapes
the probability distribution before sampling (low = confident/deterministic, high = diverse/random);
**top-p** (nucleus sampling) samples from the smallest set of tokens whose cumulative probability
exceeds `p`; **top-k** restricts sampling to the k most likely tokens; **repetition penalty** discourages
looping. **Quantization** (storing weights in 8-bit or 4-bit instead of 32-bit, e.g. **NF4**, packaged
as **GGUF** for local inference) trades a little precision for a much smaller memory footprint — the
same mixed-precision idea from module 0d, pushed further specifically to fit huge models into limited
GPU memory.

The **training pipeline** has three stages: **pretraining** (self-supervised next-token prediction over
massive web-scale text — cheap "labels," since the next word in real text is free), **SFT**
(supervised fine-tuning on curated instruction/response pairs to make the model follow instructions),
and **RLHF/DPO** (alignment using human preference data — a reward model scores outputs, and
**PPO** or the simpler **DPO** updates the policy toward preferred responses) — this alignment step is
why heavily-aligned models sometimes over-refuse benign requests. **Scaling laws** (the Chinchilla
result: roughly 20 tokens of training data per parameter is compute-optimal) describe how loss falls
predictably with more compute/data/parameters, and **emergent abilities** are capabilities (like
multi-step reasoning) that appear only past a certain scale rather than improving smoothly — modern
**reasoning models** spend extra inference-time compute (longer chains of thought) to trade latency for
quality on hard problems. Know the landscape of **open** (Llama, Mistral — weights downloadable, you
can self-host/fine-tune) vs **closed** (GPT, Claude, Gemini — API-only, generally stronger frontier
quality, no infra burden) models and the tradeoff between them. Finally, **hallucination** — confidently
wrong output — stems from the model being a probability-over-tokens machine with no built-in fact
database or "I don't know" reflex unless specifically trained for one; this sets up the entire
Evaluation module later. **Multimodal** models (text+image+audio in one model) get only a brief intro
here — same transformer backbone, different tokenization of non-text inputs.

**🔨 Build:** A "model lab" — tokenizer visualizer + counter, temperature/top-p/top-k sliders showing
live output change, one interface over 3 providers (Anthropic, OpenAI, local Ollama), per-call cost/
latency logging.
**🎤 Drill:** Whiteboard attention (`Q·Kᵀ → softmax → ·V`) in 4 minutes; explain why a 10k-token prompt
costs ~10× a 1k one.

---

<a id="m2"></a>
## 🐉 2 · Production RAG service — hero project
*Track A · Week 9–12*

**RAG (Retrieval-Augmented Generation)** answers "the model doesn't know my private docs" by retrieving
relevant text at query time and stuffing it into the prompt, instead of (or before) fine-tuning. The
pipeline: **ingest → chunk → embed → store → retrieve → augment → generate**. **Document loading**
handles real-world messiness — PDFs with multi-column layout and tables, scanned pages needing OCR,
HTML/Markdown stripping. **Chunking** splits documents into retrieval-sized pieces: fixed-size with
overlap (simple, can split mid-thought), recursive (split on structure — paragraphs, then sentences),
semantic (split where meaning shifts), parent-child (retrieve a small precise chunk, but feed the model
its larger parent for context) — chunk size is a real tradeoff between retrieval precision and answer
context.

Each chunk becomes a vector via an **embedding model** (dimension and normalization choices matter;
techniques like **Matryoshka** embeddings let you truncate a vector to a smaller size at lower fidelity
for speed). **Vector databases** (pgvector, Qdrant, Weaviate, Pinecone, Chroma, Milvus, FAISS) store and
search these vectors at scale using **approximate nearest-neighbor (ANN)** indexes — **HNSW** (a
navigable graph structure) and **IVF** (clustering + searching only nearby clusters) trade a small
amount of recall for huge speedups over exact search, and **product quantization** compresses vectors
further for memory. Real systems need **sharding** and **zero-downtime re-indexing** as data grows, plus
**metadata filtering** (search only this tenant's, or this date range's, vectors).

**Retrieval** itself is rarely embeddings alone: **hybrid search** combines dense (embedding similarity)
with sparse (BM25 keyword matching, which dense embeddings are surprisingly bad at — exact product
codes, acronyms), merged via **reciprocal rank fusion (RRF)**; **MMR** (maximal marginal relevance)
diversifies results to avoid five near-duplicate chunks. A **reranker** (a cross-encoder that scores
query+chunk pairs jointly, more accurate but slower than embedding similarity) re-sorts the top-k
candidates for precision before generation. **Query transformation** improves what you search with in
the first place: **HyDE** (generate a hypothetical answer, embed *that* instead of the raw query),
query decomposition (split a complex question into sub-questions), step-back prompting, multi-query, and
rewriting. **Advanced RAG** patterns layer on top: **CRAG** (corrective RAG — grade retrieved chunks and
fall back to web search if poor), **Self-RAG** (the model decides when retrieval is even needed),
**agentic RAG** (an agent decides how/when to retrieve, can issue multiple retrieval rounds),
**GraphRAG** (retrieve over a knowledge graph for multi-hop questions), and **contextual retrieval**
(prepend chunk-level context before embedding so isolated chunks aren't ambiguous).

Production concerns: **citations** (track which chunk supports which claim, both for trust and for
debugging hallucination-with-correct-context failures), **access control** (RBAC/ABAC so a user only
ever retrieves documents they're authorized to see — a real security boundary, not a UI nicety) and
**multi-tenancy**, **scaling** to hundreds of millions of documents under a latency budget (this is
where HNSW/PQ/sharding/caching all combine), **freshness** (re-indexing as source docs change, resolving
**knowledge conflicts** between an old and a new version of a fact, **deduplication**). **RAG metrics**
— **faithfulness** (is the answer actually grounded in the retrieved context, or hallucinated on top of
it?), **answer relevance**, **context precision/recall** — are usually computed via the **RAGAS**
framework, reusing precision/recall straight from module 0d's classical-ML metrics section. Finally,
**RAG vs fine-tuning vs long-context**: RAG wins when knowledge changes frequently and you need
attribution; fine-tuning wins for teaching a *behavior/format* rather than *facts*; simply stuffing
everything into a huge context window works for small corpora but doesn't scale on cost or "lost in the
middle" risk.

**🔨 Build:** A FastAPI RAG service over a real few-thousand-document corpus: chunk → embed → store
(pgvector, then a managed DB) → hybrid retrieval (dense+BM25+RRF) → cross-encoder rerank → generate with
citations, measuring NDCG@k before/after reranking, with a small UI.
**🎤 Drill:** "Design a RAG system for customer support," end-to-end, in 8 minutes — the most-asked AI
system-design question in the loop.

---

<a id="m3"></a>
## 🤖 3 · Agents + MCP
*Track A · Week 13–15*

An **agent** differs from a plain LLM call or a fixed chain by *looping*: it observes, decides on an
action (often calling a tool), observes the result, and decides again — rather than running one
predetermined sequence of steps. **ReAct** (Reason + Act) interleaves a model's chain-of-thought with
tool calls in one loop; **Plan-and-Execute** separates planning from execution (plan once, then run
each step, replanning only on failure — cheaper than ReAct's reasoning at every step); **Reflexion**
adds a self-critique step after failures to improve the next attempt; **ReWoo** and **LLMCompiler**
optimize for fewer, more parallel model calls. **Tool/function calling** is the mechanism that turns
"the model can describe an action" into "the model can actually trigger one" — you describe each tool
as a JSON schema (name, parameters, description), the model emits a structured call matching that
schema, and your code executes it and feeds the result back in. Good **tool design** (clear names,
tight argument schemas, descriptive errors) matters more to agent reliability than prompt cleverness
does.

**Memory** comes in layers: an in-context buffer (just the recent conversation), vector/semantic memory
(embed and retrieve past interactions — literally RAG applied to the agent's own history), episodic
memory (specific past events), procedural memory (learned skills/workflows), and summarization
(compress old context to make room). **Single-agent vs multi-agent**: patterns like
orchestrator-worker (one agent delegates subtasks to specialized workers), supervisor, hierarchical, and
debate (multiple agents argue toward a better answer) exist because **most agent demos break past
roughly 5 sequential steps** — error compounds, context grows stale, and the agent loses the plot;
splitting responsibility across agents (or just hard step-capping) is the practical fix, not "use a
smarter model." Frameworks (LangChain for primitives, LangGraph for explicit state-machine control flow
over an agent loop, LlamaIndex for retrieval-heavy agents, CrewAI/AutoGen for multi-agent
orchestration) are tooling choices on top of the same ReAct-style core loop.

**MCP (Model Context Protocol)** standardizes how a model-facing application exposes tools/data to *any*
LLM client, instead of every app writing bespoke integrations per model provider — it's JSON-RPC under
the hood, over **stdio** (local process), **HTTP+SSE**, or the newer **streamable HTTP** transport, with
three primitives: **tools** (callable actions), **resources** (readable data, like files), and
**prompts** (reusable prompt templates) — plus **sampling**, which lets an MCP server ask the connected
client's LLM to do work on the server's behalf. Servers and clients negotiate supported **capabilities**
on connection, and MCP explicitly designs for **security**: a malicious or compromised MCP server can
attempt **tool poisoning** (hiding malicious instructions inside a tool's description, since the model
reads that description as context), so clients should pin servers via **TOFU** (trust-on-first-use) and
grant only the **least privilege** a tool actually needs.

Engineering the loop itself: **control** mechanisms — step caps, timeouts, explicit infinite-loop
detection (the agent calling the same tool with the same args repeatedly) — and **cost** management
(token budgets per run, routing cheap sub-tasks to a smaller/cheaper model, caching repeated tool
results). **Human-in-the-loop** patterns add an approval gate before any risky/irreversible action,
handle a human pausing and later resuming a run (**interruption semantics**), and require **durable,
idempotent** execution so a retried step doesn't double-charge a credit card or double-send an email.
Know the **failure-mode taxonomy**: specification failures (the goal/instructions were ambiguous),
execution failures (right plan, tool call went wrong), environmental failures (the external system was
down/changed), and alignment failures (the agent optimized the letter of the goal against its spirit) —
and the **guardrails** (input/output validation, scoped tool permissions, approval gates) that mitigate
each category.

**🔨 Build:** A multi-step agent (research/triage over APIs plus your own RAG store): ReAct loop, tool
definitions, short/long-term memory, a step cap, a human-approval gate before risky actions, one real
MCP integration, orchestrated with LangGraph or CrewAI.
**🎤 Drill:** "Design an insurance-claim (or Spotify-support) agent using RAG, with cost control and a
human fallback" — tools, loop cap, guardrails, escalation path.

---

<a id="m4"></a>
## 📊 4 · Evaluation + observability harness
*Track A · Week 13–16 (parallel)*

LLM output is **non-deterministic** and open-ended, so "does this test pass?" doesn't have a clean
boolean answer the way a unit test does — this is *why* eval is hard, and the entire reason this module
exists as its own discipline rather than "just write more unit tests." **Offline eval** runs a curated,
versioned "golden set" of representative examples against every change before it ships — a regression
gate, conceptually like a test suite, except the assertions are scored, not boolean. **Online eval**
uses **LLM-as-judge** (a separate model call that scores another model's output against a rubric) on
live or shadow traffic — useful because it scales far better than human review, but it has real **biases
and failure modes**: position bias (favoring the first option shown), self-preference (a model judging
favorably outputs similar to its own style), and verbosity bias (rewarding longer answers regardless of
quality) — you mitigate these with randomized ordering, multiple judge models, and rubric-anchored
scoring rather than open-ended "which is better?" prompts.

Reuse module 0d/2's metrics here at the system level: **task success rate**, **faithfulness** /
**answer relevance** / **context precision/recall** for RAG (computed via **RAGAS**), **tool-call
accuracy** for agents, and the **trajectory vs outcome** distinction for agent eval (did it reach the
right answer — outcome — via a sane path — trajectory — or stumble into it?); the **GAIA gap** refers to
the large drop in real-world agent benchmarks (GAIA) versus narrower academic ones, evidence that
"works in the demo" badly under-promises real-world difficulty. Classic NLP metrics (**BLEU, ROUGE,
exact-match**) are explicitly limited for open-ended generation — they reward surface lexical overlap,
not semantic correctness, so a perfectly good paraphrase scores low.

**Regression testing on non-deterministic output** means you can't assert exact string equality, so
**CI gates** instead assert aggregate score thresholds over the golden set (and ideally alert on *score
regression*, not just an absolute floor, since the right bar moves as the product evolves). **Shadow
evaluation** runs a new model/prompt version against live traffic without serving its output to real
users, comparing scores before a real rollout; **A/B testing** is the next step once you do serve it,
comparing real user outcomes between variants. **Benchmark contamination** — a model having seen the
benchmark's exact questions during pretraining — is why public leaderboard numbers can be misleading
and why your own golden set, kept private, matters more than any public benchmark score.

**Observability** wires production LLM/agent calls into standard tracing: **OpenTelemetry** with
GenAI-specific semantic conventions defines what becomes a **span** (one model call, one tool call, one
retrieval step) and how trace IDs **propagate** across an agent's nested calls, visualized in tools like
**Langfuse/LangSmith/Helicone**. **Production metrics** to actually watch: latency percentiles
(**p50/p95/p99** — the tail matters more than the average for user-perceived slowness), token usage,
**cost-per-task**, and error rate. **Drift** and **silent quality decay** (the model/provider changes
underneath you, or your data distribution shifts, and quality degrades without any error being thrown)
are why continuous eval — not a one-time launch check — matters. Close with **layered hallucination
defense** (retrieval grounding + citation requirements + a final fact-check/judge pass — no single layer
is sufficient alone) and **guardrails** (input validation against prompt injection, output validation
for PII leakage, jailbreak detection, content moderation) as the practical, ship-blocking safety net.

**🔨 Build:** An eval harness for your RAG + agent — an offline set of ~150 examples, online
LLM-as-judge over live traces, a CI gate blocking deploys on regression, RAGAS metrics, and an
OpenTelemetry → Langfuse/LangSmith dashboard for latency/tokens/cost-per-task.
**🎤 Drill:** "We ship by vibe — make deploys safe": versioned eval set + numeric gate + regression alarm
+ shadow eval; alert on regression, not an absolute threshold.

---

<a id="m5"></a>
## 🧬 5 · Fine-tuning run
*Track A · Week 17–18*

**When to fine-tune** is the first and most interview-relevant question: fine-tuning teaches a model a
*behavior, format, or style* (always respond in this JSON shape; always sound like this brand voice;
get much better at this one narrow task) far more reliably than prompting alone, but it does **not**
teach the model new *facts* well or cheaply — for facts that change, RAG (module 2) is almost always the
right tool, and prompting alone is the right first thing to try before reaching for either. **Training
types** sit on a spectrum: pretraining (from scratch, essentially never done by a single engineer),
continued pretraining (more unlabeled domain text), **SFT** (supervised fine-tuning on
instruction/response pairs), and alignment methods — **RLHF** (reward model + PPO), **DPO** (a simpler,
more stable alternative that skips training a separate reward model by directly optimizing on
preference pairs), and **ORPO** (folds the alignment objective into the SFT loss itself, skipping a
separate stage).

**PEFT** (parameter-efficient fine-tuning) is what makes fine-tuning practical on a single GPU instead of
a cluster: **LoRA** freezes the original model weights and trains small, low-rank "adapter" matrices
inserted alongside them — a tiny fraction of the parameter count, fast to train, cheap to store, and
swappable. **QLoRA** combines this with 4-bit **quantization** (NF4, via the `bitsandbytes` library) of
the frozen base model, dramatically cutting GPU memory so a 7-8B model can fine-tune on a single
consumer-class GPU. **GPU-memory math** is worth being able to do live: roughly 2 bytes/parameter for a
model in fp16, plus optimizer state, gradients, and activations on top during training — quantization
and LoRA both attack this budget from different angles (smaller base weights; far fewer trainable
gradients/optimizer-state parameters, respectively). For anything beyond single-GPU scale,
**distributed training** (FSDP, DeepSpeed's ZeRO stages) shards the model and/or optimizer state across
multiple GPUs.

**Data prep** matters more than people expect: correct instruction-formatting and **chat templates**
(matching exactly how the base model expects turns to be delimited), **loss masking** (only computing
loss on the assistant's response tokens, not the prompt), and the now-common finding that **data
quality beats data quantity** by a wide margin for fine-tuning specifically. **Catastrophic forgetting**
— the model getting *worse* at general capabilities it had before fine-tuning, because the new training
signal overwrote weights useful for other tasks — is mitigated by training fewer steps, using LoRA
(since the frozen base weights can't be overwritten), and mixing in some general-purpose data alongside
the narrow fine-tuning set. **Evaluating a fine-tune** means re-running module 4's eval harness against
the new model and comparing it directly to the prompted-large-model baseline on quality, cost, and
latency — fine-tuning is only a win if it beats that baseline on the metric you actually care about.
**Serving many fine-tunes** efficiently means **multi-LoRA serving** — one base model in GPU memory,
many small adapters hot-swapped per request, instead of loading a full separate model per customer/task.
Finally, training-data **privacy/security** (excluding or masking PII before it ever enters a training
set, and tracking data **provenance** so you can prove what a model was and wasn't trained on) is a real
compliance requirement, not an afterthought, in regulated industries. The **Hugging Face stack**
(`transformers` for models, `peft` for LoRA/QLoRA, `trl` for RLHF/DPO training loops, `datasets` for data
loading, the Hub for sharing) is the de facto tooling across nearly all of this.

**🔨 Build:** One real QLoRA fine-tune of a small open model (Llama/Mistral 7-8B) on Colab/Lambda for a
narrow task, published as an adapter to the HF Hub, with a head-to-head comparison of tuned-small vs
prompted-large on cost/latency/quality.
**🎤 Drill:** The RAG-vs-fine-tune decision framework, argued with real numbers — run cost, retraining
cadence, forgetting risk.

---

<a id="m6"></a>
## 🚀 6 · Go live — serving, cost & production system design
*Track A · Week 19–20*

**LLM serving** at scale needs purpose-built inference servers (**vLLM**, **SGLang**, **TGI**) because
naive per-request inference wastes the GPU badly. **Continuous batching** dynamically merges multiple
in-flight requests into shared GPU batches as they arrive and finish (rather than waiting to fill a
fixed batch), and **KV-cache reuse** avoids recomputing the attention key/value vectors for tokens
already processed (the same `K`/`V` from module 1's attention formula) — both are *the* reason serving
throughput differs by an order of magnitude between naive and production-grade setups. **Paged
attention** manages that KV-cache memory like an OS manages virtual memory pages, letting many
concurrent requests share GPU memory efficiently instead of each reserving a worst-case contiguous
block.

**Inference optimization** beyond batching: quantization (module 5's 4-bit techniques, applied now to
serving rather than training); **speculative decoding** (a small, fast draft model proposes several
tokens ahead, the large model verifies them in one batched pass — faster when the draft is usually
right); **prompt caching** (reuse the KV-cache for a repeated prefix — e.g. a long system prompt — across
many requests) and **semantic caching** (skip the model call entirely if a sufficiently similar
*query*, by embedding similarity, was already answered recently). **Cost optimization** layers model
routing (send easy queries to a small/cheap model, hard ones to a frontier model), prompt compression,
caching, and batching together. **Scaling** brings standard distributed-systems tools to bear — load
balancing, autoscaling on GPU utilization/queue depth, rate limiting per tenant, and explicit
**backpressure** (a defined overflow path — reject, queue, or degrade gracefully — once capacity is
exceeded, rather than falling over). **Latency** work centers on streaming (return tokens as generated,
so perceived latency is dominated by **time-to-first-token**, not total generation time), SLAs defined
per percentile, and choosing sync vs async request handling under load. **Reliability** is the standard
distributed-systems playbook — retries with backoff, fallback to a secondary model/provider, circuit
breakers, timeouts — applied to a dependency (the LLM provider) that's slower and flakier than a typical
internal service call.

**Guardrails/safety** in production means real-time prompt-injection detection, PII redaction on both
input and output, content filtering, output validation against an expected schema, and jailbreak
defense — layered, since (per module 4) no single layer is sufficient alone. **Security/compliance**
adds access control and **RBAC/ABAC** enforced through the actual pipeline (not just at the UI), audit
logging of every request/response for traceability, and data-residency constraints for regulated data.
**Deployment** is standard Docker/Kubernetes/CI-CD/infrastructure-as-code, just now packaging a service
with a GPU dependency. **Cloud AI** platforms (AWS Bedrock/SageMaker, GCP Vertex, Azure OpenAI) trade
infra control for managed scaling/compliance — know the tradeoff, not just the product names.
**LLMOps** extends standard MLOps/DevOps discipline to also version *prompts* (not just model weights
and code), with the same monitoring/rollback/canary-deploy practices you'd apply to any other production
service. All of this composes into the **AI system-design patterns** you'll be asked to whiteboard:
ingestion → retrieval/agent → serving → eval → guardrails → cost controls, end to end.

**🔨 Build:** Deploy one earlier project as a **live, always-on, monitored** service — Dockerized on
AWS/GCP, with CI/CD, usage+cost tracking, rate limiting, retries, and prompt-injection/PII guardrails —
and keep it running with a public demo link.
**🎤 Drill:** "Design an AI system integrating a third party's data and workflows" — ingestion
(batch/stream/hybrid) → retrieval/agent → serving (batching/caching) → eval → guardrails → cost controls.

---

<a id="m7"></a>
## ☕ 7 · Java + Spring
*Track B · runs throughout*

This track assumes you already know Java reasonably well as a senior engineer — the goal here is
filling specific gaps that interview loops probe hardest, not relearning the language. **Collections
internals** matter beyond "know the API": `HashMap` resolves collisions via buckets of linked
nodes/trees (treeified past a threshold for long collision chains), `ConcurrentHashMap` achieves
thread-safety via fine-grained (historically segment-based, now node-level) locking rather than locking
the whole map, and you should be able to explain *why* `ArrayList` get is O(1) but insert-at-front is
O(n), while `LinkedList`'s tradeoffs invert. **Generics** in Java are erased at compile time (no runtime
type info, unlike, say, C#) — this is *why* you can't do `new T[]` directly and why wildcard bounds
(`? extends`, `? super`) exist as the answer to "can I add to this generic collection safely."

**Concurrency** is the single richest interview area: `ExecutorService` manages a thread pool;
`CompletableFuture` composes async work declaratively (`.thenApply`, `.thenCompose`,
`.allOf`) instead of nested callbacks; `volatile` guarantees visibility (a write is immediately visible
to other threads) without guaranteeing atomicity, while `synchronized` and explicit `Lock`s give you
both visibility and mutual exclusion; the `java.util.concurrent.atomic` classes give lock-free atomic
operations for single variables via CAS (compare-and-swap); the fork-join framework underlies parallel
streams. Be ready to talk through a **race condition** (two threads read-modify-write a shared variable
without synchronization, losing an update) and a **deadlock** (two threads each hold a lock the other
needs) concretely, not just by definition. **Java 21 virtual threads** are cheap, JVM-managed threads
(not OS threads) that let you write simple blocking-style code for massively concurrent I/O-bound
workloads without the old platform-thread cost — directly comparable to (and a useful contrast against)
Python's `asyncio` from module 0b: virtual threads keep the familiar blocking *programming model* while
getting async-like scalability, whereas Python's model makes the asynchrony explicit in the code itself.
**Structured concurrency** (`StructuredTaskScope`) ties a group of forked subtasks to a single scope so
they're cancelled/joined together, rather than leaking independently.

The **JVM** itself: the memory model splits heap (objects, GC-managed) from stack (per-thread frames,
local variables); class loading is lazy and hierarchical (bootstrap → platform → application
classloaders); the **JIT** compiler profiles hot methods at runtime and compiles them to native code,
which is why JVM code can eventually outperform naively-compiled native code for long-running processes.
**GC** algorithms (G1 for balanced general-purpose use, ZGC for near-pauseless low-latency workloads)
trade throughput against pause time, and you should be able to talk through tuning one for a target SLA.
**Memory leaks** in a garbage-collected language happen when something keeps an unintended *reference*
alive (a growing cache with no eviction, a listener never unregistered) — profiling with heap dumps and
tools like async-profiler/VisualVM is how you'd actually find one. Round out with modern Java: **streams
and functional style** (`map`/`filter`/`reduce`/`Collectors`), `Optional` (an explicit "might be absent"
type, replacing null-checking convention), and the recent **records, sealed classes, pattern matching,
and switch expressions** (which together give Java a lightweight, exhaustive way to model "this is one
of a closed set of variants" — the same need Python's classes/`Protocol` solve more loosely). On the
framework side: **Spring's** IoC/dependency-injection container and bean lifecycle, **AOP** (e.g. how
`@Transactional` is implemented as a proxy wrapping your method), Boot's auto-configuration, MVC routing,
Spring Data/JPA, and Spring Security — plus general **REST API design** and testing with **JUnit** and
**Mockito**.

**🔨 Build/refresh:** Use virtual threads in a concurrent client for your LLM gateway.
**🎤 Drill:** Explain virtual threads vs platform threads; walk through a GC pause you'd debug.

---

<a id="m8"></a>
## 🗄️ 8 · Databases
*Track B · runs throughout*

Beyond writing **SQL** (joins, aggregations, subqueries, CTEs, window functions), the interview-relevant
skill is reasoning about *how* a query actually executes. **Indexing** (B-tree for range/equality
lookups, composite indexes for multi-column filters where column order matters, covering indexes that
satisfy a query without touching the table, partial indexes over a filtered subset) is what makes a
lookup O(log n) instead of a full scan — and `EXPLAIN`/query plans are how you confirm the database is
actually using the index you think it is, rather than guessing. The classic **N+1 problem** (one query
to fetch a list, then one more query *per row* to fetch each row's related data, instead of a single
join or batched fetch) is the most common ORM-induced performance bug, and being able to spot it in an
ORM trace is a real interview signal.

**Transactions** guarantee **ACID** — atomicity (all-or-nothing), consistency (never leaves invariants
broken), isolation (concurrent transactions don't see each other's half-finished work), durability
(committed means committed, survives a crash). **Isolation levels** (read uncommitted, read committed,
repeatable read, serializable) trade consistency guarantees against concurrency throughput, and **MVCC**
(multi-version concurrency control — readers see a consistent snapshot via row versions instead of
blocking on writers) is how Postgres/MySQL achieve strong isolation without read locks for most
workloads. **Locking and deadlocks** become concrete the moment two transactions acquire row locks in
opposite order — know how a database detects and resolves this (aborting one transaction) versus how
your application should retry it.

**Schema design** trades **normalization** (eliminate redundancy, one source of truth per fact, but more
joins) against **denormalization** (duplicate data for read speed, at the cost of update complexity) —
the right answer depends on your read/write ratio. As data grows: **partitioning** splits one table's
rows across multiple physical segments (often by date range) within a single database instance, while
**sharding** splits data across multiple *database instances* entirely, usually keyed by something like
user ID — sharding solves a different scaling problem (write throughput, total data size) than
partitioning does (manageability, partition pruning) and the two are frequently confused in interviews.
**Replication** (a leader handling writes, followers replicating for read scaling and failover, either
synchronously for consistency or asynchronously for throughput) is the standard high-availability
pattern. **NoSQL** isn't one thing — document stores (MongoDB), key-value stores (Redis, DynamoDB),
wide-column stores (Cassandra), and graph databases (Neo4j) each fit different access patterns, and the
real skill is matching the data model to the database family rather than reciting "NoSQL is more
scalable." The **CAP theorem** (under a network partition, choose consistency or availability, not
both) and **eventual consistency** describe the tradeoff distributed/NoSQL stores actually make. Close
with **caching** (Redis; cache-aside vs write-through; TTL-based and explicit invalidation; the
**cache-stampede** problem when a popular key expires and many concurrent requests all miss at once and
hammer the database simultaneously) and **connection pooling** (database connections are expensive to
open, so a pool of pre-established connections is shared across requests rather than opening one per
request).

**🔨 Build/refresh:** Tune `pgvector` and metadata queries with `EXPLAIN`; add a Redis cache in front of
RAG retrieval.
**🎤 Drill:** Read an `EXPLAIN` plan cold; pick the right isolation level for a given consistency need.

---

<a id="m9"></a>
## 📨 9 · Kafka & event-driven
*Track B · runs throughout*

Kafka's core model: a **topic** is split into **partitions** for parallelism, each partition is an
append-only, strictly-ordered log identified by **offset**, and each partition is **replicated** across
brokers with one broker as leader and the others as in-sync replicas (**ISR**) — **leader election**
promotes a replica if the leader fails. Ordering is only guaranteed *within* a single partition, never
across partitions of the same topic — a frequent interview trap.

**Producers** control delivery guarantees via `acks` (0 = fire-and-forget, 1 = leader-acked, `all` =
acked by every in-sync replica — the durability/latency tradeoff in one setting), **idempotent**
producers (deduplicate retried sends so a network retry can't double-publish), and **batching**; the
**partition key** you choose determines which partition a message lands on, which is *the* lever for
preserving per-entity ordering (e.g. partition by user ID so all of one user's events stay ordered).
**Consumers** read in **consumer groups** — each partition is owned by exactly one consumer within a
group at a time, so a group's parallelism is capped by partition count — and **rebalancing** redistributes
partitions when a consumer joins/leaves the group; **consumer lag** (how far behind the latest offset a
consumer group is) is the primary health metric to alert on.

**Delivery semantics** — at-most-once (may lose messages, never duplicates), at-least-once (may
duplicate, never loses — the common default, requiring downstream idempotency), and exactly-once
(neither lost nor duplicated, achieved via Kafka's idempotent producers plus transactional writes,
**EOS**) — are a direct tradeoff knob, not a quality level to maximize blindly; at-least-once plus an
idempotent consumer is often simpler and just as effective as full exactly-once. A **schema registry**
enforces and versions message schemas (often Avro/Protobuf) so producers and consumers can evolve
independently without breaking each other. **Kafka Streams** does stream processing directly against
topics (joins, aggregations, windowing); **Kafka Connect** provides pre-built source/sink connectors
(database → Kafka, Kafka → data warehouse) without hand-rolled producer/consumer code. Operational
resilience: a **DLQ** (dead-letter queue) catches messages a consumer repeatedly fails to process instead
of blocking the partition forever; **retries with backoff** and **backpressure** (slowing producers, or
buffering, when consumers can't keep up) round out failure handling. The **outbox pattern** solves the
classic "update my database *and* publish an event, atomically" problem by writing the event to an
outbox table in the *same* database transaction as the business write, then a separate process
publishes from that table to Kafka — avoiding the dual-write consistency gap you'd hit publishing
directly inside the transaction.

Know **Kafka vs RabbitMQ vs SQS** as a real comparison, not trivia: Kafka is a durable, replayable log
built for high-throughput streaming and multiple independent consumers replaying history; RabbitMQ is a
traditional message broker optimized for complex routing and lower-latency point-to-point/work-queue
delivery; SQS is a managed, simple, at-least-once queue with no ordering/replay guarantees by default,
trading control for zero operational overhead. Close with the **event-driven architecture patterns**
Kafka typically enables: **event sourcing** (the log of events *is* the source of truth, current state
is derived/replayed from it), **CQRS** (separate models/paths for writes and reads, often with the read
side built from the event stream), and the **saga** pattern (coordinate a multi-step distributed
transaction as a sequence of local transactions plus compensating actions on failure, since you can't
just wrap multiple services in one ACID transaction).

**🔨 Build/refresh:** Re-architect an earlier project's ingestion as a Kafka pipeline — producer →
consumer chunks/embeds/indexes.
**🎤 Drill:** Achieve exactly-once *and* ordering in one pipeline, and explain the tradeoffs you accepted
to get there.

---

<a id="m10"></a>
## 🏗️ 10 · System design
*Track B · runs throughout*

System design interviews score you on a *process*, not a memorized diagram: **clarify** the actual
requirements and scale (don't assume — ask), **estimate** with back-of-envelope numbers (requests/sec,
storage growth, read:write ratio — rough order-of-magnitude is the point, not precision), sketch the
**high-level** architecture, **deep-dive** into the one or two components that are actually
interesting/hard for this specific problem, then discuss **bottlenecks and tradeoffs** explicitly rather
than presenting one "correct" design. The fundamentals underpinning every answer: **scalability**
(handling growth — usually via horizontal scaling, i.e. more machines, rather than vertical, i.e. bigger
machines), **availability** vs **reliability** (uptime percentage vs correctness of behavior while up —
related but distinct), and **latency vs throughput** (time per request vs requests handled per unit
time — optimizing one can cost the other, e.g. large batches raise throughput but raise per-request
latency).

Component building blocks you should be able to place correctly in any design: **load balancing** (L4,
routing on IP/port, vs L7, routing on HTTP content — and algorithms like round-robin, least-connections,
consistent hashing); **caching** layered at multiple levels (CDN at the edge, application-level cache,
database cache) with explicit **eviction policies** (LRU being the default mental model); **database**
choice and scaling (SQL vs NoSQL, sharding, replication, indexing — straight from module 8, now applied
at the architecture level); **messaging/queues** for decoupling producers from consumers (straight from
module 9); **consistency** models (**CAP**, the more nuanced **PACELC** — what you trade off even
*without* a partition, between latency and consistency — and **quorum**-based reads/writes as a tunable
middle ground between the two extremes). **API design** covers REST vs gRPC (binary, contract-first,
lower latency, common for internal service-to-service calls) vs GraphQL (client specifies exactly the
shape of data it wants, useful when clients have very different data needs), plus idempotency keys (so a
retried request doesn't double-execute a side effect) and pagination strategies. **Rate limiting**
(token bucket, sliding window, etc.) protects a system from being overwhelmed by one client.
**Microservices** patterns — an API gateway as the single entry point, service discovery so callers find
healthy instances, the circuit-breaker pattern (stop calling a failing dependency for a cooldown period
instead of piling up failed/slow calls), the saga pattern (from module 9) for distributed transactions,
and bulkheading (isolate resource pools per dependency so one slow dependency can't exhaust resources
needed by others) — solve the coordination problems that appear once a system isn't a single monolith.
Round out with data-intensive patterns (batch vs stream processing), observability (metrics/logs/traces
— straight from module 4's instrumentation, now at whole-system scope), and security (authn/authz at the
gateway, encryption in transit/at rest, least-privilege between services).

The differentiated edge this curriculum gives you over a typical Track-B-only candidate: **AI system
design** — a RAG platform, a multi-tenant LLM gateway, or agent orchestration with cost controls — is
now just *another* system-design prompt, except you've actually built one (modules 2, 3, 6), so you can
answer with real numbers and real failure modes instead of textbook patterns alone. Drill the canon out
loud, repeatedly, until the clarify→estimate→high-level→deep-dive→tradeoffs *method* is automatic: URL
shortener, news feed, chat system, rate limiter, distributed cache, payment/ledger system, notification
service.

**🎤 Drill:** Run the method end-to-end on a random canon system, then **fuse both tracks** — explicitly
bring in a caching, sharding, or queueing detail from modules 8/9 even when the prompt is AI-flavored;
that fusion is the actual differentiator.

---

<a id="m11"></a>
## 🧩 11 · DSA (background drip, in Python)
*Track B · daily in the final 2-3 weeks*

This module is a pattern library, not a problem-by-problem grind — the leverage is recognizing *which
pattern* a new problem maps to, not memorizing solutions. **Arrays/strings**, **hashing** (O(1)
average lookup — the workhorse for "have I seen this before" problems), **two pointers** (converging
or same-direction pointers over a sorted/structured sequence — pair-sum, deduplication), and **sliding
window** (a contiguous, dynamically resized window — substring/subarray problems with a running
constraint) cover a large fraction of "easy/medium" problems once recognized. **Stacks and queues**
underlie parenthesis-matching, monotonic-stack problems, and BFS; **linked lists** test pointer
manipulation precision (reversal, cycle detection via Floyd's algorithm) more than algorithmic insight.

**Trees and BSTs** (traversals — in/pre/post-order — height, balance, lookup/insert/delete) and
**heaps/priority queues** (efficient access to the min/max element, the backbone of any
"k-th largest/smallest" or merge-multiple-sorted-sources problem) come up constantly; **tries** are the
right structure specifically for prefix-based string lookups (autocomplete, word search). **Graphs** are
the single highest-leverage topic: **BFS** (shortest path in an unweighted graph, level-by-level),
**DFS** (exploring as deep as possible before backtracking — connectivity, cycle detection, topological
ordering), **Dijkstra** (shortest path with non-negative weights, via a priority queue), **union-find**
(efficiently track and merge connected components — cycle detection in undirected graphs, Kruskal's
MST), and **topological sort** (a valid linear ordering of a DAG's nodes respecting all dependency
edges — directly relevant to build-dependency or task-scheduling problems). **Recursion and
backtracking** (try a choice, recurse, undo it if it doesn't pan out — permutations, combinations,
N-Queens-style constraint search) and **binary search** (not just "search a sorted array" — recognize
it whenever you're searching a monotonic *answer space*, e.g. "smallest k such that...") are patterns
that generalize far past their textbook examples.

**Sorting** (know the complexity/stability tradeoffs of the common algorithms, even if you'd never
hand-implement quicksort in an interview) and **greedy** algorithms (commit to the locally-best choice at
each step and prove — or just recognize — that it leads to a globally optimal result, as in interval
scheduling) precede **dynamic programming**, the topic most candidates find hardest: identify
overlapping subproblems and optimal substructure, then build up a solution (1-D DP like climbing-stairs/
house-robber; 2-D DP like edit-distance/longest-common-subsequence; classic named problems like 0/1
knapsack and **LIS**, longest increasing subsequence). **Intervals** (merge overlapping ranges, meeting
rooms) and **bit manipulation** (XOR tricks, bitmasks for representing subsets compactly) are smaller but
recurring categories. Underneath all of it, **Big-O time/space analysis** is the actual skill being
tested even when the problem itself is easy — articulating *why* your solution is O(n log n) and whether
a better bound exists matters as much as getting the right output.

**🔨 Build:** Solve in Python — it doubles as language fluency from module 0a. ~3-5/week, ramping to
daily in the final 2-3 weeks; go heavy only if the specific target company's loop actually tests DSA hard.
**🎤 Drill:** Pick one pattern above at random, solve it, and explain your approach out loud *before*
writing code.

---

<a id="m12"></a>
## 🎤 12 · Behavioral round
*Track B · prep now, ramp in the final 3 weeks*

The behavioral round evaluates whether you can talk about your own work with the same rigor you'd apply
to a technical answer — vague, unquantified stories read as weaker signal than a precise technical
answer would, even though the bar feels "softer." The **STAR method** (Situation, Task, Action,
Result) is the structuring tool: set up the context in one sentence, state what you specifically needed
to do, describe the actions *you* took (not "we"), and close with a concrete, ideally **quantified
result** ("p95 latency 4s → 900ms," "cut monthly inference cost by 30%") — a number anchors the story
and is what separates a forgettable answer from a memorable one.

Have a small set of stories ready, each mapped to a different angle interviewers probe: an
**ownership/shipping story** (you drove something end-to-end, including the unglamorous parts); a
**confident-then-wrong story** (you were sure of an approach, it failed, and — critically — the value is
in narrating the *debugging path* that found the real cause, not just admitting the mistake); a
**production incident** you diagnosed using traces/logs/metrics (this is where module 4's observability
work becomes a behavioral asset, not just a technical one — "here's the trace that showed me the actual
bottleneck"); a **cost-vs-latency-vs-quality tradeoff** you made deliberately, with the reasoning behind
choosing what you chose; your approach to **GenAI safety/reliability** (guardrails, eval gates — pulling
directly from modules 4 and 6); a **conflict you resolved** with a teammate or across teams; and a story
about **learning a new domain quickly** — which, for this specific career transition, is the story of
this curriculum itself.

The structural advantage of having actually built the Track-A projects: every behavioral answer can open
with **"When I built X, I hit exactly this — here's what I did and the number it moved,"** which is a
fundamentally stronger opening than a hypothetical or a vague generality, because it's backed by an
artifact you can describe in real technical detail if pushed. Be ready specifically for: the end-to-end
story of the live LLM system you shipped (module 6's deployed project); walking through a real incident
you debugged; a hard tradeoff you made and why; a disagreement you resolved; and the **"why the switch
to AI"** story — which, coming from a senior Java background, is itself a legitimate and compelling
narrative (the engineering discipline transfers, the domain is what you're now building).

**🔨 Prep:** No artifact to build — rehearse the stories *behind* the artifacts you already shipped
(RAG service, agent+eval harness, QLoRA run, live deployment), out loud, using STAR.
**🎤 Drill:** Tell your "why the switch to AI" story and one production incident, each in under 90
seconds, each with a quantified result.

---

*Back to [table of contents](#table-of-contents).*
