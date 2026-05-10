# Technology Knowledge Base (Tech Wiki)

## React
**What it is:** A JavaScript library for building user interfaces, focusing on declarative, component-based development.
**Why it is used:** To create interactive, scalable web applications with reusable UI components and efficient state management.
**Where Rutwik used it:** SarkariSaathi, AD Dashboard, and Portfolio Website.
**Benefits:** High performance via the virtual DOM, strong ecosystem, and rapid reusability of UI components.
**Real Project Examples:** Used in SarkariSaathi for the primary citizen-facing interface and in the AD Dashboard for rendering complex analytics visualizations.

## Next.js
**What it is:** A React framework for production-grade web applications with features like server-side rendering (SSR) and static site generation (SSG).
**Why it is used:** To build highly optimized, SEO-friendly, and fast-loading web applications with zero configuration.
**Where Rutwik used it:** CarWash Platform and internal tools.
**Benefits:** Built-in routing, secure backend API routes, fast page loads, and excellent overall developer experience.
**Real Project Examples:** Architected the CarWash Platform using Next.js to provide lightning-fast booking operations, SEO optimization, and secure routing.

## FastAPI
**What it is:** A modern, high-performance web framework for building APIs with Python 3.7+ based on standard Python type hints.
**Why it is used:** To build fast backend services with automatic interactive documentation (Swagger UI) and asynchronous support.
**Where Rutwik used it:** AI Compliance Agent and SarkariSaathi.
**Benefits:** Extremely fast execution speed (comparable to NodeJS/Go), easy to write, minimal code duplication, and robust input validation.
**Real Project Examples:** Powered the backend for SarkariSaathi to handle citizen queries concurrently, and served as the core API framework for the AI Compliance Agent.

## RAG (Retrieval-Augmented Generation)
**What it is:** An AI architecture that combines a Large Language Model (LLM) with external knowledge bases to provide accurate, context-aware responses.
**Why it is used:** To prevent AI hallucinations and provide strictly factual answers based on proprietary or live data instead of just the LLM's static training weights.
**Where Rutwik used it:** SarkariSaathi RAG Pipeline and this Portfolio AI Assistant.
**Benefits:** High factual accuracy, domain-specific intelligence, reduced hallucination, and the ability to update the knowledge base dynamically without retraining models.
**Real Project Examples:** Implemented in SarkariSaathi to retrieve accurate government scheme details dynamically and feed them into the Gemini API for answering specific citizen queries.

## ChromaDB
**What it is:** An open-source vector database designed specifically for AI applications, semantic search, and embeddings.
**Why it is used:** To store and query high-dimensional vector embeddings incredibly fast for semantic search and RAG workflows.
**Where Rutwik used it:** SarkariSaathi RAG Pipeline and this Portfolio AI Intelligence Terminal.
**Benefits:** Lightweight architecture, easy to integrate directly with Python/LangChain, blazing-fast semantic retrieval, and open-source flexibility.
**Real Project Examples:** Used as the core memory storage layer for SarkariSaathi to store document embeddings of various complex government schemes.

## Vector Databases
**What it is:** Specialized databases designed to store and query data as high-dimensional vectors (mathematical representations of data and semantic meaning).
**Why it is used:** To perform advanced similarity searches based on semantic meaning and context rather than exact keyword or string matches.
**Where Rutwik used it:** Various AI-driven projects, specifically utilizing ChromaDB.
**Benefits:** Enables "fuzzy" contextual searching, deep semantic understanding, and serves as the foundational memory block for advanced AI agents and RAG systems.
**Real Project Examples:** Integrated into SarkariSaathi to match vague citizen queries with the semantic meaning of official government scheme documents.

## Groq
**What it is:** A blazing-fast AI inference engine powered by specialized hardware called LPUs (Language Processing Units).
**Why it is used:** To run massive LLMs (like Llama 3) at unprecedented speeds, enabling real-time, zero-latency conversational interactions.
**Where Rutwik used it:** The Portfolio AI Intelligence Terminal (Chatbot).
**Benefits:** Ultra-low latency, seamless real-time streaming, and highly responsive user experiences that mimic actual human typing speed.
**Real Project Examples:** Used in this portfolio to power the Intelligence Terminal, providing immediate, streaming technical and personal answers to recruiter queries.

## Gemini
**What it is:** Google's state-of-the-art multimodal large language model capable of processing text, code, audio, and video.
**Why it is used:** To generate high-quality text, execute code, and perform complex reasoning tasks across vast amounts of multimodal context.
**Where Rutwik used it:** SarkariSaathi platform.
**Benefits:** Advanced reasoning capabilities, massive context windows for huge documents, and strong multimodal processing performance.
**Real Project Examples:** Utilized via the Gemini API in SarkariSaathi to synthesize retrieved government scheme data into simple, actionable, and localized guidance for citizens.

## Python
**What it is:** A versatile, high-level programming language universally known for its readability, dynamic typing, and massive developer ecosystem.
**Why it is used:** It acts as the undisputed industry standard for Artificial Intelligence, data processing, and rapid backend microservices development.
**Where Rutwik used it:** AI Compliance Agent, AD Dashboard, and Portfolio Backend.
**Benefits:** Incredible third-party library support (LangChain, FastAPI, Pandas), rapid prototyping capabilities, and total dominance in the machine learning space.
**Real Project Examples:** The entire intelligence backend of the AI Compliance Agent and the data-crunching AD Dashboard API are built entirely in Python.

## UI/UX (User Interface / User Experience)
**What it is:** The discipline of designing software interfaces (UI) and the overall user journey and interactive feel (UX).
**Why it is used:** To create intuitive, engaging, beautiful, and highly accessible digital products that users inherently enjoy utilizing.
**Where Rutwik used it:** CarWash Platform, Portfolio Website, and SarkariSaathi interface.
**Benefits:** Considerably higher user retention, lower user friction, vastly better accessibility, and establishment of a strong, premium brand identity.
**Real Project Examples:** Designed the high-fidelity, classified-mission cinematic aesthetic for this portfolio using Figma, and crafted the high-conversion CarWash Platform interface.

## Three.js
**What it is:** A powerful, cross-browser JavaScript library and API used to create and display animated 3D computer graphics in a web browser using WebGL.
**Why it is used:** To build immersive, highly interactive 3D web experiences natively without requiring any browser plugins or external software.
**Where Rutwik used it:** Advanced web frontend experiments and interactive visual elements.
**Benefits:** Hardware-accelerated graphics processing, extensive geometry/material options, and incredibly strong community support for complex 3D math.
**Real Project Examples:** Extensively evaluated and tested for advanced portfolio visual effects and rendering complex spatial data visualization dashboards.

## GSAP (GreenSock Animation Platform)
**What it is:** An industry-standard, robust JavaScript toolset for high-performance HTML5 animations.
**Why it is used:** To create complex, sequenced, and buttery-smooth animations that standard CSS transitions simply cannot handle effectively or performantly.
**Where Rutwik used it:** High-end web projects and sophisticated UI layer transitions.
**Benefits:** Flawless cross-browser consistency, zero external dependencies, intricate timeline control, and unparalleled rendering performance.
**Real Project Examples:** Used alongside Framer Motion for crafting the premium, cinematic animations and boot sequences in modern web interfaces like this portfolio.
