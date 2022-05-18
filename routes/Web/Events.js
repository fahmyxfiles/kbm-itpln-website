var express = require('express');
var router = express.Router();

router.post('/getData', function (req, res) {
	MainDB.query("SELECT `Events`.`Title`, `Events`.`CreatedDateTime`, `Events`.`ImagePath`,`Events`.`Url`, `Users`.`FullName` AS `AuthorName` FROM `Events` INNER JOIN `Users` ON `Users`.`id` = `Events`.`AuthorId` WHERE 1 ORDER BY `CreatedDateTime` DESC LIMIT ?", [parseInt(req.body.nLimit)], function (error, results, fields) {
		if(error) {
			console.log(error);
			return res.send("A database error has occurred.");
		}
		return res.send(JSON.stringify(results));
	});
});

module.exports = router;