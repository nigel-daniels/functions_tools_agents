import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { RunnableMap, RunnableLambda } from '@langchain/core/runnables';

// Set up the model we will use
const model = new ChatOpenAI();
const outputParser = new StringOutputParser();

// Set up the vector store and create a retriever for later use
const vectorStore = await MemoryVectorStore.fromTexts(
    ['harrison worked at kensho', 'bears like to eat honey'],
	[1, 2],
	new OpenAIEmbeddings()
);
const retriever = vectorStore.asRetriever();


// Simple chat prompt template that demonstrates how we can pipe in LCEL
const prompt1 = ChatPromptTemplate.fromTemplate(
	'Tell me a short joke about {topic}'
);

const chain1 = prompt1.pipe(model).pipe(outputParser);

const result1 = await chain1.invoke({'topic': 'bears'});

console.log(result1);


/*

// These calls to the retrieve just demonstrate the sequence of docs we get is being determined by the prompt
const doc1 = await retriever.invoke('Where did Harrison work?');
console.log(doc1);

const doc2 = await retriever.invoke('What do bears like to eat?');
console.log(doc2);
*/

/*

// Here we use a runnable map with lambdas that embed the retriever and then filter the response using template2
const template2 = 'Answer the question based only on the following context:\n{context}\n\nQuestion: {question}';
const prompt2 = ChatPromptTemplate.fromTemplate(template2);

const chain2 =  RunnableMap.from({
	'context': new RunnableLambda({func: async input => {
		console.log(input);
		const docs = await retriever.invoke(input.question);
		return docs;
		}
	}),
	'question': new RunnableLambda({func: input => input})
})
.pipe(prompt2)
.pipe(model)
.pipe(outputParser);

const result2 = await chain2.invoke({'question': 'Where did Harrison work?'});
console.log(result2);
*/

/*

// This just demonstrates  how the runnable map sets up the inputs for prompt2
const inputs = RunnableMap.from({
	'context': new RunnableLambda({func: async input => {
		console.log(input);
		const docs = await retriever.invoke(input.question);
		return docs;
		}
	}),
	'question': new RunnableLambda({func: input => input})
});

const result3 = await inputs.invoke({'question': 'where did harrison work?'});
console.log(result3);
*/
