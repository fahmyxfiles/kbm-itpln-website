var express = require('express');
var router = express.Router();
// News page route
router.get('/:urlOrCategory*?', function (req, res) {
	var ShowAll = "0"
	if(!req.params.urlOrCategory){
		ShowAll = "1";
		req.params.urlOrCategory = "";
	}
	MainDB.query("SELECT * FROM `News` WHERE `Url` = ? LIMIT 1", [req.params.urlOrCategory], function (error, results, fields) {
		if(error) {
			console.log(error);
			return res.send("A database error has occurred.");
		}
		if(results.length > 0){
			var News = results[0];
			MainDB.query("SELECT * FROM `Categories` WHERE `id` = ? LIMIT 1", [News.CategoryId], function (error, results, fields) {
				if(error) {
					console.log(error);
					return res.send("A database error has occurred.");
				}
				var Category = results[0];
				MainDB.query("SELECT * FROM `Users` WHERE `id` = ? LIMIT 1", [News.AuthorId], function (error, results, fields) {
					if(error) {
						console.log(error);
						return res.send("A database error has occurred.");
					}
					var Author = results[0];
					MainDB.query("UPDATE `News` SET `VisitedCount` = `VisitedCount` + 1 WHERE `id` = ? LIMIT 1", [News.id], function (error, results, fields) {
						if(error) {
							console.log(error);
							return res.send("A database error has occurred.");
						}
					});
					return res.render('Web/News/Single.ejs', {News: News, Category: Category, Author: Author});
				});
			});
		}
		else{
			MainDB.query("SELECT `News`.`Title`, `News`.`CreatedDateTime`, `News`.`ImagePath`,`News`.`Url`, `Users`.`FullName` AS `AuthorName` FROM `Categories` INNER JOIN `News` ON `Categories`.`id` = `News`.`CategoryId` INNER JOIN `Users` ON `Users`.`id` = `News`.`AuthorId` WHERE `Categories`.`Alias` = ? OR 1 = ? ORDER BY `CreatedDateTime` DESC", [req.params.urlOrCategory, ShowAll], function (error, results, fields) {
				if(error) {
					console.log(error);
					return res.send("A database error has occurred.");
				}
				
				if(results.length > 0){
					var NewsList = results;
					MainDB.query("SELECT * FROM `Categories` WHERE `Alias` = ? LIMIT 1", [req.params.urlOrCategory], function (error, results, fields) {
						if(error) {
							console.log(error);
							return res.send("A database error has occurred.");
						}
						var Category = [];
						var PageTitle = "";
						if(results.length > 0){
							Category = results[0];
							PageTitle = "Berita " + Category.Name;
						}
						else
						{
							Category = {Alias: "all", Name: "Semua"};
							PageTitle = "Semua Berita";
						}
						return res.render('Web/News/List.ejs', {PageTitle: PageTitle, NewsList: NewsList, Category: Category});
					});					
				}
				else
				{
					return res.render('Web/News/NoItem.ejs');
				}
			});
		}
	});
});
// News api route
router.post('/getData', function (req, res) {
	var ShowAll = "0"
	if(!req.body.category){
		ShowAll = "1";
		req.body.category = "";
	}
	MainDB.query("SELECT `News`.`Title`, `News`.`CreatedDateTime`, `News`.`ImagePath`,`News`.`Url`, `Users`.`FullName` AS `AuthorName` FROM `Categories` INNER JOIN `News` ON `Categories`.`id` = `News`.`CategoryId` INNER JOIN `Users` ON `Users`.`id` = `News`.`AuthorId` WHERE `Categories`.`Alias` = ? OR 1 = ? ORDER BY `CreatedDateTime` DESC LIMIT ?", [req.body.category, ShowAll, parseInt(req.body.nLimit)], function (error, results, fields) {
		if(error) {
			console.log(error);
			return res.send("A database error has occurred.");
		}
		return res.send(JSON.stringify(results));
	});
});

module.exports = router;