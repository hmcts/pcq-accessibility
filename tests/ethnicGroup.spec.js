const { test, expect, describe } = require("@playwright/test");
const { AxeUtils } = require("../utils/axeUtils");
const { pcqPages } = require("../page-objects/pcqPages");
const data = require("../data/pcqData.json");

let ethnicity;
let axe;
test.beforeEach(async ({ page }) => {
  ethnicity = new pcqPages(page);
  axe = new AxeUtils(page);
  await ethnicity.invokerSetUp();
  await ethnicity.clickInvoke();
  await page.goto("/ethnic-group");
  await page.pause();
});

describe("@pcq @ethnicity", () => {
  test("@axe ethnicity page is accessible", async ({ page }) => {
    await axe.audit(page);
  });

  test("@checklist 1. Headings are visually distinct", async ({ page }) => {
    await ethnicity.distinctHeaders();
    await axe.audit({ rules: "p-as-heading" });
  });

  test.skip("@checklist 2. Heading levels are in a logical order", async ({
    page,
  }) => {
    // there is only 1 heading on this page
  });

  test("@checklist 3. Skip to main content link", async ({ page }) => {
    await ethnicity.skipToMain();
    await axe.audit({ rules: ["bypass", "skip-link"] });
  });

  test("@checklist 4. Page Title not missing", async ({ page }) => {
    await axe.audit({ rules: "document-title" });
  });

  test("@checklist 5. Page Title is descriptive", async ({ page }) => {
    expect(await page.title()).toMatch(
      new RegExp(data.elementNames.ethnicityPageH1, "i"),
    );
  });

  test("@checklist 6. Page Title is unique", async ({ page }) => {
    await ethnicity.pageTitleUnique();
  });

  test("@checklist 7. Colour contrast", async ({ page }) => {
    await axe.audit({ rules: "color-contrast" });
    await page
      .getByRole("link", { name: data.elementNames.feedbackLink })
      .hover();
    await axe.audit({ rules: "color-contrast" });
    await page
      .getByRole("button", {
        name: new RegExp(data.elementNames.continueBtn, "i"),
      })
      .hover();
    await axe.audit({ rules: "color-contrast" });
  });

  test("@checklist 8. Links open in new tab", async ({ page }) => {
    await ethnicity.feedbackLinkNewTabCheck();
  });

  test("@checklist 9. Links are unique", async ({ page }) => {
    await axe.audit({ rules: "link-name" });
    await axe.audit({ rules: "link-in-text-block" });
    await ethnicity.uniqueLinksCheck();
  });

  test("@checklist 10. Correct language", async ({ page }) => {
    await axe.audit({ rules: "html-has-lang" });
    await axe.audit({ rules: "html-lang-valid" });
    await axe.audit({ rules: "valid-lang" });

    const lang = await page.getAttribute("html", "lang");
    expect(lang).toBe("en");
  });

  test.skip("@checklist 11. Error handling", async ({}) => {
    // none
  });

  test("@smoke PCQ-2016 Welsh page has correct lang attribute", async ({
    page,
  }) => {
    await home.clickCymraeg();
    const lang = await page.getAttribute("html", "lang");
    expect(lang).toBe("cy");
  });

  test("@smoke PCQ-2016 Welsh footer link has correct lang", async ({
    page,
  }) => {
    const link = await home.getFooterWelshLink();
    await link.waitFor({ state: "visible" });
    const lang = await link.getAttribute("lang");
    expect(lang).toBe("cy");
  });

  test("@smoke PCQ-2017 Privacy policy link has visible focus indicator", async ({
    page,
  }) => {
    const link = await home.getPrivacyPolicyLinkByRole();
    await link.focus();
    const outline = await link.evaluate(
      (el) => getComputedStyle(el).outlineStyle,
    );
    expect(outline).not.toBe("none");
  });

  test("@smoke PCQ-2018 Feedback link text is concise", async ({ page }) => {
    const feedbackLink = await home.getFeedbackLinkByRole();
    const linkText = await feedbackLink.textContent();
    expect(linkText).toBeTruthy();
    expect(linkText.length).toBeLessThan(15);
  });
});
