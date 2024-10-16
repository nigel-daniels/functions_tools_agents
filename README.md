# Functions, Tools and Agents with LangChain
Test code for 'talking to your files' with the ChatGPT API. This is based on the DeepLearning.AI, [Functions, Tools and Agents with LangChain](https://learn.deeplearning.ai/courses/functions-tools-agents-langchain/) course. In this repository I have converted all of the examples from Python to JavaScript.
## New Langchain features covered
This course covers the following features and I have made notes based on the course presentation for each lesson and I've included any JavaScript specific set-up or changes.
- [OpenAI function calling](1-OpenAI-func/notes.md)
- [LangChain Expression Language (LCEL)](2-LCEL/notes.md)
- [OpenAI function calling in LangChain](3-OpenAI-func-langchain/notes.md)
- [Tagging and extraction using OpenAI function calling](4-Tagging-Extraction/notes.md)
- [Tools and Routing]()
- [Conversational Agent]()

## Set-Up
### API Key
If you want to try these out you will first need to setup your own ChatGPT secret key in your local environment. [Here](https://chatgpt.en.obiscr.com/blog/posts/2023/How-to-get-api-key/) is how you get a key. Once you have this put it in a local (server side) environment variable. For example in Mac OS, assuming you are using `zsh`, append the following to the file `.zshenv` in you own home directory:
```
export OPENAI_API_KEY='your_secret_key_value'
```
When you restart the shell or your machine the environment variable `OPENAI_API_KEY` will be in place.
### Node and JS
Before trying any of the exercises don't forget to run `npm install` in the `./function_tools_agents` directory to install the Node modules needed.

In each subdirectory you will find a `*.js` file and, sometimes, some supporting files. Each JS file contains multiple prompts.

In most cases the initial exercise is ready to run and the other exercises are commented out using the `\* ... *\` comment markers. In these cases the commented code blocks will have their own calls to the LLM. If you uncomment these blocks then be sure to comment out the last to calls above while you run that exercise, it will reduce run time and costs.
