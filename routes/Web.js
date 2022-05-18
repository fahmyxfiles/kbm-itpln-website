var express = require('express');
var router = express.Router();

// Home page route.
router.get('/', function (req, res) {
	MainDB.query("SELECT * FROM `Categories` WHERE 1", function (error, CategoryList, fields) {
		if(error) {
			console.log(error);
			return res.send("A database error has occurred.");
		}
		MainDB.query("SELECT `HighLights`.`HighLightPosition`, `HighLights`.`Type`, `News`.`CategoryId`, `News`.`Title`, `News`.`ImagePath`, `News`.`Url` FROM `HighLights` INNER JOIN `News` ON `HighLights`.`NewsOrEventId` = `News`.`id` WHERE `Type`='News' UNION SELECT `HighLights`.`HighLightPosition`, `HighLights`.`Type`, \"\", `Events`.`Title`, `Events`.`ImagePath`, `Events`.`Url` FROM `HighLights` INNER JOIN `Events` ON `HighLights`.`NewsOrEventId` = `Events`.`id` WHERE `Type`='Events' ORDER BY `HighlightPosition` ASC", function (error, HighLightNewsEventList, fields) {
			if(error) {
				console.log(error);
				return res.send("A database error has occurred.");
			}
			MainDB.query("SELECT * FROM `News` ORDER BY `VisitedCount` DESC, `CreatedDateTime` DESC LIMIT 18", function (error, TopNewsList, fields) {
				if(error) {
					console.log(error);
					return res.send("A database error has occurred.");
				}
				MainDB.query("SELECT * FROM `Events` WHERE `EndDateTime` >= NOW() ORDER BY `StartDateTime` ASC LIMIT 18", function (error, UpcomingEventList, fields) {
					if(error) {
						console.log(error);
						return res.send("A database error has occurred.");
					}
					return res.render('Web/Home.ejs', {CategoryList: CategoryList, HighLightNewsEventList: HighLightNewsEventList, TopNewsList: TopNewsList, UpcomingEventList: UpcomingEventList});
				});
			});
		});
	});
});

router.use('/News', require('./Web/News.js'));
router.use('/Events', require('./Web/Events.js'));



module.exports = router;