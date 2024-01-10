package ui;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.WindowType;
import org.testng.annotations.AfterClass;
import org.testng.annotations.Test;

import java.util.List;
import java.util.Objects;

import static common.TestProperties.PropName.SAMPLE_TODO_ONE;
import static common.TestProperties.PropName.SAMPLE_TODO_TWO;
import static common.TestProperties.PropName.SAMPLE_TODO_THREE;
import static common.TestProperties.getPublicProperty;
import static org.testng.Assert.*;

/**
 * Automated regression tests for the TodoMVC Vanilla JS application based on the specification located here:
 * https://github.com/tastejs/todomvc/blob/master/app-spec.md#functionality
 */
public class TodoMVCTests {

    @Test
    public void addTodoTest() {
        // Setup
        TodoMVC todoMVC = new TodoMVC();
        // End Setup

        try {
            String todoText = (String) getPublicProperty(SAMPLE_TODO_ONE.toString());
            todoMVC.addTodo(todoText);
            List<WebElement> todos = todoMVC.getTodosByText(todoText);
            assertFalse(todos.isEmpty());
            assertTrue(todoMVC.inputHasFocus());
        } catch(Exception e) {
            e.printStackTrace();
        } finally {
            // Cleanup
            todoMVC.close();
            // End Cleanup
        }
    }

    @Test
    public void completeAllButtonTest() {
        // Setup
        TodoMVC todoMVC = new TodoMVC();
        // End Setup

        try {
            List<String> todos = List.of(
                    (String) Objects.requireNonNull(getPublicProperty(SAMPLE_TODO_ONE.toString())),
                    (String) Objects.requireNonNull(getPublicProperty(SAMPLE_TODO_TWO.toString())),
                    (String) Objects.requireNonNull(getPublicProperty(SAMPLE_TODO_THREE.toString()))
            );

            for (String todo : todos) {
                todoMVC.addTodo(todo);
            }

            // Toggle todos to "completed"
            todoMVC.toggleAllTodos();

            for (String todo : todos) {
                assertTrue(todoMVC.todoIsCompleted(todo));
            }

            // Toggle todos to active
            todoMVC.toggleAllTodos();

            for (String todo : todos) {
                assertFalse(todoMVC.todoIsCompleted(todo));
            }

            // Complete one task
            todoMVC.completeTodo(todos.get(0));
            assertTrue(todoMVC.todoIsCompleted(todos.get(0)));
            // Toggle all
            todoMVC.toggleAllTodos();
            // Original task should still be completed
            assertTrue(todoMVC.todoIsCompleted(todos.get(0)));
        } catch(Exception e) {
            e.printStackTrace();
        } finally {
            // Cleanup
            todoMVC.close();
            // End Cleanup
        }
    }

    @Test
    public void clearCompletedTest() {
        // Setup
        TodoMVC todoMVC = new TodoMVC();
        // End Setup

        try {
            String todoText = (String) getPublicProperty(SAMPLE_TODO_ONE.toString());
            todoMVC.addTodo(todoText);
            todoMVC.completeTodo(todoText);
            assertTrue(todoMVC.clearCompletedIsVisible());
            todoMVC.clearCompleted();
            assertTrue(todoMVC.getTodosByText(todoText).isEmpty());
        } catch(Exception e) {
            e.printStackTrace();
        } finally {
            // Cleanup
            todoMVC.close();
            // End Cleanup
        }
    }

    @Test
    public void editTodoTest() {
        // Setup
        TodoMVC todoMVC = new TodoMVC();
        // End Setup

        try {
            String todoText1 = (String) getPublicProperty(SAMPLE_TODO_ONE.toString());
            String todoText2 = (String) getPublicProperty(SAMPLE_TODO_TWO.toString());
            todoMVC.addTodo(todoText1);
            todoMVC.editTodo(todoText1, todoText2);
            List<WebElement> todo2 = todoMVC.getTodosByText(todoText2);
            assertFalse(todo2.isEmpty());
        } catch(Exception e) {
            e.printStackTrace();
        } finally {
            // Cleanup
            todoMVC.close();
            // End Cleanup
        }
    }

    @Test
    public void editTodoRemoveTextTest() {
        // Setup
        TodoMVC todoMVC = new TodoMVC();
        // End Setup

        try {
            String todoText1 = (String) getPublicProperty(SAMPLE_TODO_ONE.toString());
            todoMVC.addTodo(todoText1);
            todoMVC.editTodo(todoText1, "");
            List<WebElement> todo1 = todoMVC.getTodosByText(todoText1);
            assertTrue(todo1.isEmpty());
        } catch(Exception e) {
            e.printStackTrace();
        } finally {
            // Cleanup
            todoMVC.close();
            // End Cleanup
        }
    }

    @Test
    public void escapedEditRevertsTodoTest() {
        // Setup
        TodoMVC todoMVC = new TodoMVC();
        // End Setup

        try {
            String todoText1 = (String) getPublicProperty(SAMPLE_TODO_ONE.toString());
            String todoText2 = (String) getPublicProperty(SAMPLE_TODO_TWO.toString());
            todoMVC.addTodo(todoText1);
            todoMVC.editTodoAndEscape(todoText1, todoText2);
            List<WebElement> todo1 = todoMVC.getTodosByText(todoText1);
            assertFalse(todo1.isEmpty());
        } catch(Exception e) {
            e.printStackTrace();
        } finally {
            // Cleanup
            todoMVC.close();
            // End Cleanup
        }
    }

    @Test
    public void removeTodoTest() {
        // Setup
        TodoMVC todoMVC = new TodoMVC();
        // End Setup

        try {
            String todoText1 = (String) getPublicProperty(SAMPLE_TODO_ONE.toString());
            String todoText2 = (String) getPublicProperty(SAMPLE_TODO_TWO.toString());
            todoMVC.addTodo(todoText1);
            todoMVC.addTodo(todoText2);
            todoMVC.deleteTodoByText(todoText1);
            todoMVC.deleteTodoByText(todoText2);

            List<WebElement> todo1 = todoMVC.getTodosByText(todoText1);
            assertTrue(todo1.isEmpty());

            List<WebElement> todo2 = todoMVC.getTodosByText(todoText2);
            assertTrue(todo2.isEmpty());
        } catch(Exception e) {
            e.printStackTrace();
        } finally {
            // Cleanup
            todoMVC.close();
            // End Cleanup
        }
    }

    @Test
    public void counterIsDynamicTest() {
        // Setup
        TodoMVC todoMVC = new TodoMVC();
        // End Setup

        try {
            String todoText1 = (String) getPublicProperty(SAMPLE_TODO_ONE.toString());
            String todoText2 = (String) getPublicProperty(SAMPLE_TODO_TWO.toString());
            todoMVC.addTodo(todoText1);
            String countText = todoMVC.getCountData();
            assertTrue(countText.contains("1"));
            assertTrue(countText.contains("item ")); // Use space to ensure no "s"

            todoMVC.addTodo(todoText2);
            countText = todoMVC.getCountData();
            assertTrue(countText.contains("2"));
            assertTrue(countText.contains("items"));
        } catch(Exception e) {
            e.printStackTrace();
        } finally {
            // Cleanup
            todoMVC.close();
            // End Cleanup
        }
    }

    @Test
    public void todosPersistAcrossSessions() {
        // Setup
        TodoMVC todoMVC = new TodoMVC();
        // End Setup

        try {
            String todoText1 = (String) getPublicProperty(SAMPLE_TODO_ONE.toString());
            String todoText2 = (String) getPublicProperty(SAMPLE_TODO_TWO.toString());
            todoMVC.addTodo(todoText1);
            todoMVC.addTodo(todoText2);
            todoMVC.getDriver().switchTo().newWindow(WindowType.TAB);
            todoMVC.visit();
            assertFalse(todoMVC.getTodosByText(todoText1).isEmpty());
            assertFalse(todoMVC.getTodosByText(todoText2).isEmpty());
        } catch(Exception e) {
            e.printStackTrace();
        } finally {
            // Cleanup
            todoMVC.close();
            // End Cleanup
        }
    }

    @Test
    public void routeFilteringTest() {
        // Setup
        TodoMVC todoMVC = new TodoMVC();
        // End Setup

        try {
            List<String> todos = List.of(
                    (String) Objects.requireNonNull(getPublicProperty(SAMPLE_TODO_ONE.toString())),
                    (String) Objects.requireNonNull(getPublicProperty(SAMPLE_TODO_TWO.toString())),
                    (String) Objects.requireNonNull(getPublicProperty(SAMPLE_TODO_THREE.toString()))
            );

            for (String todo : todos) {
                todoMVC.addTodo(todo);
            }

            todoMVC.completeTodo(todos.get(1));

            todoMVC.filterTodos("COMPLETED");
            assertTrue(todoMVC.getTodosByText(todos.get(0)).isEmpty());
            assertFalse(todoMVC.getTodosByText(todos.get(1)).isEmpty());
            assertTrue(todoMVC.getTodosByText(todos.get(2)).isEmpty());

            todoMVC.filterTodos("ACTIVE");
            assertFalse(todoMVC.getTodosByText(todos.get(0)).isEmpty());
            assertTrue(todoMVC.getTodosByText(todos.get(1)).isEmpty());
            assertFalse(todoMVC.getTodosByText(todos.get(2)).isEmpty());

            todoMVC.filterTodos("ALL");
            assertFalse(todoMVC.getTodosByText(todos.get(0)).isEmpty());
            assertFalse(todoMVC.getTodosByText(todos.get(1)).isEmpty());
            assertFalse(todoMVC.getTodosByText(todos.get(2)).isEmpty());
        } catch(Exception e) {
            e.printStackTrace();
        } finally {
            // Cleanup
            todoMVC.close();
            // End Cleanup
        }
    }
}
