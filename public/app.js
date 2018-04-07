function addArticle(insertDiv, article){

	console.log("addArticle()");
	
	
	var articlePanel = $("<div>").attr({
		"data-id": article._id,
		"class": "panel panel-default"
	})

	
	var headingDiv = $("<div>").attr({
		"class": "panel-heading"
	})

	var title = $("<h3>").attr({
		"class": "panel-title"
	})

	title.text(article.title);

	headingDiv.append(title);

	
	var link = $("<div>").attr({
		"class": "panel-body"
	})

	link.text(article.link);

	
	articlePanel.append(headingDiv);
	articlePanel.append(link);

	$(insertDiv).prepend(articlePanel);
}


$(document).ready(function(){

	
	$.get("/scrape", function(data){
		console.log("get /scrape data: ", data);
	})

})

$("#scrapeButton").on("click", function(){
	console.log("scrapeButton")
	$.getJSON('/articles', function(data) {		
		
		for (var i = 0; i <= 5; i++){
			var currentArticle = data[i];
			addArticle("#articlesDiv", currentArticle);
		}
	});
})


$(document).on("click", "#noteButton", function(){
	var articlesID = $(this).attr("data-id");
	var noteTitle = $("#newTitleInput").val();
	var noteBody = $("#newBodyInput").val();

	$.ajax({
		method: "POST",
		url: "/articles/" + articleID,
		data: {
			title: noteTitle,
			body: noteBody
		}
	}).done(function(data){
		console.log(data);
		$("#noteDiv").empty();
	});
	$("#newTitleInput").val("");
	$("#newBodyInput").val("");
});