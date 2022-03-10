window.onload = () => populateHTML(json);

let json = `[
	{
		"name": "container1",
		"elements": [
			{
				"content": "ele1",
				"dueDate": "",
				"created": "2022-03-10"
			},
			{
				"content": "ele2",
				"dueDate": "",
				"created": "2022-03-10"
			}
		]
	},
	{
		"name": "container2",
		"elements": [
			{
				"content": "ele1",
				"dueDate": "",
				"created": "2022-03-10"
			},
			{
				"content": "ele2",
				"dueDate": "",
				"created": "2022-03-10"
			}
		]
	}
]`;

function populateHTML(json) {
	let json2 = JSON.parse(json);
	
	for (let i = 0; i < json2.length; ++i) {
		console.log(json2[i]);
		console.log(json2[i]["name"]);
	}
}