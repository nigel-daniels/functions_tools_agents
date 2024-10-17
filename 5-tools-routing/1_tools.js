import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const searchInput = z.object({
	query: z.string().describe('Thing to search for')
});

const searchWeather = tool(
	async (query) => new Promise(
		(resolve, reject) => {
			setTimeout(() => {resolve('5.5 C');}, 250);
		}
	),
	{
		name: 'searchWeather',
		description: 'Search for the weather online.',
		schema: zodToJsonSchema(searchInput)
	}
);

console.log(searchWeather.name);
console.log(searchWeather.description);

const result1 = await searchWeather.invoke({query: 'SF'});
console.log(result1);
