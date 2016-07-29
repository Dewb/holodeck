
var libraryData = {};

$(document).ready(function() {

	$.get('/data/library.txt', function (data, textStatus, jqXHR) {
		var lines = data.split('\n');
		var category = "";
		for (var i = 0; i < lines.length; i++) {
			if (lines[i] == "") {
				continue;
			} else if (lines[i].startsWith('# ')) {
				category = lines[i].slice(2);
				continue;
			}
			if (!(category in libraryData)) {
				libraryData[category] = [];
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

module.exports = {

	update: updateLibraryWidget

};