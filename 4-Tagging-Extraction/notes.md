# Tagging and Extraction
## Tagging
- LLMs, provided function descriptions, can determine appropriate arguments and generate a structured function call as output.
- More generally, LLMs _evaluate_ the input text and generate structured output.

```
|------\
|~~~~~~|      -------      { ...,
|~~~~~~|---->|  LLM  |---->  sentiment: 'positive',
|~~~~~~|      -------        language: 'Spanish',     
|______|         ^          ... }   
                 |
             structure
            description
```

## Extraction
- When given a JSON input schema, the LLM has been fine tuned to find and fill in the parameters of that schema.
- The capability is not limited to a function schema.
- This can be used for general purpose extraction.


```
|------\                   [{ ...,
|~~~~~~|      -------         first_name: 'LangChain',
|~~~~~~|---->|  LLM  |---->   last_name: 'JS',
|~~~~~~|      -------         language: 'JavaScript',     
|______|         ^            ... },   
                 |          ...
             structure     ]
            description
```

## Note
To follow the third example you will need to install the `Cheerio` web page loader and the `Langchain.JS` community code to use it:
```
npm install @langchain/community cheerio
```
