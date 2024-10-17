import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import wikipedia from 'wikipedia';
import { formatToOpenAITool } from 'langchain/tools';

const searchInput = z.object({
	query: z.string()
});

export const SearchWikipedia = tool(
	async (input) => new Promise(
		async (resolve, reject) => {
			const pageTitles = await wikipedia.search(input.query);
			let summaries = [];

			for (const pageTitle of pageTitles.results.slice(0, 3)) {
				try {
					const page = await wikipedia.page(pageTitle.title, {autoSuggest: false});
					//console.log(page);
					const summary = await page.summary();
					//console.log(summary);
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
	),
	{
		name: 'SearchWikipedia',
		description: 'Run Wikipedia search and get page summaries.',
		schema: zodToJsonSchema(searchInput)
	}
);

const result1 = await SearchWikipedia.invoke({query: 'langchain'});
console.log(result1);
