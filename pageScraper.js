const scraperObject = {
  url: "https://quietlight.com/listings/",
  async scraper(browser) {
    const page = await browser.newPage();
    console.log(`Navigating to ${this.url}...`);
    // Navigate to the selected page
    await page.goto(this.url);
    // Wait for the required DOM to be rendered
    await page.waitForSelector('[data-filter=".public-listing"]');
    const result = await page.evaluate(() => {
      const getCompanyStatus = (element) => {
        const className = element.className || "";
        if (className.includes("sold")) {
          return "sold";
        } else if (className.includes("public-listing")) {
          return "listed";
        } else {
          return "under-offer";
        }
      };
      const contents = document.querySelectorAll(
        ".recent_main .single-content"
      );
      let arr = [];
      for (let i = 0; i < contents.length; i++) {
        const content = contents[i];
        const status = getCompanyStatus(content);
        const titleEl = content.querySelector(".match-h5");
        const revenueSecEl = content.querySelectorAll(".revenu_sec p");
        const revenue = revenueSecEl[0];
        const income = revenueSecEl[1];
        arr.push({
          title: titleEl && titleEl.innerText,
          revenue: revenue && revenue.innerText,
          income: income && income.innerText,
          status: status && status,
        });
      }
      return arr;
    });
    console.log("arr: ", result);
    await browser.close();
  },
};

module.exports = scraperObject;
