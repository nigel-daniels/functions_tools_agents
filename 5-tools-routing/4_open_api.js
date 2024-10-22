import { ChatOpenAI } from '@langchain/openai';
import { JsonSpec, DynamicStructuredTool } from 'langchain/tools';
import { createOpenAPIChain } from 'langchain/chains';
import { OpenApiToolkit } from 'langchain/agents/toolkits';
import { convertToOpenAIFunction } from '@langchain/core/utils/function_calling';
import * as fs from 'fs';

// Note there is no direct equivalent of the `openapi_spec_to_openai_fn` method
// This section currently fails to function in LangChain.JS
let model = new ChatOpenAI({
  temperature: 0
});

// Read the spec as a string
const petYaml = fs.readFileSync('./petstore.yaml', 'utf8');

// This is an attempt to load the spec as a chain however it does not appear to return a valid chain
const petChain = createOpenAPIChain(petYaml);
const petTool = new DynamicStructuredTool(petChain);
const petFunc = convertToOpenAIFunction(petTool);

// For some reason this resolves to an empty schema
console.log(petFunc);

model = model.bind({functions: [petFunc]});

// This invoke fails with 'TypeError: promptValue.toChatMessages is not a function' due to the schema
const result = await model.invoke({input: 'What are three pets names?'});
console.log(result);
