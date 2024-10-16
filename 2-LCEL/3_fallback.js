import { OpenAI } from '@langchain/openai';
import { ChatOpenAI } from '@langchain/openai';
import { StringOutputParser } from '@langchain/core/output_parsers';

// Set up the prompt
const challenge = 'Write three poems in a JSON blob, where each poem is a JSON blob of a title, author, and first line.';

// Set up a basic model (underpowered)
const simpleModel = new OpenAI({
	temperature: 0,
	max_tokens: 1000,
	model: 'gpt-3.5-turbo-instruct'
});
const simpleChain = simpleModel.pipe(JSON.parse);

// Now lets set up a more capable model and build a new chain
const model = new ChatOpenAI({temperature: 0});
const chain = model.pipe(new StringOutputParser).pipe(JSON.parse);



// First we invoke the model to review the output, it's JSON like
const result1 = await simpleModel.invoke(challenge);
console.log(result1);

// Now we run the chain but the parsing will fail as it's not correct JSON
const result2 = await simpleChain.invoke(challenge);
console.log(result2);


/*

// This shows the more capable model will generate valid JSON
const result3 = await chain.invoke(challenge);
console.log(result3);
*/

/*

// In this case we use the simple model, but if it fails we have the more capable model as a backup
const finalChain = simpleChain.withFallbacks([chain]);

// Here we can see the output is from the more capable model
const result4 = await finalChain.invoke(challenge);
console.log(result4);
*/
