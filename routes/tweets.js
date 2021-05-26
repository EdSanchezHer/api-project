const express = require("express");

const db = require("../db/models");
const router = express.Router();
const { Tweet } = db;

const asyncHandler = (handler) => (req, res, next) =>
  handler(req, res, next).catch(next);

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
module.exports = router;
