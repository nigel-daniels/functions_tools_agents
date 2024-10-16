import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { JsonOutputFunctionsParser } from 'langchain/output_parsers';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// First let's describe an array of people objects and add it to the function
const person = z.object({
	name: z.string().describe('person\'s name'),
	age: z.number().describe('person\'s age')
});

const people = z.object({
	people: z.array(person).describe('List of info about people')
});

const information = {
	name: 'information',
	description: 'Information to extract.',
	parameters: zodToJsonSchema(people)
};

// Now let's create a chat model and bind the function to it
let functions = [information];

let model = new ChatOpenAI({temperature: 0});
model = model.bind({
	functions: functions,
	function_call: {
		name: 'information'
	}
});


// Here it attempts to create an age for Martha
const result1 = await model.invoke('Joe is 30, his mom is Martha.');
console.log(result1);


const prompt = ChatPromptTemplate.fromMessages([
    ('system', 'Extract the relevant information, if not explicitly provided do not guess. Extract partial info'),
    ('human', '{input}')
]);

/*
// In this case we can remove the age
const chain1 = prompt.pipe(model);

const result2 = await chain1.invoke({'input': 'Joe is 30, his mom is Martha'});
console.log(result2);
*/

/*
// In this final exaple we are simply adding in the output parser to get a well formatted result
const chain2 = prompt.pipe(model).pipe(new JsonOutputFunctionsParser());

const result3 = await chain2.invoke({'input': 'Joe is 30, his mom is Martha'});
console.log(result3);
*/
