import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

// Set up the model we will use
const model = new ChatOpenAI();
const outputParser = new StringOutputParser();

// Set up a prompt and a chain (we saw this in the first exercise)
const prompt = ChatPromptTemplate.fromTemplate(
	'Tell me a short joke about {topic}'
);
const chain = prompt.pipe(model).pipe(outputParser);

/*

// We've also see this basic invoke before
const result1 = await chain.invoke({'topic': 'bears'});
console.log(result1);
*/

/*

// We can batch the invokations (they will run in parrallel if possible)
const result2 = await chain.batch([{'topic': 'bears'}, {'topic': 'frogs'}]);
console.log(result2);
*/

/*

// We can also stream our responses
const stream = await chain.stream({'topic': 'bears'});

for await (const chunk of stream) {
	console.log(chunk);
}
*/
