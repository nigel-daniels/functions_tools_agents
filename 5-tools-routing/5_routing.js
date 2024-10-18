import { ChatOpenAI } from '@langchain/openai';
import { convertToOpenAIFunction } from '@langchain/core/utils/function_calling';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { OpenAIFunctionsAgentOutputParser } from 'langchain/agents/openai/output_parser';
import { getCurrentTemp } from './2_current_temp_tool.js';
import { searchWikipedia } from './3_search_wikipedia.js';

const getTempFunc = convertToOpenAIFunction(getCurrentTemp);
const searchWikiFunc = convertToOpenAIFunction(searchWikipedia);
const functions = [getTempFunc, searchWikiFunc];

const model = new ChatOpenAI({ temperature: 0 }).bind({functions: functions});

const prompt = ChatPromptTemplate.fromMessages([
    ('system', 'You are helpful but sassy assistant'),
    ('user', '{input}'),
]);


const result1 = await model.invoke('What is the weather in SF right now?');
console.log(result1);

const result2 = await model.invoke('What is langchain?');
console.log(result2);



/*
const chain1 = prompt.pipe(model);

const result3 = await chain1.invoke({input: 'What is the weather in SF right now?'});
console.log(result3);
*/

/*
const chain2 = prompt.pipe(model).pipe(new OpenAIFunctionsAgentOutputParser());

const result4 = await chain2.invoke({input: 'What is the weather in SF right now?'});
console.log(result4.tool);
console.log(result4.toolInput);

const result5 = await getCurrentTemp.invoke(result4.toolInput);
console.log(result5);

const result6 = await chain2.invoke({input: 'Hi!'});
console.log(result6.returnValues);
*/

/*
// Here is a routing function
async function route(result) {
    if (result.tool) {
		const tools = {
            'searchWikipedia': searchWikipedia,
            'getCurrentTemp': getCurrentTemp,
        };
		return await eval(result.tool).invoke(result.toolInput);
    } else {
        return result.returnValues.output;
    }
}

const chain3 = prompt.pipe(model).pipe(new OpenAIFunctionsAgentOutputParser()).pipe(route);


const result7 = await chain3.invoke({input: 'What is the weather in SF right now?'});
console.log(result7);

const result8 = await chain3.invoke({input: 'What is langchain?'});
console.log(result8);

const result9 = await chain3.invoke({input: 'Hi!'});
console.log(result9);
*/
