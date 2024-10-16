import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';

// Let's set up a function definition and a prompt we can use
let functions = [{
	'name': 'weatherSearch',
	'description': 'Search for weather given an airport code',
	'parameters': {
		'type': 'object',
		'properties': {
			'airportCode': {
				'type': 'string',
				'description': 'The airport code to get the weather for'
			},
		},
		'required': ['airportCode']
		}
	}];

const  prompt = ChatPromptTemplate.fromMessages([
    ('human', '{input}')
	]);

// Now lets bind the function description to a model and create a runnable
// Note we are using let as we need to update these later
let model = new ChatOpenAI({temperature: 0}).bind({functions: functions});

let runnable = prompt.pipe(model);


// This first test shows we can correctly get the function invokation set up
const result1 = await runnable.invoke({'input': 'What is the weather in SF?'});
console.log(result1);

/*

// Now let's add a new function to our existing functions
functions = [
	...functions,
	{
	'name': 'sportsSearch',
	'description': 'Search for news of recent sport events',
	'parameters': {
		'type': 'object',
		'properties': {
			'teamName': {
				'type': 'string',
				'description': 'The sports team to search for'
			},
		},
		'required': ['teamName']
		}
	}];

// Reset the model and the prompt with this new functions defintion
model = model.bind({functions: functions});
runnable = prompt.pipe(model);

// Finally let's test this with a new prompt that should invoke a different function
const result2 = await runnable.invoke({'input': 'How did the Patriots do yesterday?'});
console.log(result2);
*/
