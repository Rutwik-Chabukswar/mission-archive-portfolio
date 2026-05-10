# Full-Stack Deployment Debug Notes & Journey

This document serves as a comprehensive record of the deployment process for the Mission Archive Portfolio project. It outlines the architecture, challenges encountered, root causes, exact fixes, and best practices for future deployments.

## Project Architecture
- **Frontend**: React + Vite (Deployed on Vercel)
- **Backend**: FastAPI (Deployed on Render Free Tier)
- **AI/ML Layer**: ChromaDB + HuggingFace Embeddings + Groq API
- **Repository**: GitHub (Monorepo setup)

---

## Deployment Timeline & Issues Encountered

### 1. Initial Render Backend Deployment Failure
- **Error Messages**: 
  - `metadata-generation-failed`
  - `pydantic-core` build failure
  - `maturin failed`
  - `cargo error` (Rust build failed)
  - `read-only file system`
- **Root Cause Analysis**: Render's Native Python environment defaulted to Python 3.14. The `pydantic-core` package did not have a pre-compiled wheel for Python 3.14 yet, forcing Render to build it from source using Rust (`maturin`). The build failed due to environment constraints.
- **Exact Fix**: Enforced Python 3.11.9, which has stable pre-compiled wheels available.
- **Commands/Actions**: Created a `runtime.txt` file and `.python-version` file specifying the Python version.

### 2. Runtime File Formatting Issue
- **Error Message**: Render deployment continued to fail despite the presence of `runtime.txt`.
- **Root Cause Analysis**: Render explicitly requires the `runtime.txt` file to be formatted with the `python-` prefix (e.g., `python-3.11.9`), but the file initially just contained `3.11.9`.
- **Exact Fix**: Corrected the formatting in `backend/runtime.txt`.
- **Commands/Actions**:
  ```text
  # inside backend/runtime.txt
  python-3.11.9
  ```

### 3. Git Commit Syntax Mistake
- **Error Message**: `error: pathspec 'deployment memory error solved' did not match any file(s) known to git`
- **Root Cause Analysis**: Attempted to commit changes using `git commit - "message"`, missing the crucial `-m` flag.
- **Exact Fix**: Used the correct git commit syntax.
- **Commands/Actions**:
  ```bash
  git commit -m "deployment memory error solved"
  ```

### 4. Render Out-of-Memory (OOM) Issue
- **Error Message**: `Out of memory (used over 512MB)`
- **Root Cause Analysis**: The Render Free Tier has a strict 512MB RAM limit. During startup (`lifespan` hook), the FastAPI backend was eagerly loading `HuggingFaceEmbeddings` (a ~100MB model) and initializing the Chroma vector database. It also attempted to auto-ingest PDF documents, causing a massive memory spike that killed the instance before it could serve traffic.
- **Exact Fix**: 
  - Removed global initialization of heavy ML models.
  - Implemented a "lazy-loading" pattern: heavy dependencies are only imported and initialized during the first `/chat` request.
  - Bound ML processing strictly to the CPU to prevent greedy memory allocation.
  - Removed the auto-ingestion script from startup and committed the pre-built `chroma_db` directly to GitHub.
- **Commands/Actions**: Modified `backend/app.py` to remove `ingest_documents` from startup, and refactored `backend/query.py` to lazy-load models.

### 5. Render Backend Successful Deployment
- **Verification**: The backend finally stabilized and returned a successful 200 OK response.
- **API Response**:
  ```json
  {
    "message": "Mission Archive AI Assistant API is running"
  }
  ```

### 6. Frontend Deployment on Vercel
- **Process**: Deployed the Vite + React frontend to Vercel via GitHub integration.
- **Configuration Used**:
  - **Framework Preset**: Vite
  - **Root Directory**: `./` (Root of the monorepo)
  - **Build Command**: `npm run build`
  - **Output Directory**: `dist`
  - **Install Command**: `npm install`
- **Result**: Successfully built and deployed the static assets.

### 7. Environment Variable Configuration Error
- **Error**: API requests from the frontend were failing or returning 404/CORS errors.
- **Root Cause Analysis**: The frontend's `.env` variable for the API base URL was accidentally appended with tracking parameters (`?utm_source=chatgpt.com`). This corrupted the route paths (e.g., `https://mission-archive-backend.onrender.com/?utm_source=chatgpt.com/chat`).
- **Exact Fix**: Stripped all trailing slashes and parameters from the base URL.
- **Configuration**:
  - **Wrong**: `https://mission-archive-backend.onrender.com/?utm_source=chatgpt.com`
  - **Correct**: `https://mission-archive-backend.onrender.com`

---

## Key Lessons Learned
1. **Infrastructure Limits Dictionary**: Free-tier cloud providers (like Render) have harsh resource constraints (512MB RAM). Eagerly loading ML models at startup is dangerous. Lazy-loading is a crucial pattern for resource-constrained environments.
2. **Pre-compiled Wheels > Source Builds**: Always use stable Python versions (like 3.11) instead of bleeding-edge versions (like 3.14). If `pip` has to compile a package from source using Rust/C++, cloud deployments often fail or timeout.
3. **Environment Variable Hygiene**: Base URLs in `.env` files must be pristine. Trailing slashes or query parameters will invariably break API route concatenation.

## Things to Avoid in Future Deployments
- Avoid leaving dependency versions strictly pinned (e.g., `pydantic==2.7.4`) if they cause compilation issues; unpinning or using `>=` allows platforms to fetch compatible wheels.
- Avoid tracking heavy database folders (`chroma_db`) in `.gitignore` *if* the cloud provider lacks persistent storage and cannot regenerate them efficiently.
- Avoid rushing git commands; always verify syntax (`-m` flag).

## Full-Stack Deployment Checklist
- [ ] **Python Version Target**: Explicitly declare a stable Python version using `runtime.txt` or `.python-version`.
- [ ] **Dependency Audit**: Ensure `requirements.txt` is updated and free of overly strict pins that force source compilation.
- [ ] **Memory Profiling**: Verify that the application doesn't exceed 512MB RAM on startup. Lazy-load heavy dependencies.
- [ ] **Pre-build Assets**: If using a vector DB, pre-build it locally and commit it if using ephemeral free-tier hosting.
- [ ] **Frontend Environment Variables**: Verify base URLs are clean (no trailing slashes, no query parameters).
- [ ] **Build Configuration**: Confirm framework presets (Vite), build commands (`npm run build`), and output directories (`dist`) match the hosting platform's expectations.
- [ ] **CORS Configuration**: Ensure the backend allows requests from the specific deployed frontend domain.
