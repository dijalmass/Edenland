---
trigger: always_on
---

# GEMINI.md - Antigravity Kit

## CRITICAL: AGENT & SKILL PROTOCOL
> **MANDATORY:** Read the appropriate agent file and its skills BEFORE any implementation. 
- **Rule Priority:** P0 (GEMINI.md) > P1 (Agent .md) > P2 (SKILL.md). All rules are binding.

## 📥 REQUEST CLASSIFIER
- **QUESTION**: "what is", "explain" -> TIER 0 -> Text Response
- **SURVEY**: "analyze", "overview" -> TIER 0 -> Session Intel
- **SIMPLE CODE**: "fix", "add" -> TIER 0 + 1 -> Inline Edit
- **COMPLEX CODE/DESIGN**: "build", "refactor", "design" -> TIER 0 + 1 + Agent -> **{task-slug}.md Required**

## 🤖 INTELLIGENT AGENT ROUTING
> 🔴 **MANDATORY:** You MUST follow `@[skills/intelligent-routing]`.
1. **Analyze (Silent)**: Detect domains.
2. **Select Agent(s)**: Choose specialist.
3. **Inform User**: `🤖 **Applying knowledge of @[agent-name]...**`
4. **Apply**: Generate response using persona.
*Failure to identify agent = PROTOCOL VIOLATION.*

## TIER 0: UNIVERSAL RULES
- **Language**: Respond in user's language (PT-BR primarily). Code comments/vars in English.
- **Clean Code**: Follow `@[skills/clean-code]`. Concise, self-documenting. Mandatory testing.
- **File Dependency**: Check `CODEBASE.md`. Update ALL affected files together.
- **System Map**: Read `ARCHITECTURE.md` to understand Agents/Skills/Scripts.
- **Read → Understand → Apply**: Do not code blindly. Understand the goal and principles first.

## TIER 1: CODE RULES
- **Project Routing**: WEB -> `frontend-specialist`. BACKEND -> `backend-specialist`. MOBILE -> `mobile-developer`.
- **Component Structure**: Atomic feature directory pattern (`ComponentName/` -> `.component.tsx`, `.hook.ts`, `.types.ts`, `index.ts`).

### 📝 Feature Documentation & Changelog Protocol (CRITICAL RULE)
**[🔴 MANDATORY / ZERO EXCEPTIONS] FOR EVERY NEW FEATURE OR COMPLETED TASK:**
1. **Feature Docs:** You MUST create `docs/features/<feature_name>/implementation.md` BEFORE or DURING implementation.
2. **Changelog:** You MUST ALWAYS update `docs/CHANGELOG.md` under `[Planejado]` when planning, and move to `[Unreleased]` -> `Added/Changed/Fixed` when completing.
> 🛑 **WARNING:** Do NOT wait for the user to ask. Failing this means the task is incomplete.

### 🛑 Socratic Gate
**MANDATORY:** Every request must pass the Gate before tool use/implementation.
- Complex/New: Ask 3 strategic questions.
- Vague/Simple: Ask Purpose, Users, Scope.
- Direct "Proceed": Ask 2 edge-case questions.
*Never assume. Wait for user to clear the Gate.*

### 🏁 Final Checklist Protocol
Triggered by "son kontrolleri yap", "final checks", etc.
- **Manual Audit**: `python .agent/scripts/checklist.py .`
- **Pre-Deploy**: `python .agent/scripts/checklist.py . --url <URL>`
*Task is NOT finished until `checklist.py` returns success.*

### 🎭 Gemini Mode Mapping
- **plan**: `project-planner` (4-phase: Analyze, Plan, Solution, Implement)
- **ask**: Focus on understanding.
- **edit**: `orchestrator` (Execute).

## TIER 2: DESIGN RULES
> Rules are in `.agent/frontend-specialist.md` & `.agent/mobile-developer.md`.
- **Purple Ban**: NO purple/violet/indigo.
- **Template Ban**: NO standard layouts. 
- **Deep Design Thinking**: Read agent files.

## 📁 QUICK REFERENCE
- **Masters**: `orchestrator`, `project-planner`, `backend-specialist`, `frontend-specialist`
- **Scripts**: `checklist.py`, `lint_runner.py`, `test_runner.py`
