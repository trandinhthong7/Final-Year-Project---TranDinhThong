# REPORT_GUIDE.md — Consolidated Academic Report Instructions

This document combines and reconciles the requirements from two source files found in this repository:

- **`CHAPTER-BY-CHAPTER INSTRUCTIONS.md`** — chapter-specific structural rules
- **`System Instructions for Academic Report Generation.md`** — global writing rules, content checklists, and AI prompt templates

---

## 1. Summary of Each Source Document

### 1.1 `CHAPTER-BY-CHAPTER INSTRUCTIONS.md`
A chapter-by-chapter reference covering Chapters 1–9 of the dissertation. Each chapter entry prescribes the required content, mandatory artefacts (e.g., Gantt charts, ERDs, test-case tables), and hard guardrails (e.g., no code dumps, no superficial LSEPI tables). Key themes:

- **SMART objectives** with quantifiable metrics (Ch. 1)
- **Nielsen's 10 Usability Heuristics** for competitor analysis (Ch. 2)
- **MoSCoW-prioritised User Stories** for requirements (Ch. 3)
- **Agile-realistic Gantt chart** (concurrent FE/BE tasks, not linear waterfall) (Ch. 4)
- **Visual architecture artefacts** — Rich Picture, C4 Model, ERD, API table (Ch. 5)
- **Max 15–20 lines per code snippet** focused on "why", not "what" (Ch. 6)
- **Multi-layer testing** (Unit, Integration, UAT) with structured test-case tables (Ch. 7)
- **In-depth LSEPI paragraphs** with legal/professional citations (Ch. 8)
- **Reflective conclusion** that maps back to each SMART objective with evidence (Ch. 9)

### 1.2 `System Instructions for Academic Report Generation.md`
A set of global writing rules and content checklists intended to be applied document-wide. Key themes:

- **Third-person voice only** — "I/me/my/we/our" are forbidden throughout
- **Academic rigour** — every claim backed by a credible citation (IEEE, ACM, Nielsen, etc.)
- **Critical evaluation over description** — justify *why*, not just *what*
- **Abstract keywords** — 5–7 academic keywords listed at the end of the abstract
- **LSEPI paragraphs** — analytical prose tied to specific regulations (GDPR) or codes (BCS)
- **Template AI prompts** — ready-to-use prompts for writing objectives, competitor analysis, and implementation review

---

## 2. Unified Chapter-by-Chapter Checklist

Apply the **Global Writing Rules** (Section 3 below) to every chapter before submitting.

### Chapter 1 — Introduction
- [ ] Problem Statement includes **cited statistics** that prove the scale/significance of the issue
- [ ] Project Aim is **one comprehensive sentence** — what is built, for whom, and the benefit
- [ ] Each Specific Objective follows the **SMART framework** (Specific, Measurable, Achievable, Relevant, Time-bound)
- [ ] Every objective contains a **quantifiable metric** (e.g., ">80% task success rate", "<500 ms API latency")
- [ ] Objectives span the **full project lifecycle** (research, design, implementation, testing, evaluation) — not just coding
- [ ] Abstract ends with **5–7 academic keywords**

### Chapter 2 — Background & Literature Review
- [ ] Competitor analysis section compares **at least two** similar products
- [ ] Each competitor evaluated against **Nielsen's 10 Usability Heuristics** (not just feature lists)
- [ ] Technology and methodology choices **supported by academic citations** (IEEE, ACM, peer-reviewed sources)
- [ ] A clear, explicitly labelled **"Research Gap"** section synthesises findings and links directly to the proposed project

### Chapter 3 — Requirements Analysis
- [ ] Research methodology section states how data was gathered (surveys, interviews, etc.) and names participant profile/demographics
- [ ] User Personas derived from research data — at least two distinct personas
- [ ] Functional requirements written as **User Stories**: "As a [user], I want [action] so that [benefit]"
- [ ] User Stories prioritised using **MoSCoW** (Must / Should / Could / Won't)
- [ ] Non-functional requirements included (performance, security, usability targets)

### Chapter 4 — Methodology & Project Planning
- [ ] **Research-backed comparison** of at least two methodologies (e.g., Agile vs. Waterfall) with citations justifying the chosen approach
- [ ] Chosen methodology applied in practice — sprint lengths, ceremonies, artefacts described
- [ ] Gantt chart / project timeline **reflects true Agile**: concurrent FE and BE tasks, visible interdependencies, iterative testing cycles
- [ ] Gantt chart does **NOT** show a linear, cascading waterfall sequence
- [ ] **Success Metrics** defined — both quantitative (API response time, SUS score, task completion rate) and qualitative

### Chapter 5 — System Design & Architecture
- [ ] **Rich Picture** — context diagram showing all actors and external systems
- [ ] **C4 Model** — Context and Container level diagrams at minimum
- [ ] **Entity Relationship Diagram (ERD)** — full database blueprint with relationships
- [ ] **API Design table** with columns: Method, URL, Auth Required, Description
- [ ] All diagrams accompanied by critical explanatory text (not just captions)

### Chapter 6 — Implementation *(Critical Guardrails)*
- [ ] **NO code dumps** — maximum 15–20 lines per snippet
- [ ] **NO excessive screenshots** — screen dumps limited; prose focuses on critical evaluation
- [ ] Only code that demonstrates a **complex architectural decision**, **security implementation**, or **novel algorithm** is included
- [ ] Every code snippet accompanied by a **critical evaluation** of why it was written that way (not a syntax walkthrough)
- [ ] Architectural and technology choices justified using research citations

### Chapter 7 — Testing
- [ ] Multi-layered testing strategy described: **Unit Testing**, **Integration Testing**, **User Acceptance Testing (UAT)**
- [ ] **Structured test-case table** with columns: ID, Description, Steps, Expected Result, Actual Result, Pass/Fail
- [ ] UAT results evaluated against the **quantitative metrics** defined in Chapter 4 (e.g., Task Completion Rate, SUS score)
- [ ] Pass/fail outcomes discussed critically — any failures analysed and explained

### Chapter 8 — LSEPI (Legal, Social, Ethical, and Professional Issues)
- [ ] Each LSEPI category written as **substantial, analytical paragraphs** — no superficial bullet points or tables
- [ ] Every claim tied to a **specific regulation** (e.g., GDPR Article numbers), **academic framework**, or **professional code of conduct** (e.g., BCS Code of Conduct)
- [ ] Legal issues: data protection, IP, accessibility legislation
- [ ] Social issues: digital inclusion, user impact
- [ ] Ethical issues: data privacy, bias, consent
- [ ] Professional issues: BCS standards, professional responsibility

### Chapter 9 — Conclusion & Critical Reflection
- [ ] Each SMART objective from Chapter 1 **explicitly restated** and evaluated with evidence
- [ ] Honest **critical evaluation** of what succeeded and what failed (integration issues, scope changes, etc.)
- [ ] Challenges and mitigations discussed analytically, not superficially
- [ ] **Future Work** section provides a realistic, prioritised technical roadmap (not vague aspirations)

---

## 3. Global Writing Rules (Apply to Every Chapter)

| Rule | Requirement |
|---|---|
| **Voice** | Third person only throughout. Forbidden: "I", "me", "my", "we", "our" |
| **Tone** | Formal academic dissertation style appropriate for BSc Honours Computing |
| **Citation** | Every factual claim, methodological choice, and LSEPI point must cite a credible source (IEEE, ACM, Nielsen, GDPR, BCS) |
| **Critical Evaluation** | Justify *why* each decision was made using comparative analysis — do not merely describe *what* something is |
| **Code Snippets** | Maximum 15–20 lines; critical architectural/security/algorithmic focus only |
| **LSEPI** | Analytical paragraphs only; no superficial tables or bullet lists |
| **Objectives** | SMART framework with a quantifiable metric per objective |

---

## 4. Conflicts and Ambiguities Between the Two Documents

| # | Topic | `CHAPTER-BY-CHAPTER INSTRUCTIONS.md` | `System Instructions…` | Resolution |
|---|---|---|---|---|
| 1 | **Scope of "no code dumps"** | Listed under Ch. 6 only | Listed under global "Implementation" rules | Apply the 15–20 line limit globally; treat it as a document-wide rule that is especially enforced in Ch. 6 |
| 2 | **LSEPI format** | "Deep Paragraphs, No Tables" (Ch. 8) | "No Superficial Tables; in-depth analytical paragraphs" | Fully consistent; both mandate analytical paragraphs with citations |
| 3 | **Gantt chart label** | Described in Ch. 4 as a must-have artefact | Described in global rules as "Agile Gantt Chart Reality" | Consistent requirement; include in Ch. 4 and reference global rules |
| 4 | **Competitor analysis depth** | Ch. 2 explicitly requires at least two products with Nielsen's Heuristics | Global rules mandate Nielsen's Heuristics but do not specify a minimum count | Use the stricter rule: compare **at least two** competitors using Nielsen's Heuristics |
| 5 | **Abstract keywords** | Not mentioned | 5–7 academic keywords required at the end of the Abstract | Follow the System Instructions; include 5–7 keywords in the Abstract |
| 6 | **Template prompts** | Not present | Section 3 of System Instructions provides three template AI prompts | No conflict; treat prompts as supplementary tooling, not structural requirements |

**Overall verdict:** The two documents are largely complementary and consistent. Where they overlap, the requirements reinforce each other. Where one document adds detail the other lacks (e.g., abstract keywords, AI prompts), treat it as an additive requirement.

---

## 5. Recommended Report Structure

```
Title Page
Abstract  ← include 5–7 academic keywords at the end
Table of Contents
List of Figures / List of Tables

Chapter 1: Introduction
  1.1 Background and Motivation
  1.2 Problem Statement (with cited statistics)
  1.3 Project Aim
  1.4 SMART Objectives (with quantifiable metrics, full lifecycle scope)
  1.5 Report Structure Overview

Chapter 2: Background & Literature Review
  2.1 Domain Overview
  2.2 Competitor Analysis (≥2 products; Nielsen's 10 Heuristics)
  2.3 Technology Review (comparative, with citations)
  2.4 Methodology Review (comparative, with citations)
  2.5 Research Gap

Chapter 3: Requirements Analysis
  3.1 Research Methodology (data collection approach, participant profile)
  3.2 User Personas
  3.3 Functional Requirements (User Stories, MoSCoW)
  3.4 Non-Functional Requirements

Chapter 4: Methodology & Project Planning
  4.1 Methodology Comparison and Justification (≥2 methodologies, cited)
  4.2 Chosen Methodology in Practice (sprints, ceremonies, artefacts)
  4.3 Project Plan / Gantt Chart (true Agile: concurrent FE/BE, iterative testing)
  4.4 Success Metrics (quantitative + qualitative)

Chapter 5: System Design & Architecture
  5.1 Rich Picture
  5.2 C4 Model (Context + Container)
  5.3 Entity Relationship Diagram (ERD)
  5.4 API Design Table (Method / URL / Auth / Description)
  5.5 Security Architecture (briefly)

Chapter 6: Implementation
  6.1 Development Environment and Toolchain (justified)
  6.2 Key Architectural Decisions (max 15–20 lines per snippet, "why" focus)
  6.3 Security Implementation Highlights
  6.4 Challenges and Solutions

Chapter 7: Testing
  7.1 Testing Strategy (Unit / Integration / UAT)
  7.2 Test Cases (structured table: ID / Description / Steps / Expected / Actual / Pass-Fail)
  7.3 UAT Results and Evaluation Against Success Metrics
  7.4 Analysis of Failures and Mitigations

Chapter 8: Legal, Social, Ethical, and Professional Issues (LSEPI)
  8.1 Legal Issues (GDPR, accessibility law, IP)
  8.2 Social Issues (digital inclusion, user impact)
  8.3 Ethical Issues (data privacy, bias, consent)
  8.4 Professional Issues (BCS Code of Conduct)

Chapter 9: Conclusion & Critical Reflection
  9.1 Achievement of SMART Objectives (each objective revisited with evidence)
  9.2 Critical Evaluation (successes and failures, honestly appraised)
  9.3 Limitations
  9.4 Future Work (prioritised technical roadmap)

References (IEEE / Harvard format — consistent throughout)
Appendices (raw survey data, extended code listings, full test tables, etc.)
```

---

## 6. Template AI Prompts (from System Instructions)

Use these when drafting or refining specific sections with AI assistance.

**Writing a SMART Objective:**
> "Draft an objective for the testing phase of my e-commerce project. Use the SMART framework. Ensure it includes a measurable quantitative metric and does not mention specific technologies."

**Writing a Competitor Analysis:**
> "Conduct a critical review of [Competitor 1] and [Competitor 2]. Compare them strictly using Nielsen's 10 Usability Heuristics. Cite academic sources on usability where appropriate, and write in the third person."

**Reviewing an Implementation Chapter Draft:**
> "Review this implementation draft. Remove any excessive screen dumps or overly long code blocks. Rewrite the surrounding text to critically evaluate my architectural decisions rather than just describing the code. Ensure the tone is formal and third-person."

---

*This guide was created by consolidating `CHAPTER-BY-CHAPTER INSTRUCTIONS.md` and `System Instructions for Academic Report Generation.md`. Refer to those source files for the original wording.*
