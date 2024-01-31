export const FILTER = {
    ACTIVE: 'ACTIVE',
    COMPLETED: 'COMPLETED',
    ALL: 'ALL'
};

export default class TodoApp {
    visit() {
        cy.visit('/');
    }

    addTodo(text) {
        cy.get('input[placeholder*="What needs to be done?"')
            .type(`${text}{enter}`);
    }

    getTodo(text) {
        return cy.contains(text);
    }

    getVisibleTodos() {
        return cy.get('.todo-list').find('li');
    }

    toggleTodo(text) {
        this.getTodo(text).prev('input').click();
    }

    toggleAllTodos() {
        cy.get('.toggle-all').click();
    }

    editTodo(original, update, escape) {
        this.getTodo(original)
            .dblclick()
            .then(() => {
                escape
                    ? cy.focused()
                        .clear()
                        .type(`${update}{esc}`)
                    : cy.focused()
                        .clear()
                        .type(`${update}{enter}`);
            })
    }

    deleteTodo(text) {
        this.getTodo(text)
            .next('.destroy')
            .click({ force: true });
    }

    getItemsCountContainer() {
        return cy.get('.todo-count');
    }

    filterTodosBy(fltr) {
        switch (fltr) {
            case FILTER.ACTIVE: {
                cy.get('a[href="#/active"').click();
                break;
            }
            case FILTER.COMPLETED: {
                cy.get('a[href="#/completed"').click();
                break;
            }
            case FILTER.ALL:
            default: {
                cy.get('a[href="#/"').click();
                break;
            }
        }
    }
}