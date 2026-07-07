# 60-Day Python, AI/ML, GenAI, and Production Engineering Syllabus

Audience: experienced Java developer moving into Python, AI/ML, GenAI, and production-ready model/application delivery.

Time expectation: about 20 hours per week.

Goal: move from Python fundamentals to deployable AI/ML systems, with enough theory to reason about models and enough engineering practice to ship reliable software.

---

## Learning Outcomes

By the end of this plan, you should be able to:

- Write idiomatic Python instead of Java-style Python.
- Use NumPy, Pandas, Matplotlib, and Seaborn for data work.
- Train, evaluate, tune, and explain classical ML models.
- Build neural networks and understand training loops in PyTorch.
- Understand embeddings, transformers, LLMs, prompting, and RAG.
- Build a production-style GenAI service with API boundaries, observability, tests, and deployment concerns.
- Train in Python and deploy through a service-oriented Java or Python backend.
- Explain common ML trade-offs in interviews and architecture discussions.

---

## Daily Routine

- Theory: 45-60 minutes.
- Hands-on coding: 90-120 minutes.
- Notes: 10-15 minutes summarizing what you learned, what failed, and what to revisit.
- Weekend deep work: 3-4 hours for projects, refactoring, testing, and documentation.

Golden rule: for every tutorial or article, write or modify code. Passive watching does not count.

---

# Phase 1: Python Foundations for Java Developers (Days 1-7)

Goal: learn Python syntax, runtime behavior, packaging basics, and idiomatic style.

## Day 1: Environment and Language Basics

Topics:

- Install Python.
- Use `venv`.
- Use `pip`.
- Understand scripts vs modules.
- Learn indentation, dynamic typing, truthiness, exceptions, and basic data structures.

Practice:

- Create a small CLI script that reads a file and prints word counts.
- Create and activate a virtual environment.
- Install one dependency and freeze dependencies.

Production-ready dev stuff:

- Keep dependencies isolated per project.
- Never rely on global Python packages.
- Use `.gitignore` for virtual environments, cache files, and local data.

## Day 2: Pythonic Syntax

Topics:

- List, dict, and set comprehensions.
- Tuple unpacking.
- Slicing.
- Iteration protocols.
- `enumerate`, `zip`, `any`, `all`, `sorted`, `map`, and `filter`.

Practice:

- Rewrite Java-style loops into idiomatic Python.
- Parse a CSV-like text file without Pandas.

## Day 3: Functions, Modules, and Errors

Topics:

- Function arguments.
- Default parameters.
- `*args` and `**kwargs`.
- Imports.
- Custom exceptions.
- Context managers with `with`.

Practice:

- Build reusable utility functions for file parsing.
- Add error handling for missing files and invalid input.

## Day 4: Object-Oriented Python

Topics:

- Classes.
- Dataclasses.
- Properties.
- Class methods and static methods.
- Composition over inheritance.

Practice:

- Model a simple dataset record with `dataclass`.
- Add validation logic.

## Day 5: Type Hints and Tooling

Topics:

- Type hints.
- `Optional`, `Union`, `Literal`, `TypedDict`, and generics.
- `mypy` or `pyright`.
- Formatting with `black` or `ruff format`.
- Linting with `ruff`.

Practice:

- Add type hints to previous scripts.
- Run a formatter and linter.

Production-ready dev stuff:

- Use type hints for public functions and service boundaries.
- Use formatting and linting from day one.
- Keep code style automated.

## Day 6: Testing Basics

Topics:

- `pytest`.
- Unit tests.
- Fixtures.
- Parametrized tests.
- Temporary files in tests.

Practice:

- Add tests for the CLI/file parser.
- Test both success and failure cases.

Production-ready dev stuff:

- Tests should cover behavior, not implementation details.
- Keep small pure functions easy to test.

## Day 7: Mini Project

Build:

- A tested Python CLI that reads a CSV file, validates rows, computes summary statistics, and writes a clean output file.

Deliverables:

- `README.md`.
- `requirements.txt` or equivalent dependency file.
- Source code.
- Tests.

## Most Asked / Most Confused Q&A

Q: Should I use `venv`, `conda`, or Docker?
A: Use `venv` for normal Python app development, `conda` when scientific packages or GPU dependencies are easier that way, and Docker when you need reproducible deployment.

Q: Is Python pass-by-value or pass-by-reference?
A: Python passes object references by assignment. Mutable objects can be changed inside a function; rebinding a parameter does not change the caller's variable.

Q: Should Java developers use classes everywhere in Python?
A: No. Prefer functions and small modules until state or behavior grouping clearly needs a class.

Q: Are type hints enforced at runtime?
A: No. Type hints help tools and humans. Runtime validation requires explicit checks or libraries.

Q: What should I test first?
A: Test parsing, validation, data transformations, and business logic. Avoid over-testing print statements and trivial wrappers.

---

# Phase 2: NumPy, Pandas, and Data Analysis (Days 8-14)

Goal: learn the data manipulation foundation used across ML work.

## Day 8: NumPy Arrays

Topics:

- Arrays vs lists.
- Shape.
- Dtype.
- Indexing and slicing.
- Vectorized operations.

Practice:

- Implement simple statistics using NumPy.
- Compare loop-based vs vectorized operations.

## Day 9: Broadcasting and Matrix Operations

Topics:

- Broadcasting rules.
- Matrix multiplication.
- Reshaping.
- Axis-based operations.

Practice:

- Normalize features.
- Compute distances between vectors.

## Day 10: Pandas Basics

Topics:

- `Series` and `DataFrame`.
- Reading CSV.
- Selecting rows and columns.
- Filtering.
- Sorting.
- Basic aggregation.

Practice:

- Load a public dataset.
- Produce a cleaned dataset.

## Day 11: Pandas Data Cleaning

Topics:

- Missing values.
- Duplicates.
- Type conversion.
- String operations.
- Date parsing.

Practice:

- Create a cleaning pipeline.
- Document assumptions.

## Day 12: Grouping, Joining, and Reshaping

Topics:

- `groupby`.
- `merge`.
- `concat`.
- Pivot tables.
- Wide vs long format.

Practice:

- Join two datasets.
- Produce grouped business metrics.

## Day 13: Visualization and EDA

Topics:

- Matplotlib.
- Seaborn.
- Histograms.
- Box plots.
- Scatter plots.
- Correlation heatmaps.

Practice:

- Create an EDA notebook or script.
- Write 5 observations from the data.

## Day 14: Data Analysis Mini Project

Build:

- A reproducible EDA project that loads raw data, cleans it, creates plots, and summarizes insights.

Production-ready dev stuff:

- Separate raw data, processed data, notebooks, and source code.
- Keep data cleaning steps reproducible.
- Do not manually edit raw datasets.

## Most Asked / Most Confused Q&A

Q: Why is NumPy faster than Python loops?
A: NumPy performs operations in optimized native code over contiguous arrays, avoiding much of Python's per-item overhead.

Q: What is broadcasting?
A: Broadcasting lets NumPy operate on arrays with different shapes when their dimensions are compatible.

Q: When should I use Pandas instead of SQL?
A: Use SQL for database-side filtering and joins when data lives in a database. Use Pandas for local analysis, experimentation, feature engineering, and quick iteration.

Q: What is the difference between `loc` and `iloc`?
A: `loc` selects by labels. `iloc` selects by integer positions.

Q: Is correlation the same as causation?
A: No. Correlation shows association, not proof that one variable causes another.

---

# Phase 3: Math for ML Without Getting Lost (Days 15-18)

Goal: learn enough math to understand model behavior, debugging, and interviews.

## Day 15: Linear Algebra

Topics:

- Vectors.
- Matrices.
- Dot product.
- Matrix multiplication.
- Norms.
- Eigenvectors at intuition level.

Practice:

- Compute cosine similarity.
- Implement simple linear regression prediction with NumPy.

## Day 16: Calculus and Optimization

Topics:

- Derivatives.
- Chain rule.
- Gradients.
- Gradient descent.
- Learning rate.

Practice:

- Minimize a simple function using gradient descent.

## Day 17: Probability and Statistics

Topics:

- Mean, variance, standard deviation.
- Distributions.
- Conditional probability.
- Bayes theorem.
- Sampling.

Practice:

- Simulate coin flips and biased events.
- Compute conditional probabilities from a dataset.

## Day 18: ML Problem Framing

Topics:

- Features.
- Labels.
- Training, validation, and test sets.
- Overfitting and underfitting.
- Data leakage.

Practice:

- Take 3 business problems and classify them as regression, classification, clustering, ranking, or recommendation.

## Most Asked / Most Confused Q&A

Q: How much math do I need before starting ML?
A: Enough to understand vectors, gradients, probability, and metrics. Learn deeper math while building models.

Q: What is a gradient?
A: A gradient tells you the direction and size of change needed to increase a function. In training, we usually move against the gradient to reduce loss.

Q: What is data leakage?
A: Data leakage happens when training data contains information that would not be available at prediction time.

Q: Why split data into train, validation, and test?
A: Train fits the model, validation helps choose settings, and test estimates final performance on unseen data.

Q: Why can a model do well in training but fail in production?
A: Common reasons are overfitting, data leakage, changing data distributions, bad labels, missing monitoring, or a mismatch between training and serving features.

---

# Phase 4: Classical Machine Learning (Days 19-28)

Goal: build reliable models with Scikit-Learn and understand evaluation.

## Day 19: Scikit-Learn Workflow

Topics:

- Estimators.
- Transformers.
- Pipelines.
- `fit`, `transform`, and `predict`.
- `train_test_split`.

Practice:

- Build a baseline classification model.

## Day 20: Regression

Topics:

- Linear regression.
- Ridge and Lasso.
- MAE, MSE, RMSE, and R2.

Practice:

- Predict a numeric target.
- Compare baseline vs regression model.

## Day 21: Classification

Topics:

- Logistic regression.
- Decision trees.
- Random forests.
- Gradient boosting.
- Confusion matrix.

Practice:

- Build a binary classifier.
- Report precision, recall, F1, and ROC-AUC.

## Day 22: Feature Engineering

Topics:

- Numerical features.
- Categorical encoding.
- Scaling.
- Missing value imputation.
- Text basics.

Practice:

- Build a Scikit-Learn `Pipeline` with preprocessing and model training.

Production-ready dev stuff:

- Put preprocessing inside the pipeline so training and inference use the same transformations.
- Version trained models and feature definitions together.

## Day 23: Model Evaluation

Topics:

- Cross-validation.
- Class imbalance.
- Precision-recall trade-off.
- Threshold tuning.
- Calibration.

Practice:

- Tune a decision threshold based on business cost.

## Day 24: Hyperparameter Tuning

Topics:

- Grid search.
- Random search.
- Overfitting during tuning.

Practice:

- Use cross-validation to tune a model.

## Day 25: Unsupervised Learning

Topics:

- K-Means.
- PCA.
- Clustering evaluation.
- Dimensionality reduction.

Practice:

- Segment customers or records using clustering.

## Day 26-28: Classical ML Project

Build:

- End-to-end ML project with data loading, EDA, preprocessing, model training, evaluation, and saved model artifact.

Deliverables:

- Clean project structure.
- Reproducible training command.
- Metrics report.
- Model card explaining intended use, limitations, and risks.

## Most Asked / Most Confused Q&A

Q: Why is accuracy often misleading?
A: Accuracy can hide poor performance on minority classes. For imbalanced problems, precision, recall, F1, ROC-AUC, and PR-AUC are usually more useful.

Q: What is the difference between precision and recall?
A: Precision asks: of predicted positives, how many were correct? Recall asks: of actual positives, how many did we catch?

Q: What is overfitting?
A: The model memorizes training patterns that do not generalize to new data.

Q: Why use pipelines?
A: Pipelines keep preprocessing and modeling together, which reduces training-serving mismatch and leakage.

Q: Are tree models always better than linear models?
A: No. Tree models often capture nonlinear patterns well, but linear models are faster, simpler, more interpretable, and strong baselines.

Q: What should be the first model?
A: Start with a simple baseline. A weak baseline reveals whether complexity is actually helping.

---

# Phase 5: Deep Learning with PyTorch (Days 29-38)

Goal: understand neural network fundamentals and build models without hiding the training loop.

## Day 29: PyTorch Tensors

Topics:

- Tensors.
- Shapes.
- Dtypes.
- CPU vs GPU.
- Tensor operations.

Practice:

- Convert NumPy arrays to tensors.
- Perform batch operations.

## Day 30: Autograd

Topics:

- Computational graph.
- Gradients.
- `requires_grad`.
- Backpropagation.

Practice:

- Compute gradients for a simple function.

## Day 31: Neural Network Basics

Topics:

- Layers.
- Activations.
- Loss functions.
- Optimizers.

Practice:

- Build a small MLP classifier.

## Day 32: Training Loop

Topics:

- Forward pass.
- Loss computation.
- Backward pass.
- Optimizer step.
- Epochs and batches.

Practice:

- Write a custom training loop.

Production-ready dev stuff:

- Log loss and metrics.
- Save checkpoints.
- Fix random seeds when reproducibility matters.
- Keep train and evaluation modes clear.

## Day 33: Regularization

Topics:

- Dropout.
- Weight decay.
- Early stopping.
- Batch normalization.

Practice:

- Compare model performance with and without regularization.

## Day 34: CNNs

Topics:

- Convolutions.
- Filters.
- Pooling.
- Image tensors.

Practice:

- Train a small image classifier.

## Day 35: Sequence Models

Topics:

- RNN intuition.
- LSTM and GRU.
- Sequence classification.
- Limitations of older sequence models.

Practice:

- Build a small text or time-series classifier.

## Day 36-38: Deep Learning Project

Build:

- A PyTorch project with dataset loading, training, evaluation, checkpointing, and inference script.

Deliverables:

- Training script.
- Evaluation script.
- Saved model checkpoint.
- Metrics and error analysis.

## Most Asked / Most Confused Q&A

Q: What is backpropagation?
A: Backpropagation computes how much each parameter contributed to the loss so the optimizer can update weights.

Q: What is the difference between loss and metric?
A: Loss is optimized during training. Metrics measure business or model quality and may not be directly optimized.

Q: What does learning rate do?
A: It controls how large each optimization step is. Too high can diverge; too low can train slowly or get stuck.

Q: Why does my loss become NaN?
A: Common causes are too-high learning rate, bad input scaling, exploding gradients, invalid labels, or numerical instability.

Q: Do I need a GPU?
A: Not for learning basics or small models. A GPU becomes important for larger datasets, larger neural networks, and LLM workloads.

---

# Phase 6: Transformers, LLMs, and GenAI Foundations (Days 39-45)

Goal: understand modern AI application building blocks.

## Day 39: Transformer Architecture

Topics:

- Tokens.
- Embeddings.
- Positional encoding.
- Self-attention.
- Multi-head attention.
- Feed-forward layers.

Practice:

- Read a visual transformer explanation.
- Draw the data flow from text input to model output.

## Day 40: LLM Basics

Topics:

- Pretraining.
- Fine-tuning.
- Instruction tuning.
- Context window.
- Temperature.
- Top-p.
- Stop sequences.

Practice:

- Run a few prompts and compare deterministic vs creative settings.

## Day 41: Prompting

Topics:

- Role and task clarity.
- Examples.
- Constraints.
- Structured output.
- Tool/function calling concepts.

Practice:

- Design prompts for summarization, extraction, classification, and planning.

Production-ready dev stuff:

- Treat prompts as versioned application artifacts.
- Add tests for expected output shape.
- Log model inputs and outputs carefully while protecting sensitive data.

## Day 42: Embeddings and Vector Search

Topics:

- Embeddings.
- Similarity search.
- Cosine similarity.
- Chunking.
- Metadata filtering.
- Vector databases.

Practice:

- Embed a small document collection and retrieve relevant chunks.

## Day 43: RAG

Topics:

- Retrieval-augmented generation.
- Chunk retrieval.
- Reranking.
- Grounding.
- Citations.
- Hallucination reduction.

Practice:

- Build a simple RAG script over local Markdown files.

## Day 44: GenAI Evaluation

Topics:

- Retrieval quality.
- Answer faithfulness.
- Groundedness.
- Latency.
- Cost.
- Safety.

Practice:

- Create a small evaluation set of questions and expected source documents.

## Day 45: GenAI Mini Project

Build:

- A local knowledge-base assistant over study notes.

Deliverables:

- Document ingestion.
- Chunking.
- Embedding.
- Retrieval.
- Answer generation.
- Evaluation questions.

## Most Asked / Most Confused Q&A

Q: What is an embedding?
A: An embedding is a vector representation of text, image, or other data where similar meanings tend to be close together.

Q: Is RAG the same as fine-tuning?
A: No. RAG retrieves external context at query time. Fine-tuning changes model weights. RAG is usually better for private or frequently changing knowledge.

Q: Why do LLMs hallucinate?
A: LLMs predict likely text. Without enough grounding, constraints, or retrieval, they may generate plausible but false answers.

Q: What is chunking?
A: Chunking splits documents into smaller pieces so retrieval can find focused context that fits into the model prompt.

Q: What matters more: prompt or retrieval?
A: For knowledge-grounded systems, retrieval quality often matters more. A good prompt cannot fix missing or irrelevant context.

Q: Should I fine-tune first?
A: Usually no. Start with prompting, RAG, and evaluation. Fine-tune only when you have repeated task-specific behavior that prompting and retrieval cannot solve.

---

# Phase 7: Production-Ready AI/ML Engineering (Days 46-55)

Goal: learn the practices needed to move from notebooks to reliable services.

## Day 46: Project Structure and Config

Topics:

- Source layout.
- Config files.
- Environment variables.
- Secrets management.
- Dependency locking.

Practice:

- Refactor a project into `src`, `tests`, `data`, `models`, and `configs`.

Production-ready dev stuff:

- Never commit secrets.
- Keep config separate from code.
- Make local, test, and production settings explicit.

## Day 47: APIs for ML and GenAI

Topics:

- REST APIs.
- Request and response schemas.
- Input validation.
- Error handling.
- Timeouts.

Practice:

- Serve a model through FastAPI or a Java/Spring Boot endpoint.

Production-ready dev stuff:

- Validate every request.
- Return stable error formats.
- Add timeouts and retries for external calls.

## Day 48: Model Serialization and Inference

Topics:

- Pickle risks.
- Joblib.
- ONNX.
- TorchScript.
- Model loading.
- Batch vs online inference.

Practice:

- Save and load a trained model.
- Create an inference script.

## Day 49: Containers

Topics:

- Dockerfile.
- Image size.
- Dependency installation.
- Runtime commands.
- Environment variables.

Practice:

- Dockerize a model API.

## Day 50: Observability

Topics:

- Logs.
- Metrics.
- Traces.
- Request IDs.
- Model latency.
- Error rates.

Practice:

- Add structured logging and basic metrics to an API.

Production-ready dev stuff:

- Log enough to debug production issues.
- Do not log sensitive user data.
- Track model latency separately from total request latency.

## Day 51: Data and Model Versioning

Topics:

- Dataset versioning.
- Model registry.
- Experiment tracking.
- MLflow.
- Reproducible runs.

Practice:

- Track parameters, metrics, and artifacts for training runs.

## Day 52: CI/CD and Quality Gates

Topics:

- Unit tests.
- Integration tests.
- Smoke tests.
- Linting.
- Type checking.
- Build pipelines.

Practice:

- Add a CI workflow that runs tests and lint checks.

## Day 53: Security and Governance

Topics:

- Secrets.
- PII.
- Prompt injection.
- Data access control.
- Audit logs.
- Dependency vulnerabilities.

Practice:

- Threat-model a RAG app.
- Add input validation and output filtering where appropriate.

## Day 54: Deployment Patterns

Topics:

- Batch inference.
- Online inference.
- Async jobs.
- Queues.
- Canary releases.
- Rollbacks.

Practice:

- Design deployment architecture for one ML model and one RAG app.

## Day 55: Production Readiness Review

Create a checklist for:

- Reproducible training.
- Tested preprocessing.
- Saved model artifact.
- API contract.
- Validation.
- Monitoring.
- Rollback.
- Cost tracking.
- Security.
- Documentation.

## Most Asked / Most Confused Q&A

Q: Why do notebooks fail in production?
A: Notebooks often hide state, manual steps, weak testing, and unclear dependencies. Production needs repeatable scripts, tests, configs, and observability.

Q: Should inference be batch or real time?
A: Use batch when latency is not critical and data arrives in bulk. Use real time when users or systems need immediate predictions.

Q: Why is Pickle risky?
A: Loading untrusted Pickle files can execute code. Use safer formats when possible and treat model artifacts as trusted build outputs.

Q: What is training-serving skew?
A: It happens when preprocessing or features differ between training and production inference.

Q: What should I monitor after deployment?
A: Monitor latency, errors, input distribution, output distribution, data drift, model quality signals, cost, and user feedback.

Q: What is prompt injection?
A: Prompt injection is when user or retrieved text tries to override system instructions or manipulate the model's behavior.

---

# Phase 8: Capstone and Interview Launch (Days 56-60)

Goal: prove skill through one polished project and interview-ready explanations.

## Day 56: Capstone Architecture

Choose one:

- Classical ML production service.
- PyTorch inference service.
- Enterprise RAG assistant.
- Hybrid Python training plus Java inference system.

Recommended capstone for a Java developer:

- Train a model in Python.
- Track experiments with MLflow.
- Export the model artifact.
- Serve inference through Java/Spring Boot or FastAPI.
- Dockerize the service.
- Add tests, logs, and documentation.

## Day 57: Implementation

Build:

- Training pipeline.
- Inference API.
- Validation.
- Tests.
- Basic logging.

## Day 58: Production Hardening

Add:

- Dockerfile.
- Config handling.
- Error responses.
- Metrics.
- Model card.
- README.

## Day 59: Interview Prep

Prepare answers for:

- Why Python after Java?
- How do you prevent data leakage?
- How do you evaluate a classifier?
- How does RAG work?
- How do you deploy and monitor a model?
- What can go wrong in production?

## Day 60: Portfolio Polish

Finalize:

- README with architecture diagram.
- Setup instructions.
- Example requests and responses.
- Metrics summary.
- Known limitations.
- Future improvements.

## Most Asked / Most Confused Q&A

Q: What project is best for job interviews?
A: A production-shaped project is better than a notebook-only project. Show data, training, evaluation, API, tests, deployment, and trade-offs.

Q: Should I build everything in Python or use Java too?
A: For learning ML, use Python. For your advantage as a Java developer, one capstone should show integration with Java or enterprise backend patterns.

Q: What makes a project production-ready?
A: Reproducibility, tests, clear API contracts, config management, logging, monitoring, rollback plan, security awareness, and documentation.

Q: Do I need Kubernetes?
A: Not at first. Docker and a clear deployment story are enough for a strong beginner-to-intermediate portfolio. Learn Kubernetes after you can build and containerize services.

Q: What should go in a model card?
A: Intended use, training data summary, metrics, limitations, ethical concerns, failure modes, and ownership.

---

# Recommended Capstone Specification

## Option A: Train in Python, Serve in Java

Problem:

- Predict a business outcome such as churn, loan risk, support ticket priority, or house price.

Python side:

- Load data.
- Clean data.
- Train baseline and improved model.
- Track metrics.
- Export model artifact.

Java side:

- Build Spring Boot REST API.
- Load model artifact through a suitable runtime.
- Validate requests.
- Return predictions and confidence.

Production layer:

- Dockerfile.
- Tests.
- Structured logs.
- Health endpoint.
- README.

## Option B: Enterprise RAG Assistant

Problem:

- Answer questions from a private document collection.

Core pipeline:

- Load documents.
- Chunk text.
- Create embeddings.
- Store vectors.
- Retrieve relevant chunks.
- Generate answer with citations.

Production layer:

- API endpoint.
- Prompt templates.
- Evaluation question set.
- Latency and cost logging.
- Prompt injection notes.
- README.

---

# Final Production Readiness Checklist

Use this checklist before calling any project complete:

- Can a new developer run the project from the README?
- Are dependencies pinned or clearly specified?
- Is raw data separated from processed data?
- Is preprocessing reproducible?
- Are tests included for critical transformations and API behavior?
- Are metrics reported clearly?
- Is the model artifact saved and versioned?
- Does inference use the same transformations as training?
- Are secrets excluded from Git?
- Are logs useful but not leaking sensitive data?
- Are failure modes documented?
- Is there a simple rollback or replacement plan?
- Are limitations explained honestly?

---

# Core Interview Questions to Practice

Python:

- What are mutable default arguments and why are they dangerous?
- What is a generator?
- What is the difference between list comprehension and generator expression?
- How does exception handling differ from Java?

Data:

- How do you handle missing values?
- How do you detect outliers?
- How do you prevent data leakage?
- How do you validate data quality?

ML:

- Explain bias vs variance.
- Explain precision vs recall.
- Explain ROC-AUC vs PR-AUC.
- Explain cross-validation.
- Explain why a simple baseline matters.

Deep learning:

- Explain backpropagation.
- Explain vanishing gradients.
- Explain overfitting in neural networks.
- Explain dropout.
- Explain embeddings.

GenAI:

- Explain tokens.
- Explain temperature.
- Explain RAG.
- Explain prompt injection.
- Explain hallucination.
- Explain when fine-tuning is useful.

Production:

- How do you deploy a model?
- How do you monitor drift?
- How do you handle model rollback?
- How do you secure a GenAI app?
- How do you estimate latency and cost?
