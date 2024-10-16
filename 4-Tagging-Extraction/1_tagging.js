import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { JsonOutputFunctionsParser } from 'langchain/output_parsers';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const taggingResult = z.object({
	sentiment: z.string().describe('sentiment of text, should be `pos`, `neg`, or `neutral`'),
	language: z.string().describe('language of text (should be ISO 639-1 code)')
});

const tagging = {
	name: 'tagging',
	description: 'Tag the piece of text with particular info.',
	parameters: zodToJsonSchema(taggingResult)
};

let functions = [tagging];

let model = new ChatOpenAI({temperature: 0});

const prompt = ChatPromptTemplate.fromMessages([
    ("system", "Think carefully, and then tag the text as instructed"),
    ("user", "{input}")
]);

model = model.bind({
	functions: functions,
	function_call: {
		name: 'tagging'
	}
});

const chain1 = prompt.pipe(model);

// Now lets invoke this chain
const result1 = await chain1.invoke({'input': 'I love langchain.'});
console.log(result1);

const result2 = await chain1.invoke({'input': 'Non mi piace questo cibo.'});
console.log(result2);

/*
// This just demonstrates we can tidy our results up a lot
const chain2 = prompt.pipe(model).pipe(new JsonOutputFunctionsParser());

const result3 = await chain2.invoke({'input': 'Non mi piace questo cibo.'});
console.log(result3);
*/
