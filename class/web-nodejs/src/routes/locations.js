const express = require("express");
const axios = require("axios");
const router = express.Router();
const { isLoggedIn } = require("../lib/auth");

router.get("/locations", isLoggedIn, async (req, res) => {
  const END_POINT = "https://rickandmortyapi.com/api/location";
  axios
    .get(END_POINT)
    .then(function (response) {
      console.log(response.data.results);
      res.render("locations.hbs", {
        data: response.data.results,
      });
    })
    .catch(function (error) {
      console.log(error);
      res.render("locations.hbs", {
        error,
        data: [],
      });
    });
});

module.exports = router;
