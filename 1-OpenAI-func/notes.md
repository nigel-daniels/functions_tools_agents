# OpenAI function calling

Added to `gpt-3.5-turbo-0613` and `gpt-4-0613`:
- Accept additional args so users can describe functions
- If it is relevant, return the function to us and a JSON object with the appropriate input parameters.

## Notes
The function call descriptions count towards our token limit.
The new 'function' message allows us to return the function calls response and get the LLM to produce a more readable result.

We need to install `OpenAI`

```
npm install openai
```
