import { ChatOpenAI } from '@langchain/openai';
import { convertToOpenAIFunction } from '@langchain/core/utils/function_calling';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

const getCurrentTempInput = z.object({
	latitude: z.number().describe('Latitude of the location to fetch weather data for'),
	longitude: z.number().describe('Longitude of the location to fetch weather data for')
});

// Note in JS if we want more than a single input we cannot use the 'tool'
// convinence as it returns a StructuredTool that expects a single input.
// In this case we need the DynamicStructuredTool
export const getCurrentTemp = new DynamicStructuredTool({
	name: 'getCurrentTemp',
	description: 'Fetch current temperature for given coordinates.',
	schema: getCurrentTempInput,
	func: async ({latitude, longitude}) => new Promise(
		async (resolve, reject) => {
			const BASE_URL = 'https://api.open-meteo.com/v1/forecast?';
			const params = {
				latitude: latitude,
				longitude: longitude,
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
	)
});

/*
// Comment these out after use to reuse this tool later
const currentTempFunc = convertToOpenAIFunction(getCurrentTemp);
console.log(currentTempFunc);

const result = await getCurrentTemp.invoke({latitude: 13, longitude: 14});
console.log(result);
*/
