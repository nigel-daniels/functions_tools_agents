# Conversational Agent
## Agent Basics
- Agents
	- a combination of LLMs and code
	- LLMs reason about what steps to take and call for actions.
- Agent loop
	- Choose a tool to use.
	- Observe the output of the tool.
	- Repeat until a stopping condition is met.
- Stopping conditions can be:
- LLM determined.
- Hardcoded rules.

In this Lab we:
	- Build some tools
	- Write our own agent loop using LCEL
	- Use `AgentExecutor` which:
		- Implements the agent loop
		- Adds error handling, early stopping, tracing, etc.
