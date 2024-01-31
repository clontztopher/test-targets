const { default: TodoApp, FILTER } = require('../pages/TodoApp');

describe('Todo App Tests', () => {

  const todoApp = new TodoApp();

  before(() => {
    cy.fixture('todos.json').as('todos');
  });

  beforeEach(() => {
    todoApp.visit();
  });

  context('New todo tests.', () => {
    it('Allows addition of new todo items.', function () {
      cy.get('@todos').then(({ todos }) => {
        todoApp.addTodo(todos[0]);
        todoApp.getTodo(todos[0]).should('be.visible');
      });
    });

    it('Does not allow addition of blank todos.', function () {
      todoApp.addTodo('');
      todoApp.getVisibleTodos().should('not.exist');
    });
  });

  context('"Complete All" button tests.', () => {
    beforeEach(() => {
      cy.fixture('todos.json').then(({ todos }) => {
        todos.forEach(todo => todoApp.addTodo(todo));
      });
    });

    it('Completes all open todos, then changes to active.', () => {
      todoApp.toggleAllTodos();
      todoApp.getVisibleTodos().filter('.completed').should('have.lengthOf', 3);
      todoApp.toggleAllTodos();
      todoApp.getVisibleTodos()
        .should('have.lengthOf', 3)
        .filter('.completed')
        .should('have.lengthOf', 0);
    });

    it('Selects all others if one or more todos are already selected.', () => {
      cy.fixture('todos.json').then(({ todos }) => {
        todoApp.toggleTodo(todos[1]);
        todoApp.toggleAllTodos();
        todoApp.getVisibleTodos()
          .filter('.completed')
          .should('have.lengthOf', 3);
      });
    })
  });

  context('Todo interaction tests.', () => {
    const SAMPLE_TODO = 'SAMPLE TODO';
    beforeEach(() => {
      todoApp.addTodo(SAMPLE_TODO);
    });

    it('Is marked complete when checkbox is selected.', () => {
      todoApp.toggleTodo(SAMPLE_TODO);
      todoApp.getTodo(SAMPLE_TODO).closest('li').should('have.class', 'completed')
    });

    it('Is editable by doulble-clicking on the todo.', () => {
      todoApp.editTodo(SAMPLE_TODO, 'Test');
      todoApp.getTodo(SAMPLE_TODO).should('not.exist');
      todoApp.getTodo('Test').should('exist');
    });

    it('Should revert to previous state and blurred if "Escape" key is pressed while editing.', () => {
      todoApp.editTodo(SAMPLE_TODO, 'Test', true);
      todoApp.getTodo(SAMPLE_TODO).should('exist');
    });

    it('Should remove todo if delete button is selected.', () => {
      todoApp.deleteTodo(SAMPLE_TODO);
      todoApp.getTodo(SAMPLE_TODO).should('not.exist');
    });
  });

  context('Counter widget appearance.', () => {
    it('Shows correct number of todos and correct verbiage.', () => {
      todoApp.addTodo('One');
      todoApp.getItemsCountContainer()
        .should('contain.text', '1')
        .should('contain.text', 'item left');

      todoApp.addTodo('Two');
      todoApp.getItemsCountContainer()
        .should('contain.text', '2')
        .should('contain.text', 'items left');

      todoApp.addTodo('Three');
      todoApp.getItemsCountContainer()
        .should('contain.text', '3')
        .should('contain.text', 'items left');
    });
  });

  context('App persistence', () => {
    it('Persists todos in local storage.', () => {
      cy.fixture('todos.json').then(({ todos }) => {
        todos.forEach(todo => todoApp.addTodo(todo));

        cy.getAllLocalStorage().then(ls => {
          let baseUrl = Cypress.config().baseUrl;
          // Cut off trailing slash
          baseUrl = baseUrl.substring(0, baseUrl.length - 1);
          let savedTodos = ls[baseUrl]['todos-vanillajs'];
          todos.forEach(todo => expect(savedTodos).to.contain(todo));
        });
      });
    });
  });

  context('Todo filter tests.', () => {
    beforeEach(() => {
      cy.fixture('todos.json').as('todos');
      cy.get('@todos').then(({ todos }) => {
        todos.forEach(todo => todoApp.addTodo(todo));
        todoApp.toggleTodo(todos[1]);
      });
    });

    it('Filters active todos.', () => {
      cy.get('@todos').then(({ todos }) => {
        todoApp.filterTodosBy(FILTER.ACTIVE);
        todoApp.getTodo(todos[0]).should('be.visible');
        todoApp.getTodo(todos[1]).should('not.exist');
        todoApp.getTodo(todos[2]).should('be.visible');

        cy.location('hash').should('eq', '#/active');
      });
    });

    it('Filters completed todos.', () => {
      cy.get('@todos').then(({ todos }) => {
        todoApp.filterTodosBy(FILTER.COMPLETED);
        todoApp.getTodo(todos[0]).should('not.exist');
        todoApp.getTodo(todos[1]).should('be.visible');
        todoApp.getTodo(todos[2]).should('not.exist');

        cy.location('hash').should('eq', '#/completed');
      });
    });

    it('Filters all todos.', () => {
      cy.get('@todos').then(({ todos }) => {
        todoApp.filterTodosBy(FILTER.COMPLETED);
        todoApp.getTodo(todos[0]).should('not.exist');
        todoApp.getTodo(todos[1]).should('be.visible');
        todoApp.getTodo(todos[2]).should('not.exist');

        cy.location('hash').should('eq', '#/completed');

        todoApp.filterTodosBy(FILTER.ALL);
        todoApp.getTodo(todos[0]).should('be.visible');
        todoApp.getTodo(todos[1]).should('be.visible');
        todoApp.getTodo(todos[2]).should('be.visible');

        cy.location('hash').should('eq', '#/');
      });
    });
  });
});