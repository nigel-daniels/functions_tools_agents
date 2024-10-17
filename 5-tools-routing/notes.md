# Tools and Routing
- Functions and services an LLM can use to extend its capabilities are called 'Tools' in `LangChain.JS`.
- LangChain.JS offers many existing tools:
	- Search tools
	- Maths tools
	- SQL tools
	- ...

This exercise covers:
- Creating your own tools
- Building a tool based on an OpenAI spec:
	- Predating LLMs the OpenAI spec. is routinely used by providers to describe their APIs.
- Selecting from multiple tools, called 'Routing'.

## Note
The Wikipedia tool used the library:
```
npm install wikipedia
```
