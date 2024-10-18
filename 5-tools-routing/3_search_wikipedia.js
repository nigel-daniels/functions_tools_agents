import { DynamicStructuredTool } from '@langchain/core/tools';
import { convertToOpenAIFunction } from '@langchain/core/utils/function_calling';
import { z } from 'zod';
import wikipedia from 'wikipedia';

const searchInput = z.object({
	query: z.string()
});

export const searchWikipedia = new DynamicStructuredTool ({
	name: 'searchWikipedia',
	description: 'Run Wikipedia search and get page summaries.',
	schema: searchInput,
	func: async ({query}) => new Promise(
		async (resolve, reject) => {
			const pageTitles = await wikipedia.search(query);
			let summaries = [];

			for (const pageTitle of pageTitles.results.slice(0, 3)) {
				try {
					const page = await wikipedia.page(pageTitle.title, {autoSuggest: false});
					const summary = await page.summary();
					summaries = [...summaries, 'Page: ' + summary.title +'\nSummary: ' +summary.extract];
				} catch (e) {
					reject(e.message);
				}
			}

			if (summaries.length > 0) {
				resolve(summaries.join('\n\n'));
			} else {
				resolve('No good Wikipedia Search Result was found.');
			}
		}
	)
});

/*
// Comment these out after use to reuse this tool later
const searchWikipediaFunc = convertToOpenAIFunction(searchWikipedia);
console.log(searchWikipediaFunc);

const result1 = await searchWikipedia.invoke({query: 'langchain'});
console.log(result1);
*/
