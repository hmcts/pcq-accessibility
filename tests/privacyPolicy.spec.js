const { test, expect, describe } = require("@playwright/test");
const { AxeUtils } = require("../utils/axeUtils");
const { pcqPages } = require("../page-objects/pcqPages");
const data = require("../data/pcqData.json");

let privPol;
let axe;
test.beforeEach(async ({ page }) => {
  privPol = new pcqPages(page);
  axe = new AxeUtils(page);
  await privPol.invokerSetUp();
  await privPol.clickInvoke();
  await page.goto("/privacy-policy");
  await page.pause();
});

describe("@pcq @pivacyPolicy", () => {
  test("@axe privPol page is accessible", async ({ page }) => {
    await axe.audit(page);
  });

  test("@checklist 1. Headings are visually distinct", async ({ page }) => {
    await privPol.distinctHeaders();
    await axe.audit({ rules: "p-as-heading" });
  });

  test("@checklist 2. Heading levels are in a logical order", async ({
    page,
  }) => {
    await axe.audit({ rules: ["heading-order", "page-has-heading-one"] });
  });

  test("@checklist 3. Skip to main content link", async ({ page }) => {
    await privPol.skipToMain();
    await axe.audit({ rules: ["bypass", "skip-link"] });
  });

  test("@checklist 4. Page Title not missing", async ({ page }) => {
    await axe.audit({ rules: "document-title" });
  });

  test("@checklist 5. Page Title is descriptive", async ({ page }) => {
    expect(await page.title()).toMatch(
      new RegExp(data.elementNames.privPolPageH1, "i"),
    );
  });

  test("@checklist 6. Page Title is unique", async ({ page }) => {
    await privPol.pageTitleUnique();
  });

  test("@checklist 7. Colour contrast", async ({ page }) => {
    await axe.audit({ rules: "color-contrast" });
    await page
      .getByRole("link", { name: data.elementNames.feedbackLink })
      .hover();
    await axe.audit({ rules: "color-contrast" });
  });

  test("@checklist 8. Links open in new tab", async ({ page }) => {
    await privPol.feedbackLinkNewTabCheck();
  });

  test("@checklist 9. Links are unique", async ({ page }) => {
    await axe.audit({ rules: "link-name" });
    await axe.audit({ rules: "link-in-text-block" });
    await privPol.uniqueLinksCheck();
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
