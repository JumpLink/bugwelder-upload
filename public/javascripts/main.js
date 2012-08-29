//main.js

$('#inputFile').on('change', function() {
	var delimeter = ': ';
	var file = $('#inputFile').get(0).files[0];
	$('#fileInfo').show();
	$('#fileName').text(['Name', file.name].join(delimeter));
	$('#fileSize').text(['Größe', file.size].join(delimeter));
	$('#fileType').text(['Dateityp', file.type].join(delimeter));
});

$('#inputSubmit').on('click', function() {
	var fd = new FormData();
	fd.append('uploadingFile', $('#inputFile').get(0).files[0]);
	fd.append('date', (new Date()).toString()); // req.body.date
	//fd.append('comment', 'This is a test.'); // req.body.comment

	var xhr = new XMLHttpRequest();
	xhr.upload.addEventListener("progress", uploadProgress, false);
	xhr.addEventListener("load", uploadComplete, false);
	xhr.addEventListener("error", uploadFailed, false);
	xhr.addEventListener("abort", uploadCanceled, false);
	//Neue Seite bei Upload oeffnen
	//xhr.open("POST", "/upload");
	xhr.open("POST", "");
	$('#progress').show();
	xhr.send(fd);
});

function uploadProgress(evt) {
	if(evt.lengthComputable) {
		var percentComplete = Math.round(evt.loaded * 100 / evt.total);
		var steps = $('#progress').width() / 100;
		$('#indicator').text(percentComplete.toString() + '%');
		$('#indicator').width(Math.round(percentComplete * steps));
	} else {
		$('#indicator').text('unable to compute');
	}
}

function uploadComplete(evt) {
	var file = $('#inputFile').get(0).files[0];
	//uploadProgress(evt);
	$('#progress').hide();
	$('#uploade_complete').show();
	//$('a.download').css('href', document.location.href	+ 'uploads/' + file.name)
	$('a.download').attr("href", document.location.href	+ 'uploads/' + file.name);
	$('a.download').text("download file") //
	//alert(evt.target.responseText);
}

function uploadFailed(evt) {
	alert("Es ist ein Fehler aufgetreten.");
}

function uploadCanceled(evt) {
	alert("Upload Abgebrochen! Der Upload wurde von Benutzer unterbrochen oder die Verbindung ist verloren gegangen.");
}