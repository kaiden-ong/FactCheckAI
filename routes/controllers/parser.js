const express = require('express');
const router = express.Router();
const cheerio = require("cheerio");
const axios = require("axios");

router.use(express.json());

// Sample test content (for testing purposes only)
const test = "Dozens Dead In Least Of America’s Problems Right Now \
PublishedFriday 1:25PM \
Image for article titled Dozens Dead In Least Of America’s Problems Right Now \
NEW YORK—As extreme heat continued to batter states across much of the Midwest and East Coast, \
 authorities warned Friday that dozens of Americans had died in what’s really the least of the nation’s \
 problems right now. “We’ve seen numerous elderly citizens expire in what is, ultimately, a pretty minuscule \
 part of the overall trouble this country faces,” said climatologist Todd Jeffries, going on to describe the \
 hundreds of related hospitalizations as ranking 97th on a list of issues facing the United States, behind a \
 disappointing slate of summer movies, the year’s cicada swarms, the lack of a cure for male pattern baldness, \
 Justin Timberlake’s DWI, concerns that the 2024 Summer Olympics might not live up to expectations, the TikTok ban, \
 the closure of Red Lobster, and divorce rumors about Jennifer Lopez and Ben Affleck. “Look, I’m a researcher in this field, \
 and even I’ve got to admit the heightened fire risks and unusual number of record-breaking temperatures are just a blip on the \
 radar in the grand scheme of things. Simply put, most Americans have more pressing things to think about than this bullshit.” \
 Authorities added that while the dozens dead might be related to a larger problem, they were really more concerned with bigger \
 headaches, like getting their AC unit fixed. \
";

router.post('/', async (req, res) => {
    const URL = req.body.URL;
    // const content = HERE DO THE PARSING, add other methods as needed
    // TODO Tony: Use cheerio and axios here, https://circleci.com/blog/web-scraping-with-cheerio/ for reference
    try {
        const response = await axios.get(URL);
        const $ = cheerio.load(response.data);

        const title = $("title").text();
        const paragraphs = [];
        $("p").each((index, element) => {
            paragraphs.push($(element).text());
        });

        res.json({ status: "success", isURL: test });
        // res.json({ status: "success", isURL: content }); change to this one when done
    } catch (error) {
        console.error('Error fetching or parsing data:', error.message);
        res.status(500).json({ status: "error", message: "Error fetching or parsing data", error: error.message });
    }
});

module.exports = router;