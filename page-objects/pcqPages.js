const { expect } = require('@playwright/test');
const data = require('../data/pcqData.json');

// Example home page object for pcq
class pcqPages {
  constructor(page) {
    this.page = page;
    this.urls = data.urls;
    this.locators = data.locators;
    this.inputs = data.inputs;
    this.elementNames = data.elementNames;
    this.links = data.links;
    this.texts = data.texts;
  }
  async invokerSetUp() {
    if (!process.env.BASE_URL) {
      throw new Error('BASE_URL is not set. Add it to .env (local) or GitHub Secrets (CI).');
    }
    await this.page.goto('/invoker');
    await this.page.getByRole('button', { name: new RegExp(this.elementNames.fill) }).click();
    await this.page.waitForSelector(this.locators.serviceIdInput);
    await expect(this.page.locator(this.locators.serviceIdInput)).not.toHaveValue('');
    await this.page
      .getByRole('button', {
        name: new RegExp(this.elementNames.generateToken),
      })
      .click();
  }
  async clickInvoke() {
    await this.page.waitForSelector(this.locators.tokenInput);
    await expect(this.page.locator(this.locators.tokenInput)).not.toHaveValue('');
    await this.page.getByRole('button', { name: new RegExp(this.elementNames.invoke) }).click();
  }
  async clickCymraeg() {
    const cymraegLink = this.page.locator(this.locators.cymraegLink, {
      hasText: this.links.cymraeg,
    });
    await cymraegLink.waitFor({ state: 'visible' });
    await cymraegLink.click();
  }
  getFooterWelshLink() {
    return this.page.locator(this.locators.footerWelshLink, {
      hasText: this.links.cymraeg,
    });
  }
  getPrivacyPolicyLink() {
    return this.page.locator(this.locators.privacyPolicyLink);
  }
  getFeedbackLink() {
    return this.page.locator(this.locators.feedbackLink);
  }
  getFooterHidden() {
    return this.page.locator(this.locators.footerHidden);
  }
  getPrivacyPolicyLinkByRole() {
    return this.page.getByRole('link', { name: /Privacy policy/ });
  }
  getFeedbackLinkByRole() {
    return this.page.getByRole('link', { name: /feedback/i });
  }
  async distinctHeaders() {
    const currentUrl = this.page.url();
    let h1Name,
      h2Name,
      h3Name,
      pText,
      text,
      heading1,
      heading2,
      heading3,
      paragraph,
      fontSizeh1,
      fontSizeh2,
      fontSizeh3,
      fontSizep,
      fontSizet,
      pageText;

    if (currentUrl.includes('/start-page')) {
      h1Name = this.elementNames.startPageH1;
      pText = this.elementNames.startPageP;
    } else if (currentUrl.includes('/date-of-birth')) {
      h1Name = this.elementNames.dateOfBirthH1;
      text = this.elementNames.labelT;
    } else if (currentUrl.includes('/language')) {
      h1Name = this.elementNames.languageH1;
      text = this.elementNames.labelT;
    } else if (currentUrl.includes('/sexual-orientation')) {
      h1Name = this.elementNames.sexualOrientationH1;
      text = this.elementNames.labelT;
    } else if (currentUrl.includes('/sex')) {
      h1Name = this.elementNames.sexH1;
      text = this.elementNames.labelT;
    } else if (currentUrl.includes('/gender-same-as-sex')) {
      h1Name = this.elementNames.genderSameAsSexH1;
      text = this.elementNames.labelT;
    } else if (currentUrl.includes('/marital-status')) {
      h1Name = this.elementNames.maritalStatusH1;
      text = this.elementNames.labelT;
    } else if (currentUrl.includes('/ethnic-group')) {
      h1Name = this.elementNames.ethnicGroupH1;
      text = this.elementNames.labelT;
    } else if (currentUrl.includes('/religion')) {
      h1Name = this.elementNames.religionH1;
      text = this.elementNames.labelT;
    } else if (currentUrl.includes('/disability')) {
      h1Name = this.elementNames.disabilityH1;
      text = this.elementNames.labelT;
    } else if (currentUrl.includes('/pregnant')) {
      h1Name = this.elementNames.pregnantH1;
      text = this.elementNames.labelT;
    } else if (currentUrl.includes('/end-page')) {
      h1Name = this.elementNames.endPageH1;
      pText = this.elementNames.endPageP;
    } else if (currentUrl.includes('/privacy-policy')) {
      h1Name = this.elementNames.privPolPageH1;
      h2Name = this.elementNames.privPolPageH2;
      h3Name = this.elementNames.privPolPageH3;
      pText = this.elementNames.privPolPageP;
    }

    heading1 = this.page.getByRole('heading', { name: h1Name });
    fontSizeh1 = await heading1.evaluate((el) => parseInt(getComputedStyle(el).fontSize, 10));
    if (typeof pText === 'string' && pText !== '') {
      paragraph = this.page.locator('p').filter({ hasText: pText });
      fontSizep = await paragraph.evaluate((el) => parseInt(getComputedStyle(el).fontSize, 10));
      expect(fontSizeh1).toBeGreaterThan(fontSizep);
    }
    if (typeof text === 'string' && text !== '') {
      pageText = this.page.locator('label').filter({ hasText: text });
      await pageText.waitFor({ state: 'visible' });
      fontSizet = await pageText.evaluate((el) => parseInt(getComputedStyle(el).fontSize, 10));
      expect(fontSizeh1).toBeGreaterThan(fontSizet);
    }
    if (typeof h2Name === 'string' && h2Name !== '') {
      heading2 = this.page.getByRole('heading', { name: h2Name, exact: true });
      fontSizeh2 = await heading2.evaluate((el) => parseInt(getComputedStyle(el).fontSize, 10));
      heading3 = this.page.getByRole('heading', { name: h3Name, exact: true });
      fontSizeh3 = await heading3.evaluate((el) => parseInt(getComputedStyle(el).fontSize, 10));
      expect(fontSizeh1).toBeGreaterThan(fontSizeh2);
      expect(fontSizeh2).toBeGreaterThan(fontSizeh3);
    }
  }
  async skipToMain() {
    const skipLink = this.page.getByRole('link', {
      name: this.elementNames.skipToMain,
    });
    await expect(skipLink).toBeVisible();
    await expect(await skipLink.getAttribute('href')).toBe(this.locators.mainContent);
  }
  async pageTitleUnique() {
    const titles = [];
    await this.page.goto('/start-page');
    titles.push(await this.page.title());
    await this.page.goto('/date-of-birth');
    titles.push(await this.page.title());
    await this.page.goto('/language');
    titles.push(await this.page.title());
    await this.page.goto('/sex');
    titles.push(await this.page.title());
    await this.page.goto('/gender-same-as-sex');
    titles.push(await this.page.title());
    await this.page.goto('/sexual-orientation');
    titles.push(await this.page.title());
    await this.page.goto('/marital-status');
    titles.push(await this.page.title());
    await this.page.goto('/ethnic-group');
    titles.push(await this.page.title());
    await this.page.goto('/religion');
    titles.push(await this.page.title());
    await this.page.goto('/disability');
    titles.push(await this.page.title());
    await this.page.goto('/pregnant');
    titles.push(await this.page.title());
    await this.page.goto('/end-page');
    titles.push(await this.page.title());
    await this.page.goto('/privacy-policy');
    titles.push(await this.page.title());

    for (let i = 0; i < titles.length; i++) {
      for (let j = 0; j < titles.length; j++) {
        if (i !== j) {
          expect(titles[i]).not.toBe(titles[j]);
        }
      }
    }
  }
  async feedbackLinkNewTabCheck() {
    const feedbackLink = this.page.getByRole('link', {
      name: this.elementNames.feedbackLink,
    });
    expect(await feedbackLink.getAttribute('target')).toBe('_blank');
    const visibleText = await feedbackLink.textContent();
    expect(visibleText.toLowerCase()).toContain(this.texts.newTabWarning);
  }

  async uniqueLinksCheck() {
    const links = this.page.locator('a');
    const count = await links.count();
    const visibleLinks = [];
    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      if (await link.isVisible()) {
        const text = (await link.innerText()).trim().toLowerCase();
        const href = await link.getAttribute('href');
        visibleLinks.push({ text, href });
      }
    }
    for (let i = 0; i < visibleLinks.length; i++) {
      for (let j = 0; j < visibleLinks.length; j++) {
        if (i !== j) {
          if (visibleLinks[i].text === visibleLinks[j].text) {
            expect(visibleLinks[i].href).toBe(visibleLinks[j].href);
          } else {
            expect(visibleLinks[i].text).not.toBe(visibleLinks[j].text);
          }
        }
      }
    }
  }
}

module.exports = { pcqPages };
