import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { JsonOutputFunctionsParser, JsonKeyOutputFunctionsParser } from 'langchain/output_parsers';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { RunnableLambda } from '@langchain/core/runnables';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio';

const loader = new CheerioWebBaseLoader('https://lilianweng.github.io/posts/2023-06-23-agent');
const documents = await loader.load();

const doc = documents[0];
const pageContent = doc.pageContent.slice(1000, 11000); // Trim some embedded code off from the front
console.log(pageContent);
/*
const overview = z.object({
	summary: z.string().describe('Provide a concise summary of the content.'),
	language: z.string().describe('Provide the language that the content is written in.'),
	keywords: z.string().describe('Provide keywords related to the content.')
});

const overviewFunction = {
	name: 'Overview',
	description: 'Overview of a section of text.',
	parameters: zodToJsonSchema(overview)
};

const functions1 = [overviewFunction];

let model = new ChatOpenAI({temperature: 0});
model = model.bind({
	functions: functions1,
	function_call: {
		name: 'Overview'
	}
});


const prompt1 = ChatPromptTemplate.fromMessages([
    ('system', 'Extract the relevant information, if not explicitly provided do not guess. Extract partial info'),
    ('human', '{input}')
]);


// Here we use the model and function with the extraction prompt we used before
const chain1 = prompt1.pipe(model).pipe(new JsonOutputFunctionsParser());

const result1 = await chain1.invoke({'input': pageContent});
console.log(result1);
*/

// Now lets set this up to extract papers mentioned within the article
// We set this up to return an array 'papers' bu then use the JSON key output
// parser to extract the content of that array
const paper = z.object({
	title: z.string(),
	author: z.string().optional()
});

const papers = z.object({
	papers: z.array(paper).describe('Information about papers mentioned.')
});

const informationFunction = {
	name: 'Info',
	description: 'Information to extract.',
	parameters: zodToJsonSchema(papers)
};

const functions2 = [informationFunction];
model = model.bind({
	functions: functions2,
	function_call: {
		name: 'Info'
	}
});

/*
const chain2 = prompt1.pipe(model).pipe(new JsonKeyOutputFunctionsParser({attrName: 'papers'}));

const result2 = await chain2.invoke({'input': pageContent});
console.log(result2); // Here we can see it picks up the title and author of the actual article
*/

// Here we rewrite the prompt to ensure we look inside the article
const template = 'An article will be passed to you. Extract from it all papers that are mentioned by this article.\n\n' +
	'Do not extract the name of the article itself. If no papers are mentioned that\'s fine - you don\'t need to extract any! Just return an empty list.\n\n' +
	'Do not make up or guess ANY extra information. Only extract what exactly is in the text.';

const prompt2 = ChatPromptTemplate.fromMessages([
    ('system', template),
    ('human', '{input}')
]);

const chain2 = prompt2.pipe(model).pipe(new JsonKeyOutputFunctionsParser({attrName: 'papers'}));

/*
const result3 = await chain2.invoke({'input': pageContent});
console.log(result3); // Now we get way better results


const result4 = await chain2.invoke({'input': 'Hi!'});
console.log(result4); // This just sanity checks were working ok
*/
/*
// But what if we want to handle the entire article? It's too long
const textSplitter = new RecursiveCharacterTextSplitter({chunkOverlap: 0});
const splits = await textSplitter.splitText(doc.pageContent);

console.log(splits.length);

// Were going to need to transfrom an array of arrays into a single list
console.log(flatten([[1,2],[3,4]]));

// Now we need to wrap a function in a runnable
const prep = new RunnableLambda({func: async doc => {
	let result = [];
	const splits = await textSplitter.splitText(doc);
	splits.forEach(split => result = [...result, {input: split}]);
	return result;
}});

// Check the lambda works
const result5 = await prep.invoke('Hi!');
console.log(result5);

const chain3 = prep.pipe(chain2.map()).pipe(flatten);

const result6 = await chain3.invoke(doc.pageContent);
console.log(result6);

// Helper funtion to turn a matrix of arrays into a single array
function flatten(matrix) {
	let result = [];
	matrix.forEach(row => row.forEach(element => result = [...result, element]));
	return result;
}
*/
