import { Locator, type Page } from '@playwright/test';

import PageBase from './PageBase';

export default class TodoMVC extends PageBase {

    constructor(page: Page) {
        super(page, 'https://demo.playwright.dev/todomvc');
    }

    async addTodoItem(item: string) {
        const todoInput = this.page.getByPlaceholder("What needs to be done?");

        await todoInput.fill(item);
        await todoInput.press("Enter");
    }

    getFirstItem(): Locator {
        return this.page.getByTestId('todo-title');
    }
}