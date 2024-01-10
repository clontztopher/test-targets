import { test, expect, type Page } from '@playwright/test';

import TodoMVC from '../Pages/TodoMVC';
import { TODO_ITEMS } from '../Mocks/data';

let todoMvcPage: TodoMVC;

test.beforeEach(async ({ page }) => {
    todoMvcPage = new TodoMVC(page);
    await todoMvcPage.visit();
});

test.describe("New Todo", () => {
    test('should allow addition of todo items.', async ({ page }) => {
        const firstTodo = TODO_ITEMS[0];
        await todoMvcPage.addTodoItem(firstTodo);
        await expect(todoMvcPage.getFirstItem()).toHaveText([firstTodo]);
    });
});