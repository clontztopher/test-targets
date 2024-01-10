import { Page, Response, expect } from '@playwright/test';

export default abstract class PageBase {

    constructor(protected page: Page, protected pageUrl: string) {
        // intentionally empty
    }

    visit(): Promise<null | Response> {
        return this.page.goto(this.pageUrl);
    }

    isCurrent(): boolean {
        return this.page.url() === this.pageUrl;
    }
}