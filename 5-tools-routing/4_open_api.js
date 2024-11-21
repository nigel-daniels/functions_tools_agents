import { ChatOpenAI } from '@langchain/openai';
import { createOpenAPIChain } from 'langchain/chains';
import * as fs from 'fs';

// Note there is no direct equivalent of the `openapi_spec_to_openai_fn` method
// This section currently fails to function in LangChain.JS
let model = new ChatOpenAI({
	model: 'gpt-3.5-turbo',
	temperature: 0
});

// Read the spec as a string
const petYaml = fs.readFileSync('./petstore.yaml', 'utf8');

const petChain = await createOpenAPIChain(petYaml, {llm: model});

const result = await petChain.invoke({query: 'What are three pets names?'});
console.log(result);
