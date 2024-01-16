import { Locator, type Page } from '@playwright/test';

import PageBase from './PageBase';

export enum FILTER {
    ALL,
    ACTIVE,
    COMPLETED
}

export default class TodoMVC extends PageBase {

    readonly page: Page;
    readonly todoInput: Locator;

    constructor(page: Page, baseUrl: string) {
        super(page, baseUrl);
        this.page = page;
        this.todoInput = page.getByPlaceholder("What needs to be done?");
    }

    async getTodoInput() {
        return this.todoInput;
    }

    async addTodoItem(text: string): Promise<TodoMVC> {
        const todoInput = this.page.getByPlaceholder("What needs to be done?");

        await todoInput.fill(text);
        await todoInput.press("Enter");

        return this;
    }

    async getTodoItem(text: string): Promise<Locator> {
        return await this.page.getByRole("listitem").filter({ hasText: text });
    }

    async getTodoCount(): Promise<number> {
        const todoList = this.page.locator(".todo-list");

        if (await !todoList.isVisible()) {
            return 0;
        }

        return todoList.getByRole("listitem").count();
    }

    async toggleTodo(todoText: string): Promise<TodoMVC> {
        const todo = await this.getTodoItem(todoText);
        if (await !todo.isVisible()) {
            return this;
        }

        await todo.getByRole("checkbox").click();

        return this;
    }

    async toggleAllTodos(): Promise<TodoMVC> {
        const toggleAll = this.page.locator('.toggle-all');
        if (await toggleAll.isVisible()) {
            await toggleAll.click();
        }

        return this;
    }

    async editTodo(targetTodoText: string, replacementText: string, escape: boolean = false): Promise<TodoMVC> {
        const todo = await this.getTodoItem(targetTodoText);
        await todo.dblclick();
        await todo.locator("input.edit").fill(replacementText);
        await todo.press(escape ? "Escape" : "Enter");
        return this;
    }

    async deleteTodo(text: string): Promise<TodoMVC> {
        const todo = await this.getTodoItem(text);
        await todo.hover();
        await todo.getByRole("button").click();
        return this;
    }

    async getItemsCountContainer() {
        return this.page.locator(".todo-count");
    }

    async filterTodos(filter: FILTER): Promise<TodoMVC> {
        switch (filter) {
            case FILTER.ACTIVE: {
                await this.page.locator("a", { hasText: "Active" }).click();
                break;
            }
            case FILTER.COMPLETED: {
                await this.page.locator("a", { hasText: "Completed" }).click();
                break;
            }
            case FILTER.ALL:
            default: {
                await this.page.locator("a", { hasText: "All" }).click();
                break;
            }
        }

        return this;
    }

    async navigateTo(url?: string) {
        this.page.goto(url || this.page.url());
    }
}