import { test, expect, type Page } from '@playwright/test';

import TodoMVC, { FILTER } from '../Pages/TodoMVC';
import { TODO_ITEMS } from '../Mocks/data';

let todoMvc: TodoMVC;

test.beforeEach(async ({ page, baseURL }) => {
    if (baseURL == undefined) {
        throw new Error("Base URL not defined.");
    }
    todoMvc = new TodoMVC(page, baseURL);
    await todoMvc.visit();
});

test.describe("New todo tests.", () => {
    test('Should allow addition of todo items.', async () => {
        const firstTodo = TODO_ITEMS[0];
        await todoMvc.addTodoItem(firstTodo);
        const todoItem = await todoMvc.getTodoItem(firstTodo);
        await expect(todoItem).toHaveCount(1);
    });

    test("Should not allow addition of blank todos.", async () => {
        await todoMvc.addTodoItem("");
        const todoListCount = await todoMvc.getTodoCount();
        await expect(todoListCount).toBe(0);
    });
});

test.describe("Complete all button tests.", () => {
    test.beforeEach(async () => {
        for (const todoText of TODO_ITEMS) {
            await todoMvc.addTodoItem(todoText);
        }
    });

    test("Selecting button makes all todos complete.", async () => {
        await todoMvc.toggleAllTodos();
        for (const todoText of TODO_ITEMS) {
            let todoItem = await todoMvc.getTodoItem(todoText);
            await expect(todoItem).toHaveClass('completed');
        }
    });

    test("Selecting button when all todos are complete makes all todos incomplete.", async () => {
        await todoMvc.toggleAllTodos();
        await todoMvc.toggleAllTodos();
        for (const todoText of TODO_ITEMS) {
            let todoItem = await todoMvc.getTodoItem(todoText);
            await expect(todoItem).not.toHaveClass('completed');
        }
    });

    test("Toggle one then select all selects all others and includes single selection.", async () => {
        await todoMvc.toggleTodo(TODO_ITEMS[1]);
        await todoMvc.toggleAllTodos();
        for (const todoText of TODO_ITEMS) {
            let todoItem = await todoMvc.getTodoItem(todoText);
            await expect(todoItem).toHaveClass('completed');
        }
    });
});

test.describe("Todo interactions", () => {
    test("Selecting checkbox next to item should mark it complete.", async () => {
        await todoMvc.addTodoItem(TODO_ITEMS[0]);
        await todoMvc.toggleTodo(TODO_ITEMS[0]);
        const todo = await todoMvc.getTodoItem(TODO_ITEMS[0]);
        await expect(todo.getByRole("checkbox")).toBeChecked();
        await expect(todo.locator("label")).toHaveCSS("text-decoration", /line-through/);
    });

    test("Double-clicking a todo will allow editing.", async () => {
        await todoMvc.addTodoItem(TODO_ITEMS[0]);
        await todoMvc.editTodo(TODO_ITEMS[0], TODO_ITEMS[1]);
        await expect(await todoMvc.getTodoItem(TODO_ITEMS[0])).toHaveCount(0);
        await expect(await todoMvc.getTodoItem(TODO_ITEMS[1])).toHaveCount(1);
    });

    test("Todo should be removed from list if text is cleared.", async () => {
        await todoMvc.addTodoItem(TODO_ITEMS[0]);
        await todoMvc.editTodo(TODO_ITEMS[0], "");
        await expect(await todoMvc.getTodoItem(TODO_ITEMS[0])).toHaveCount(0);
    });

    test("Todo should revert to previous state and blurred if 'Escape' key is pressed while editing.", async () => {
        await todoMvc.addTodoItem(TODO_ITEMS[0]);
        await todoMvc.editTodo(TODO_ITEMS[0], TODO_ITEMS[1], true);
        await expect(await todoMvc.getTodoItem(TODO_ITEMS[0])).toHaveCount(1);
        await expect(await todoMvc.getTodoItem(TODO_ITEMS[1])).toHaveCount(0);
    });

    test("Todo is removed if delete button is clicked.", async () => {
        await todoMvc.addTodoItem(TODO_ITEMS[0]);
        await todoMvc.deleteTodo(TODO_ITEMS[0]);
        await expect(await todoMvc.getTodoItem(TODO_ITEMS[0])).toHaveCount(0);
    });
});

test("Counter should appear upon adding todos and have correct verbiage for count.", async () => {
    // No todos
    await expect(await todoMvc.getItemsCountContainer()).not.toBeVisible();
    // 1 todo
    await todoMvc.addTodoItem(TODO_ITEMS[0]);
    await expect(await todoMvc.getItemsCountContainer()).toContainText("1");
    await expect(await todoMvc.getItemsCountContainer()).toContainText(" item left");
    // 2 todos
    await todoMvc.addTodoItem(TODO_ITEMS[1]);
    await expect(await todoMvc.getItemsCountContainer()).toContainText("2");
    await expect(await todoMvc.getItemsCountContainer()).toContainText(" items left");
});

test("Todos persist in new tabs/windows.", async ({ baseURL, context }) => {
    if (baseURL == undefined) {
        throw new Error("Base URL not defined.");
    }

    await todoMvc.addTodoItem(TODO_ITEMS[0]);
    await todoMvc.addTodoItem(TODO_ITEMS[1]);
    await todoMvc.addTodoItem(TODO_ITEMS[2]);

    const page2 = await context.newPage()
    const app2 = new TodoMVC(page2, baseURL);

    await app2.visit();

    await expect(await app2.getTodoItem(TODO_ITEMS[0])).toHaveCount(1);
    await expect(await app2.getTodoItem(TODO_ITEMS[1])).toHaveCount(1);
    await expect(await app2.getTodoItem(TODO_ITEMS[2])).toHaveCount(1);
});

test.describe("Filters should work correctly and display route information.", () => {
    test.beforeEach(async () => {
        await todoMvc.addTodoItem(TODO_ITEMS[0]);
        await todoMvc.addTodoItem(TODO_ITEMS[1]);
        await todoMvc.addTodoItem(TODO_ITEMS[2]);
        await todoMvc.toggleTodo(TODO_ITEMS[1]);
    });

    test("'Active' filter should only show active todos", async ({ baseURL }) => {
        await todoMvc.filterTodos(FILTER.ACTIVE);
        await expect(await todoMvc.getTodoItem(TODO_ITEMS[0])).toBeVisible();
        await expect(await todoMvc.getTodoItem(TODO_ITEMS[1])).not.toBeVisible();
        await expect(await todoMvc.getTodoItem(TODO_ITEMS[2])).toBeVisible();
        expect(todoMvc.page.url()).toEqual(baseURL + "#/active");
    });

    test("'Completed' filter should only show completed todos", async ({ baseURL }) => {
        await todoMvc.filterTodos(FILTER.COMPLETED);
        await expect(await todoMvc.getTodoItem(TODO_ITEMS[0])).not.toBeVisible();
        await expect(await todoMvc.getTodoItem(TODO_ITEMS[1])).toBeVisible();
        await expect(await todoMvc.getTodoItem(TODO_ITEMS[2])).not.toBeVisible();
        expect(todoMvc.page.url()).toEqual(baseURL + "#/completed");
    });

    test("'All' filter should show all todos", async ({ baseURL }) => {
        // Choose another filter first
        await todoMvc.filterTodos(FILTER.COMPLETED);
        await expect(await todoMvc.getTodoItem(TODO_ITEMS[0])).not.toBeVisible();
        await expect(await todoMvc.getTodoItem(TODO_ITEMS[1])).toBeVisible();
        await expect(await todoMvc.getTodoItem(TODO_ITEMS[2])).not.toBeVisible();

        await todoMvc.filterTodos(FILTER.ALL);
        await expect(await todoMvc.getTodoItem(TODO_ITEMS[0])).toBeVisible();
        await expect(await todoMvc.getTodoItem(TODO_ITEMS[1])).toBeVisible();
        await expect(await todoMvc.getTodoItem(TODO_ITEMS[2])).toBeVisible();
        expect(todoMvc.page.url()).toEqual(baseURL + "#/");
    });
});