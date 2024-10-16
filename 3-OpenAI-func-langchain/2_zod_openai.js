import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

import { convertToOpenAIFunction } from '@langchain/core/utils/function_calling';

let model = new ChatOpenAI();

const weatherSearch = z.object({
	airportCode: z.string().describe('airport code to get weather for')
});


const weatherFunction = {
	name: 'weatherSearch',
	description: 'Call this with an airport code to get the weather at that airport',
	parameters: zodToJsonSchema(weatherSearch)
};

let functions = [weatherFunction];


// Let's examine the schema we just created
console.log(functions);


/*
// Now lets invoke this directly on the model
const result1 = await model.invoke('What is the weather in SF today?', {functions: functions});
console.log(result1);
*/


// We can bind the function to the model
const fModel = model.bind({functions: functions});  // Leave uncommented as we reuse this later!

/*
const result2 = await fModel.invoke('What is the weather in SF today?');
console.log(result2);
*/

/*
// We can force the function call
const ffModel = model.bind({
	functions: functions,
	function_call: {
		name: 'weatherSearch'
	}
});

const result3 = await ffModel.invoke('What is the weather in SF today?');
console.log(result3);

const result4 = await ffModel.invoke('Hi!');
console.log(result4);
*/

/*
// We can use this in a chain
const prompt = ChatPromptTemplate.fromMessages([
    ('system', 'You are a helpful assistant'),
    ('user', '{input}')
]);

const chain = prompt.pipe(fModel);

const result5 = await chain.invoke({'input': 'What is the weather in SF?'});
console.log(result5);
*/

/*
// We can also use multiple functions
const artistSearch = z.object({
	name: z.string().describe('name of artist to look up'),
	n: z.number().describe('number of results')
});

const artistFunction = {
	name: 'artistSearch',
	description: 'Call this to get the names of songs by a particular artist',
	parameters: zodToJsonSchema(artistSearch)
};

functions = [...functions, artistFunction];
const mfModel = model.bind({functions: functions});

const result6 = await mfModel.invoke('What is the weather in SF today?');
console.log(result6);

const result7 = await mfModel.invoke('What are three songs by Taylor Swift?');
console.log(result7);

const result8 = await mfModel.invoke('Hi!');
console.log(result8);
*/
