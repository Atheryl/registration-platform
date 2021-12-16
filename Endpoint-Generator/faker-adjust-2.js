var faker = require('faker');
var https = require('follow-redirects').https;
var fs = require('fs');

const countries = require('./countrySelect.js');
const countriesGPS = require('./countrySelectGPS.js');

ageRange = [
	'-18',
	'18-21',
	'22-25',
	'30-35',
	'36-45',
	'46+'
];

platform = [
	'Computer Windows',
	'Computer Linux',
	'Computer MacOs',
	'Console Xbox',
	'Console Playstation',
	'Console Nintendo'
]


var options = {
  'method': 'POST',
  'hostname': 'lh4uiejvv2.execute-api.ap-southeast-1.amazonaws.com',
  'path': '/v1_0_0/register',
  'headers': {
    'Content-Type': 'text/plain'
  },
  'maxRedirects': 20
};

async function register() {
	while (true) {
		var req = https.request(options, function (res) {
		var chunks = [];

		res.on("data", function (chunk) {
		    chunks.push(chunk);
		  });

		  res.on("end", function (chunk) {
		    var body = Buffer.concat(chunks);
		    console.log(body.toString());
		  });

		  res.on("error", function (error) {
		    console.error(error);
		  });
		});

		var countryCode = faker.address.countryCode();
		if (!countriesGPS.hasOwnProperty(countryCode)) {
			continue;
		}

		var index = faker.random.number({'min': 0, 'max': 245})

		var utcSeconds = Date.now() / 1000;
		var timestamp = new Date(0);
		timestamp.setUTCSeconds(utcSeconds);

		var postData = JSON.stringify({
			'nickname': faker.name.findName().replace(/\s/g, ''),
			'email': faker.internet.email(),
			'country': countries[index].n,
			'countryIso': countries[index].i.toUpperCase(),
			'countryLat': countriesGPS[countryCode]['latitude'],
			'countryLng': countriesGPS[countryCode]['longitude'],
			'age': ageRange[faker.random.number({'min': 1, 'max': 2})],
			'platform': platform[faker.random.number({'min': 0, 'max': 2})],
			'source': "beta-form-bot",
			'utcSeconds': utcSeconds,
			'simpleDate': timestamp.getMonth() + 1 + '-' + timestamp.getDate() + '-' + timestamp.getFullYear(),
			'optTimestamp': timestamp.toString()
		});

		req.write(postData);

		req.end();

		await new Promise(done => setTimeout(() => done(), faker.random.number({'min': 0, 'max': 3}) * 1000));  
	}
}

register();




