import { ChatOpenAI } from '@langchain/openai';
import { convertToOpenAIFunction } from '@langchain/core/utils/function_calling';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { OpenAIFunctionsAgentOutputParser } from 'langchain/agents/openai/output_parser';
import { formatToOpenAIFunctionMessages } from 'langchain/agents/format_scratchpad';
import { RunnablePassthrough } from '@langchain/core/runnables';
import { AgentExecutor } from 'langchain/agents';
import { BufferMemory } from 'langchain/memory';
import { getCurrentTemp } from '../5-tools-routing/2_current_temp_tool.js';
import { searchWikipedia } from '../5-tools-routing/3_search_wikipedia.js';

const tools = [getCurrentTemp, searchWikipedia];

const functions = tools.map(convertToOpenAIFunction);

const model = new ChatOpenAI({ temperature: 0 }).bind({functions: functions});


const prompt1 = ChatPromptTemplate.fromMessages([
    ('system', 'You are helpful but sassy assistant'),
    ('user', '{input}')
]);

const chain1 = prompt1.pipe(model).pipe(new OpenAIFunctionsAgentOutputParser());

const result1 = await chain1.invoke({input: 'What is the weather in SF right now?'});
console.log(result1.tool);
console.log(result1.toolInput);


/*
// These get used through a lot of the following exercises so leave these uncommented for the rest of the exercise
const prompt2 = ChatPromptTemplate.fromMessages([
    ('system', 'You are helpful but sassy assistant'),
    ('user', '{input}'),
	new MessagesPlaceholder({variableName: 'agentScratchpad'})
]);

const chain2 = prompt2.pipe(model).pipe(new OpenAIFunctionsAgentOutputParser());
*/

/*
const result2 = await chain2.invoke({
	input: 'What is the weather in SF right now?',
	agentScratchpad: []
});

console.log(result2.tool);

const observation = await getCurrentTemp.invoke(result2.toolInput);

console.log(observation);

console.log(result2.messageLog);

console.log(formatToOpenAIFunctionMessages([{action: result2, observation: observation}]));

const result3 = await chain2.invoke({
	input: 'What is the weather in SF right now?',
	agentScratchpad: formatToOpenAIFunctionMessages([{action: result2, observation: observation}])
});

console.log(result3);
*/

/*
async function runAgent1(input) {
	let intermediateSteps = [];
	let result = null;

	while(true) {

		result = await chain2.invoke({
			input: input,
			agentScratchpad: formatToOpenAIFunctionMessages(intermediateSteps)
		});

		if ('log' in result && 'returnValues' in result) { // These properties indicate this is an AgentFinish
			break;
		} else {
			const tool = {
				searchWikipedia: searchWikipedia,
				getCurrentTemp: getCurrentTemp
			}[result.tool];

			const observation = await tool.invoke(result.toolInput);
			intermediateSteps.push({action: result, observation: observation});
		}
	}

	return result;
}

const result4 = await runAgent1('What is the weather in SF?');
console.log(result4);
*/


/*
// Let's put all of the previous things together into an agent
const agentChain1 = RunnablePassthrough.assign({
	agentScratchpad: x => {console.log('agentChain2: ' + JSON.stringify(x)); formatToOpenAIFunctionMessages(x.intermediateSteps);}
}).pipe(chain2);

async function runAgent2(input) {
	let intermediateSteps = [];
	let result = null;

	while(true) {

		result = await agentChain1.invoke({
			input: input,
			intermediateSteps: intermediateSteps  // We don't have to apply formatToOpenAIFunctionMessages as the RunnablePassthrough lambda does that for us
		});

		if ('log' in result && 'returnValues' in result) { // These properties indicate this is an AgentFinish
			break;
		} else {
			const tool = {
				searchWikipedia: searchWikipedia,
				getCurrentTemp: getCurrentTemp
			}[result.tool];

			const observation = await tool.invoke(result.toolInput);
			intermediateSteps.push({action: result, observation: observation});
		}
	}

	return result;
}

const result5 = await runAgent2('What is the weather in SF?');
console.log(result5);
const result6 = await runAgent2('What is langchain?');
console.log(result6);
const result7 = await runAgent2('Hi!');
console.log(result7);

*/

/*
// The AgentExecutor is part of LangChain.JS that does the majority of what we just built
const agentChain2 = RunnablePassthrough.assign({
	agentScratchpad: x => formatToOpenAIFunctionMessages(x.steps) // In the final version the property name is simply steps
}).pipe(chain2);

const agent1 = new AgentExecutor({agent: agentChain2, tools: tools, verbose: true});

// This is very akin to how ChatGPT works
const result8 = await agent1.invoke({input: 'What is langchain?'});
console.log(result8);

// However there is not the ability to recall history for conversation
const result9 = await agent1.invoke({input: 'My name is Bob.'});
console.log(result9);

const result10 = await agent1.invoke({input: 'What is my name?'});
console.log(result10);
*/

/*
const prompt3 = ChatPromptTemplate.fromMessages([
    ('system', 'You are helpful but sassy assistant'),
	new MessagesPlaceholder({variableName: 'chatHistory'}),
    ('user', '{input}'),
	new MessagesPlaceholder({variableName: 'agentScratchpad'})
]);

const agentChain3 = RunnablePassthrough.assign({
	agentScratchpad: x => formatToOpenAIFunctionMessages(x.steps) // In the final version the property name is simply steps
}).pipe(prompt3).pipe(model).pipe(new OpenAIFunctionsAgentOutputParser());

const memory = new BufferMemory({returnMessages: true, memoryKey: 'chatHistory', outputKey: 'output'});

const agent2 = new AgentExecutor({agent: agentChain3, tools: tools, verbose: false, memory: memory});

const result11 = await agent2.invoke({input: 'My name is Bob.'});
console.log(result11);

const result12 = await agent2.invoke({input: 'What is my name?'});
console.log(result12);

const result13 = await agent2.invoke({input: 'What is the weather in SF?'});
console.log(result13);
*/
