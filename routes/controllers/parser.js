const express = require('express');
const router = express.Router();
const cheerio = require("cheerio");
const axios = require("axios");

router.use(express.json());

const test = "President Donald Trump signed into law on Tuesday legislation that bans the use of Kaspersky Lab within the U.S. government, capping a months-long effort to purge the Moscow-based antivirus firm from federal agencies amid concerns it was vulnerable to Kremlin influence. The ban, included as part of a broader defense policy spending bill that Trump signed, reinforces a directive issued by the Trump administration in September that civilian agencies remove Kaspersky Lab software within 90 days. The law applies to both civilian and military networks. “The case against Kaspersky is well-documented and deeply concerning. This law is long overdue,” said Democratic Senator Jeanne Shaheen, who led calls in Congress to scrub the software from government computers. She added that the company’s software represented a “grave risk” to U.S. national security.  Kaspersky Lab has repeatedly denied that it has ties to any government and said it would not help a government with cyber espionage. In an attempt to address suspicions, the company said in October it would submit the source code of its software and future updates for inspection by independent parties. U.S. officials have said that step, while welcomed, would not be sufficient. In a statement on Tuesday, Kaspersky Lab said it continued to have “serious concerns” about the law “due to its geographic-specific approach to cybersecurity.” It added that the company was assessing its options and would continue to “protect its customers from cyber threats (while) collaborating globally with the IT security community to fight cybercrime.” On Tuesday, Christopher Krebs, a senior cyber security official at the Department of Homeland Security, told reporters that nearly all government agencies had fully removed Kaspersky products from their networks in compliance with the September order. Kaspersky’ official response to the ban did not appear to contain any information that would change the administration’s assessment of Kaspersky Lab, Krebs said."


router.post('/', async (req, res) => {
    // const URL = req.body.URL
    // TODO Tony: Use cheerio and axios here
    res.json({status: "success", isURL: test});
});

module.exports = router;
