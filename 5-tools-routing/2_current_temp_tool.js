import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { formatToOpenAITool } from 'langchain/tools';

const openMeteoInput = z.object({
	latitude: z.number().describe('Latitude of the location to fetch weather data for'),
	longitude: z.number().describe('Longitude of the location to fetch weather data for')
});


export const CurrentTemp = tool(
	async (input) => new Promise(
		async (resolve, reject) => {
			const BASE_URL = 'https://api.open-meteo.com/v1/forecast?';
			const params = {
				latitude: input.latitude,
				longitude: input.longitude,
        		hourly: 'temperature_2m',
        		forecast_days: 1
			};
			let results = '';

			const response = await fetch(BASE_URL + new URLSearchParams(params).toString());

			if (response.status == 200) {
				results = await response.json();
			} else {
				reject('API Request failed with status code: ' + response.status_code);
			}

			const currentUtcTime = new Date();

			const timeList = results.hourly.time.map(timeStr => new Date(timeStr.replace('Z', '+00:00')));
			const temperatureList = results.hourly.temperature_2m;

			const closestTimeIndex = timeList.reduce((closestIndex, currentTime, index) => {
    			const timeDifference = Math.abs(currentTime - currentUtcTime);
    			const closestDifference = Math.abs(timeList[closestIndex] - currentUtcTime);
    			return timeDifference < closestDifference ? index : closestIndex;
			}, 0);

			const currentTemperature = temperatureList[closestTimeIndex];

			resolve('The current temperature is ' + currentTemperature + '°C');
		}
	),
	{
		name: 'CurrentTemp',
		description: 'Fetch current temperature for given coordinates.',
		schema: zodToJsonSchema(openMeteoInput)
	}
);

const openAiJson = formatToOpenAITool(CurrentTemp);
console.log(openAiJson);

const result1 = await CurrentTemp.invoke({latitude: 13, longitude: 14});
console.log(result1);
