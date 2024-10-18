import { ChatOpenAI } from '@langchain/openai';
import { JsonSpec, DynamicStructuredTool } from 'langchain/tools';
import { createOpenAPIChain } from 'langchain/chains';
import { OpenApiToolkit } from 'langchain/agents/toolkits';
import { convertToOpenAIFunction } from '@langchain/core/utils/function_calling';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

// Note there is no direct equivalent of the `openapi_spec_to_openai_fn` method
let model = new ChatOpenAI({
  temperature: 0
});

const petYaml =  fs.readFileSync('./petstore.yaml', 'utf8');
const peteObj = yaml.load(petYaml);
const petSpec = new JsonSpec(peteObj);

const petChain = createOpenAPIChain(petSpec);
const petTool = new DynamicStructuredTool(petChain);
const petFunc = convertToOpenAIFunction(petTool);

// For some reason this resolves to an empty schema
console.log(petFunc);

model = model.bind({functions: [petFunc]});

// This invoke fails with 'TypeError: promptValue.toChatMessages is not a function' due to the schema
const result = await model.invoke({input: 'What are three pets names?'});
console.log(result);
