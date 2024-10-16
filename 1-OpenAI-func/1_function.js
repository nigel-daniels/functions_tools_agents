import OpenAI from 'openai';
import util from 'util';

// Set up an OpenAI model (Note the key is in our ENV)
const openai = new OpenAI({
	organization: 	'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
	project:		'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
});

openai.api_key = process.env.OPENAI_API_KEY;

// Now lets create a function that fakes a call to a weather API
function getCurrentWeather(location, unit='celsius') {
	const weatherInfo = {
		'location':		location,
		'temperature':	'25',
		'unit':			unit,
		'forecast':		['sunny', 'windy']
	};

	return weatherInfo;
}

// Here we define that function for OpenAI
const functions = [{
    'name': 'getCurrentWeather',
    'description': 'Get the current weather in a given location',
    'parameters': {
        'type': 'object',
        'properties': {
            'location': {
                'type': 'string',
                'description': 'The city and state, e.g. San Francisco, CA',
            },
            'unit': {'type': 'string', 'enum': ['celsius', 'fahrenheit']},
        },
        'required': ['location'],
    },
}];

// Now let's create a message history and call OpenAI
const messages = [{
    'role': 'user',
	'content': 'What\'s the weather like in Boston?'
}];


const response1 = await openai.chat.completions.create({
	'model': 'gpt-3.5-turbo',
	'messages': messages,
	'functions': functions
});

// Here we can see the response and the function call it suggested
console.log(response1);
console.log(response1.choices[0].message);

/*

// We can now extract the function name and use it and the parameters to call the function
const func = response1.choices[0].message.function_call.name;
const observation = eval(func).call(response1.choices[0].message.function_call.arguments);

// Now let's build our chat history by adding the response to the messages
messages.push(response1.choices[0].message);

// Here we add the response from the function, note the role is 'function'
messages.push({
        'role': 'function',
        'name': 'get_current_weather',
		'content': util.inspect(observation, false, null, false),
	});

// Let's take a quick look at our message history
console.log(messages);
*/

/*

// Now invoke OpenAI again to get a more human response to provide the user
const response2 = await openai.chat.completions.create({
	'model': 'gpt-3.5-turbo',
	'messages': messages,
	'functions': functions
});

console.log(response2);
console.log(response2.choices[0].message);
*/
