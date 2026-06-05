# VigiLink AI Recon Engine 🛡️🤖
**Continuous Vendor Monitoring (CVM) & Automated Third-Party Risk Management**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-blue?logo=python)](https://www.python.org/)
[![Ollama](https://img.shields.io/badge/AI-Qwen2.5--Coder-orange)](https://ollama.com/)

VigiLink AI is a production-ready, full-stack Continuous Vendor Monitoring (CVM) platform designed to automate third-party risk management (TPRM). Instead of relying on static annual security questionnaires, VigiLink conducts real-time, multi-engine OSINT sweeps, assesses data leak exposure, evaluates regulatory news, and utilizes an air-gapped local AI engine to generate contextual, boardroom-ready mitigation playbooks.

---

## 🏗️ Core System Architecture & Data Flow

Below is the complete end-to-end architecture mapping out the reactive frontend state, the asynchronous Python backend, and the decoupled external OSINT layers.

```mermaid
graph TD
    %% Phase 1: Onboarding
    A[Next.js Frontend Dashboard] -->|1. Post Domain/Vendor| B(FastAPI Gatekeeper /api/vendors/gatekeeper)
    B -->|2. Fast Concurrent Audit| C{Base Hygiene Check}
    C -->|Fail < 75 Score| D[UI Warning / Override Prompt]
    C -->|Pass > 75 Score| E[Commit Base Record to DB]
    D -->|Explicit User Approval| E
    
    %% Phase 2: Batch Processing
    E -->|3. Append to Drag-and-Drop Queue| F[Batch Orchestrator UI]
    F -->|4. Trigger Deep Analysis Loop| G(POST /api/vendors/scan)
    G -->|5. Open Persistent Stream| H[WebSocket Connection ws://...]
    
    %% Phase 3: Triple-Engine Deep Scan
    H -->|6. Real-Time Terminal Logs| I[Hacker Terminal Component]
    G -->|7. asyncio.gather Concurrent Tasks| J[Triple-Engine OSINT Core]
    
    subgraph Triple-Engine Core
        J1[Cyber Infrastructure Engine<br/>Google DNS A-Record Fix / Censys V3 / crt.sh]
        J2[Identity & Data Leak Engine<br/>HIBP Feeds / GitHub Secrets Scraper]
        J3[Financial & Risk News Engine<br/>Regulatory & Keyword Web Scraper]
    end
    
    J --> J1 & J2 & J3
    
    %% Phase 4: Scoring & AI Brain
    J1 & J2 & J3 -->|8. Raw Payload Extraction| K[Weighted Scoring Engine]
    K -->|9. Apply Severity Penalties| L[Strict Math Evaluator max/0, score/]
    L -->|10. Slimmed-Down JSON Context| M[Local LLM Ollama / Qwen2.5-Coder]
    M -->|11. Structured Response| N[Generated Actionable Playbook]
    
    %% Phase 5: Persistence & Delivery
    N -->|12. Commit Complex JSON Object| O[(SQLite / PostgreSQL DB)]
    O -->|13. Final Result Frame| H
    H -->|14. UI State Resolve| F
    F -->|15. Unpack JSON Model| P[CyberReportCard Boardroom Report]
    P -->|16. CSS Print Query Override| Q[A4 Executive PDF Export]
```

---

## ⚡ Key Architectural Features

## ⚡ Key Architectural Features

### 🛡️ 1. Dual-Phase Triage (The Gatekeeper)
> **Objective:** Prevent database bloat and optimize API quotas before authorizing heavy infrastructure sweeps.

The platform implements a synchronous, pre-screening triage endpoint (`/api/vendors/gatekeeper`). It rapidly evaluates fundamental security postures:
* **Email Hygiene:** Queries Google DNS for active **SPF** and **DMARC** enforcement policies to detect phishing vulnerabilities.
* **Encryption Standards:** Checks `crt.sh` logs for valid, up-to-date SSL/TLS certificate configurations.

### 🔀 2. Async Non-Blocking Multi-Engine Aggregation
> **Objective:** Execute massive, IO-bound recon tasks concurrently without freezing the user interface.

Using Python’s `asyncio.gather`, the backend decouples target workflows into isolated, simultaneous runtime layers:
* **☁️ Infrastructure (Censys V3 & DNS):** Explicitly forces IPv4 resolutions to bypass modern IPv6 enterprise load-balancer blindspots. It maps active subdomains and profiles networks for dangerous open endpoints (e.g., Ports `22`, `3389`, `8080`).
* **🔑 Identity Leak Profiler:** Inspects dark web feeds (HIBP) and scrapes public GitHub repositories for exposed `.env` files, config parameters, and hardcoded cryptography tokens.
* **📰 Contextual Risk Scraper:** Monitors global news pipelines for keywords correlating to financial distress, mass layoffs, or regulatory breaches.

### 📡 3. Real-Time Streaming Telemetry (WebSockets)
> **Objective:** Provide instant, frictionless feedback to the end-user during long-running tasks.

Background tasks pipeline their progress straight to the client-side UI via standard WebSockets (`ws://...`). A dedicated React custom hook parses these real-time chunks, piping a live "Hacker Terminal" feedback stream directly into an execution viewport—completely eliminating the need for legacy, resource-heavy HTTP polling.

### 🧠 4. Severity-Based Weights & Air-Gapped AI Playbooks
> **Objective:** Translate raw JSON vulnerabilities into actionable boardroom intelligence without leaking data.

* **Strict Math Engine:** Scores are evaluated using a deterministic risk-matrix algorithm rather than flat deductions (e.g., Critical Finding = `-20 pts`, Medium Finding = `-5 pts`).
* **Local LLM Integration:** The resultant vulnerability data frame is serialized into a clean prompt matrix and processed by an isolated, local **Qwen2.5-Coder (7B)** model via Ollama. Because the AI runs entirely on localhost, zero proprietary data leaves the network while it acts as a defensive engineer generating a target-specific mitigation playbook.


---

## 🛠️ Tech Stack & Engineering Boundaries

| Layer | Technology | Primary Mandate |
| :--- | :--- | :--- |
| **Frontend UI** | React 19 / Next.js / TypeScript | Reactive state management, HTML5 Drag-and-Drop batching, Tailwind dynamic themes |
| **Data Viz** | Recharts | Computes vendor risk velocities using non-blocking vector sparklines |
| **Backend Core** | FastAPI (Python 3.11+) | Asynchronous orchestration, WebSocket endpoints, structured JSON routers |
| **Async Client** | `aiohttp` | Non-blocking concurrent HTTP requests to external OSINT providers |
| **Local AI Layer** | Ollama / Qwen2.5-Coder | Local, zero-data-leak contextual analysis and defensive remediation mapping |
| **Database** | SQLAlchemy ORM / SQLite | Complex relational mapping of unstructured target JSON payloads |

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18+)
* **Python** (v3.11+)
* **Ollama Client** (For the Air-gapped LLM runner)

### 1. Start the Local AI Engine
VigiLink AI ensures zero data leakage by analyzing vulnerabilities locally. Open a terminal and run:
```bash
ollama run qwen2.5-coder:7b


⚙️ 2. Backend Installation (FastAPI)
The backend utilizes asynchronous Python to orchestrate the OSINT gatherers and calculate the weighted risk matrices.

Open a new terminal and navigate to the backend directory:
cd backend

# Create and activate a pristine virtual environment
python3 -m venv venv
source venv/bin/activate  # Windows users: venv\Scripts\activate

# Install the required Python dependencies
pip install -r requirements.txt

# Boot the Uvicorn ASGI server
python -m uvicorn app.main:app --reload --port 8000


(The backend is now actively listening for WebSocket connections and REST API calls on Port 8000).

🖥️ 3. Frontend Installation (Next.js)
The frontend is a highly reactive Next.js application utilizing Tailwind CSS for custom styling and Recharts for dynamic data visualization.

Open a final, separate terminal and navigate to the frontend directory:
cd frontend/vendor-risk-ops

# Clean install all Node dependencies
npm install

# Start the Next.js development server
npm run dev



🎯 Usage Workflow
Once all three services (Ollama, FastAPI, and Next.js) are running, navigate to http://localhost:3000 in your web browser.

The Gatekeeper Check: Enter a vendor domain (e.g., badssl.com, scanme.nmap.org, or miro.com). The system will perform a synchronous 2-second check on SPF/DMARC records and SSL certificates.

Batch Orchestration: Approve the vendor to add them to the Continuous Monitoring Queue. You can utilize the HTML5 drag-and-drop interface to prioritize the array of vendors.

Deep Scan Execution: Click "Start Queue Processing". Watch the integrated Hacker Terminal stream live WebSocket logs as the Python engines concurrently scrape Censys, crt.sh, HIBP, and financial news outlets.

Boardroom Report Generation: Once the AI finishes scoring, click View Report. The UI will aggressively parse the returned JSON to display exact exposed ports, hosting geography (ISPs), identity leaks, and the custom AI mitigation playbook.

Export: Click the Export as PDF button to trigger a CSS print media query that strips away the dashboard shell, leaving you with a clean, executive-ready A4 document.

🤝 Contributing
Contributions, issues, and feature requests are welcome! Because the architecture is decoupled, you can easily plug in new OSINT Python engines in the backend without breaking the Next.js frontend state.

📝 License
This project is licensed under the MIT License.
