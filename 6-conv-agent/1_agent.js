import { ChatOpenAI } from '@langchain/openai';
import { convertToOpenAIFunction } from '@langchain/core/utils/function_calling';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { OpenAIFunctionsAgentOutputParser } from 'langchain/agents/openai/output_parser';
import { formatToOpenAIFunctionMessages } from 'langchain/agents/format_scratchpad';
import { RunnablePassthrough } from '@langchain/core/runnables';
import { getCurrentTemp } from '../5-tools-routing/2_current_temp_tool.js';
import { searchWikipedia } from '../5-tools-routing/3_search_wikipedia.js';

const tools = [getCurrentTemp, searchWikipedia];

const functions = tools.map(convertToOpenAIFunction);

const model = new ChatOpenAI({ temperature: 0 }).bind({functions: functions});

/*
const prompt1 = ChatPromptTemplate.fromMessages([
    ('system', 'You are helpful but sassy assistant'),
    ('user', '{input}')
]);

const chain1 = prompt1.pipe(model).pipe(new OpenAIFunctionsAgentOutputParser());

const result1 = await chain1.invoke({input: 'What is the weather in SF right now?'});
console.log(result1.tool);
console.log(result1.toolInput);
*/


const prompt2 = ChatPromptTemplate.fromMessages([
    ('system', 'You are helpful but sassy assistant'),
    ('user', '{input}'),
	new MessagesPlaceholder({variableName: 'agentScratchpad'})
]);

const chain2 = prompt2.pipe(model).pipe(new OpenAIFunctionsAgentOutputParser());

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

const agentChain = RunnablePassthrough.assign({
	agentScratchpad: x => formatToOpenAIFunctionMessages(x.agentScratchpad)
}).pipe(chain2);


async function runAgent(input) {
	let intermediateSteps = [];
	let result = null;

	while(true) {

		result = await agentChain.invoke({
			input: input,
			agentScratchpad: intermediateSteps  // We don't have to apply formatToOpenAIFunctionMessages as the RunnablePassthrough lambda does that for us
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

const result4 = await runAgent('What is the weather in SF?');
console.log(result4);
