function handleFiles(files) {
	// Check for the various File API support.
	if (window.FileReader) {
		// FileReader are supported.
		getAsText(files[0]);
	} else {
		alert('FileReader are not supported in this browser.');
	}
}

function getAsText(fileToRead) {
	var reader = new FileReader();
	// Handle errors load
	reader.onload = loadHandler;
	reader.onerror = errorHandler;
	// Read file into memory as UTF-8      
	reader.readAsText(fileToRead);
}

function loadHandler(event) {
	var csv = event.target.result;
	processData(csv);
}

function processData(csv) {
	var allTextLines = csv.split(/\r\n|\n/);
	var lines = [];
	while (allTextLines.length) {
		lines.push(allTextLines.shift().split(','));
	}
	console.log(lines);
	drawOutput(lines);
}

//if your csv file contains the column names as the first line
function processDataAsObj(csv) {
	var allTextLines = csv.split(/\r\n|\n/);
	var lines = [];

	//first line of csv
	var keys = allTextLines.shift().split(',');

	while (allTextLines.length) {
		var arr = allTextLines.shift().split(',');
		var obj = {};
		for (var i = 0; i < keys.length; i++) {
			obj[keys[i]] = arr[i];
		}
		lines.push(obj);
	}
	console.log(lines);
	drawOutputAsObj(lines);
}

function errorHandler(evt) {
	if (evt.target.error.name == "NotReadableError") {
		alert("Can't read file !");
	}
}

function drawOutput(lines) {
	window.userData = lines;

	//Clear previous data
	document.getElementById("output").innerHTML = "";
	var table = document.createElement("table");
	table.setAttribute("id", "customers");
	for (var i = 0; i < lines.length; i++) {
		var row = table.insertRow(-1);
		for (var j = 0; j < lines[i].length; j++) {
			var firstNameCell = row.insertCell(-1);
			firstNameCell.appendChild(document.createTextNode(lines[i][j]));
		}
	}
	document.getElementById("output").appendChild(table);
}

//draw the table, if first line contains heading
function drawOutputAsObj(lines) {
	window.userData = lines;

	//Clear previous data
	document.getElementById("output").innerHTML = "";
	var table = document.createElement("table");
	table.setAttribute("id", "customers");

	//for the table headings
	var tableHeader = table.insertRow(-1);
	Object.keys(lines[0]).forEach(function (key) {
		var el = document.createElement("TH");
		el.innerHTML = key;
		tableHeader.appendChild(el);
	});

	//the data
	for (var i = 0; i < lines.length; i++) {
		var row = table.insertRow(-1);
		Object.keys(lines[0]).forEach(function (key) {
			var data = row.insertCell(-1);
			data.appendChild(document.createTextNode(lines[i][key]));
		});
	}
	document.getElementById("output").appendChild(table);
}

//https://stackoverflow.com/questions/15547198/export-html-table-to-csv
function download_table_as_csv(table_id, separator = ',') {
	// Select rows from table_id
	var rows = document.querySelectorAll('table#' + table_id + ' tr');
	// Construct csv
	var csv = [];
	for (var i = 0; i < rows.length; i++) {
		var row = [], cols = rows[i].querySelectorAll('td, th');
		for (var j = 0; j < cols.length; j++) {
			// Clean innertext to remove multiple spaces and jumpline (break csv)
			var data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, '').replace(/(\s\s)/gm, ' ')
			// Escape double-quote with double-double-quote (see https://stackoverflow.com/questions/17808511/properly-escape-a-double-quote-in-csv)
			data = data.replace(/"/g, '""');
			// Push escaped string
			row.push('"' + data + '"');
		}
		csv.push(row.join(separator));
	}
	var csv_string = csv.join('\n');
	var universalBOM = "\uFEFF";
	// Download it
	var filename = 'export_' + table_id + '_' + new Date().toLocaleDateString() + '.csv';
	var link = document.createElement('a');
	link.style.display = 'none';
	link.setAttribute('target', '_blank');
	link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(universalBOM + csv_string));
	link.setAttribute('download', filename);
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

//https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
	for (var i = array.length - 1; i > 1; i--) {
		var j = Math.floor(Math.random() * (i + 1)) + 1;
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
}

var set = new Set();

function myFunction() {
	var quantity = document.getElementById("quantity").value;
	shuffle(window.userData);
	var lines = [];
	lines.push(window.userData[0]);
	var index = 1;
	while (lines.length <= quantity) {
		console.log(window.userData[index][3]);
		if (window.userData[index][3] !== undefined) {
			if (!window.set.has(window.userData[index][3])) {
				window.set.add(window.userData[index][3]);
				lines.push(window.userData[index]);
			}
		}
		index++;
		if (index === window.userData.length) {
			break;
		}
	}
	drawOutput(lines);
}