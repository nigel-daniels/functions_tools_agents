# LangChain Expression Language (LCEL)

A syntax to make using chains simpler. LangChain composes chains of components, LCE and the runnable protocol define:

```
                           Means of modifying
                          parameters at runtime
                               (bind, ...)
                                    |
                                    v
      ----------------       ----------------       ----------------
     |                |     |                |     |                |
---->|                |---->|                |---->|                |---->
     |                |  ^  |                |  ^  |                |
      ----------------   |   ----------------   |   ----------------
                         |          ^           |
                         |          |           |
                An allowed set   required   and output
                of input types,  methods.     types
                                 (invoke,
                                  stream,
                                  batch)
```
Composition can now use the a `pipe` syntax:

```
chain = prompt.pipe(llm).pipe(new OutputParser);
```

NB. We need to install `LangchainJS`.

```
npm install langchain
```

## Interface
- Common implement "Runnable" protocol
- Common methods include:
	- invoke
	- stream
	- batch
- Common properties
	- input_schema
	- output_schema
- Common I/O

Component|Input Type|Output Type
---|---|---
Prompt|Dictionary|Prompt Value
Retriever|Single String|List of Documents
LLM| String, list of messages or Prompt Value| String
ChatModel|String, list of messages or Prompt Value|ChatMessage
Tool|String, Dictionary|Tool dependant
|Output Parser|Output of LLM or ChatModel|Parser dependant


## Why use LCEL
- Runnables support:
	- Async, Batch and Streaming support
	- Fallbacks
	- Parallelism
		- LLM calls can be time consuming!
		- Any components that can be run in parallel are!
	- Logging is built in.
