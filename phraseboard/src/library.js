
var libraryData = {};

$(document).ready(function() {

	$.get('/data/library.txt', function (data, textStatus, jqXHR) {
		var lines = data.split('\n');
		var category = "";
		for (var i = 0; i < lines.length; i++) {
			if (lines[i].startsWith('# ')) {
				category = lines[i].slice(2);
				continue;
			}
			if (!(category in libraryData)) {
				libraryData[category] = [];
			}
			if (lines[i] == "" && libraryData[category].length == 0) {
				continue;
			}
			libraryData[category].push(lines[i]);
		}

		if (localStorage["libraryCustomContent"] != null) {
    	 	libraryData["Custom"] = JSON.parse(localStorage["libraryCustomContent"]);
    	} 

    	updateLibraryWidget();

    	$(document).on('click', '.libraryCategory', function(e) {
			selectCategory(e.target.innerText);
    	});

    	selectCategory("Opening");
    });

});

var selectCategory = function(categoryName) {
	$('.libraryCategory').removeClass("selectedCategory");
	$('.libraryCategory:contains(' + categoryName + ')').addClass("selectedCategory");

	$('#libraryPhraseList').empty();
	$.each(libraryData[categoryName], function (index, phrase) {
		$('#libraryPhraseList').append('<span class="phrase">' + phrase + '</span><br>');
	});
}

var updateLibraryWidget = function() {
	var categories = Object.keys(libraryData);
	$('#libraryCategories').empty();
	$.each(categories, function(index, categoryName) {
		$('#libraryCategories').append('<li class="libraryCategory">' + categoryName + '</li>');
	});
};

var addToLibrary = function(newPhrase) {
	if (!("Custom" in libraryData)) {
		libraryData["Custom"] = [];
	}
	if ($.inArray(newPhrase, libraryData["Custom"]) == -1) {
		libraryData["Custom"].push(newPhrase);
		localStorage["libraryCustomContent"] = JSON.stringify(libraryData["Custom"]);
	}

	if ($('.libraryCategory:contains(Custom)').hasClass("selectedCategory")) {
		selectCategory("Custom");
	}
}

module.exports = {

	update: updateLibraryWidget,
	addToLibrary: addToLibrary

};