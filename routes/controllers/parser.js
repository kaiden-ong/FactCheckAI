const express = require('express');
const router = express.Router();
const cheerio = require("cheerio");
const axios = require("axios");
const path = require('path');

router.use(express.json());

// Sample test content (for testing purposes only)
const test = "Dozens Dead In Least Of America's Problems Right Now \
PublishedFriday 1:25PM \
Image for article titled Dozens Dead In Least Of America's Problems Right Now \
NEW YORK—As extreme heat continued to batter states across much of the Midwest and East Coast, \
 authorities warned Friday that dozens of Americans had died in what's really the least of the nation's \
 problems right now. “We've seen numerous elderly citizens expire in what is, ultimately, a pretty minuscule \
 part of the overall trouble this country faces,” said climatologist Todd Jeffries, going on to describe the \
 hundreds of related hospitalizations as ranking 97th on a list of issues facing the United States, behind a \
 disappointing slate of summer movies, the year's cicada swarms, the lack of a cure for male pattern baldness, \
 Justin Timberlake's DWI, concerns that the 2024 Summer Olympics might not live up to expectations, the TikTok ban, \
 the closure of Red Lobster, and divorce rumors about Jennifer Lopez and Ben Affleck. “Look, I'm a researcher in this field, \
 and even I've got to admit the heightened fire risks and unusual number of record-breaking temperatures are just a blip on the \
 radar in the grand scheme of things. Simply put, most Americans have more pressing things to think about than this bullshit.” \
 Authorities added that while the dozens dead might be related to a larger problem, they were really more concerned with bigger \
 headaches, like getting their AC unit fixed. \
";

const generateFilename = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    return `${year}-${month}-${day}-${hour}-${minute}-${second}.json`;
};

const saveContentJson = (content) => {
    const filename = generateFilename();
    const jsonContent = JSON.stringify(content, null, 2);
    const folder = process.env.NODE_ENV === "test" ? "test-data" : "data";

    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }

    fs.writeFileSync(path.join(folder, filename), jsonContent);
    return filename;
};

router.post('/', async (req, res) => {
    const URL = req.body.URL;
    // const content = HERE DO THE PARSING, add other methods as needed
    // TODO Tony: Use cheerio and axios here, https://circleci.com/blog/web-scraping-with-cheerio/ for reference
    try {
        const response = await axios.get(URL);
        const $ = cheerio.load(response.data);
        let articleText = "";
        const title = $("title").text();
        articleText += title + " ";        
        $("p").each((index, element) => {
            let text = $(element).text().replace(/\n/g, "").trim();
            const keywordsToSkip = ["Advertisement", "Sponsored", "Click here"];
            if (text.charAt(0) === "©" || text === "" || keywordsToSkip.some(keyword => text.includes(keyword))) {
                return;
            }
            articleText += text + " ";
        });
        // const content = { title, paragraphs };
        // const filename = saveContentJson(content);

        // res.json({
        //     status: "success",
        //     message: "Content scraped successfully",
        //     filename: filename
        // });
        // Uncomment the following line to use actual content instead of test data
        res.json({ status: "success", isURL: articleText }); 
    } catch (error) {
        console.error('Error fetching or parsing data:', error.message);
        res.status(500).json({
            status: "error",
            message: "Error fetching or parsing data",
            error: error.message
        });
    }
});

module.exports = router;