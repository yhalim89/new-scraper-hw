var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var request = require('request'); 
var cheerio = require('cheerio');
var express = require('express');
var app = express();


var Article = require("./models/Headline.js");
var Comment = require("./models/Note.js");


app.use(bodyParser.urlencoded({
  extended: false
}));


app.use(express.static('public'));


mongoose.connect('mongodb://localhost/scrapeGoose');
var db = mongoose.connection;


db.on("error", function(error){
	console.log("Mongoose error: ", error);
});


db.once("open", function(){
	console.log("Connected")
});



app.get('/', function(request, response) {
  res.send(index.html);
});


app.get("/scrape", function(req, res){
	console.log("scrape");
	var url = "http://www.nytimes.com/articles/";
	request(url, function (error, response, html) {
		if(error){
			throw error;
		}

		
		var $ = cheerio.load(html);

		
		$("h2.post-title").children().each(function (i, element){
			var title = $(element).text().trim();
			var link = $(element).attr("href");

			var result = {
			    title: title,
			    link: link
			};

				Article.find({link: result.link}, function(error, articleArr){
				
				if(articleArr.length){
					console.log("Article skipped: ", articleArr)
				}
				else{
				  	var scrapedArticle = new Article(result);
				  	scrapedArticle.save(function(error, doc){
				  		if (error){
				  			console.log("error: ", error);
				  		}else{
				  			console.log("article scraped:", doc);
				  		}
				  	});
				}
			})
		});
		
	});
})


app.get("/articles", function(request, response){
	Article.find({}, function(error, doc){
		if(error){
			console.log(error);
		}else{
			response.json(doc);
		}
	});
});


app.get("/articles/:id", function(request, response){
	
	Article.findOne({"_id": request.params.id})
	
	.populate("comment")
	
	.exec(function(error, doc){
		if(error){
			console.log(error);
		}else{
			response.json(doc);
		}
	});
});


app.post("/articles/:id", function(request, response){
	
	var newNote = new Note(request.body);

	newNote.save(function(error, doc){
		if (error){
			console.log(error);
		} else{
			
			Article.findOneAndUpdate({"_id": request.params.id}, {"note": doc._id})
			.exec(function(error, doc){
				if(error){
					console.log(error);
				} else{
					response.send(doc);
				}
			})
		}
	});
});


var port = process.env.PORT || 3000;

app.listen(port, function() {
    console.log("listening on", port);
});