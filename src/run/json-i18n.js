// extract strings from ACF field groups and save them to src/php/acf.php

const glob = require('glob');
const xt = require('./lib/json-extract.js');

let textdomain = process.argv[2] || 'mcguffin';


const strings = [];

const common_mapping = {
	title:xt.map_string,
	description:xt.map_string,
	label:xt.map_string,
	labels:xt.map_values,
}

const acf_mapping = {
	title:xt.map_string,
	description:xt.map_string,
	label:xt.map_string,
	instructions:xt.map_string,
	prepend:xt.map_string,
	append:xt.map_string,
	message:xt.map_string,
	choices:xt.map_values
}


// acf
strings = xt.parse_files( glob.sync('./json/section-types.json'), common_mapping, strings);
strings = xt.parse_files( glob.sync('./json/post-type/*.json'), common_mapping, strings);
strings = xt.parse_files( glob.sync('./json/taxonomy/*.json'), common_mapping, strings);

// acf
strings = xt.parse_files( glob.sync('./json/acf/*.json'), acf_mapping, strings);

xt.generate_php('./src/php/json-strings.php',strings,textdomain);
