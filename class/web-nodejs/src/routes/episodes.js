const express = require("express");
const axios = require("axios");
const router = express.Router();
const { isLoggedIn } = require("../lib/auth");

router.get("/episodes", isLoggedIn, async (req, res) => {
  const a = "Hello World";

  const END_POINT = "https://rickandmortyapi.com/api/episode";
  axios
    .get(END_POINT)
    .then(function (response) {
      console.log(response.data.results);
      res.render("episodes.hbs", {
        data: response.data.results,
      });
    })
    .catch(function (error) {
      console.log(error);
      res.render("episodes.hbs", {
        error,
        data: [],
      });
    });
});

module.exports = router;
