const express = require("express");
const { check, validationResult } = require("express-validator");

const db = require("../db/models");
const router = express.Router();
const { Tweet } = db;

const asyncHandler = (handler) => (req, res, next) =>
	handler(req, res, next).catch(next);

const handleValidationErrors = (req, res, next) => {
	const validationErrors = validationResult(req);

	if (!validationErrors.isEmpty()) {
		const errors = validationErrors.array().map((error) => error.msg);

		const err = Error("Bad request.");
		err.errors = errors;
		err.status = 400;
		err.title = "Bad request.";
		return next(err);
	}
	next();
};

function tweetNotFoundError(id) {
	const err = new Error(`tweet of ${id} could not be found.`);
	err.status = 404;
	err.title = "tweet not found.";
	return err;
}

router.get(
	"/tweets",
	asyncHandler(async (req, res, next) => {
		const tweets = await Tweet.findAll();
		res.json({ tweets });
	})
);

router.get(
	"/tweets/:id(\\d+)",
	asyncHandler(async (req, res, next) => {
		const id = req.params.id;
		const tweet = await Tweet.findByPk(id);
		if (tweet) {
			res.json(tweet);
		} else {
			next(tweetNotFoundError(id));
		}
	})
);

router.post(
	"/tweets",
	handleValidationErrors,
	asyncHandler(async (req, res, next) => {
		const newTweet = await Tweet.create(req.body);
		res.json(newTweet);
	})
);

router.put(
	"/tweets/:id(\\d+)",
	handleValidationErrors,
	asyncHandler(async (req, res, next) => {
		// const id = parseInt(req.params.id, 10);
		const id = req.params.id;
		const tweet = await Tweet.findByPk(id);
		if (tweet) {
			await tweet.update({ message: req.body.message });
			res.json({ tweet });
		} else {
			next(tweetNotFoundError(id));
		}
	})
);

router.delete(
	"/tweets/:id(\\d+)",
	asyncHandler(async (req, res, next) => {
		const id = req.params.id;
		const tweet = await Tweet.findByPk(id);
		if (tweet) {
			await tweet.destroy();
			res.status(204).end();
		} else {
			next(tweetNotFoundError(id));
		}
	})
);

module.exports = router;
