package ui;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.interactions.Actions;

import java.util.List;
import java.util.concurrent.TimeUnit;

import static common.TestProperties.PropName.BASE_URL;
import static common.TestProperties.getPublicProperty;

public class TodoMVC {

    private WebDriver driver;
    private String url;
    private By todoInputLoc = By.cssSelector("input[class='new-todo']");
    private By todoListLoc = By.cssSelector("todo-list");
    private By toggleAllLoc = By.id("toggle-all");
    private By clearCompletedLoc = By.className("clear-completed");
    private By deleteTodoLoc = By.className("destroy");
    private By counterLoc = By.className("todo-count");

    TodoMVC() {
        url = (String) getPublicProperty(BASE_URL.toString());
        driver = new ChromeDriver();
        driver.manage().timeouts().implicitlyWait(5, TimeUnit.SECONDS);
        driver.get(url);
    }

    public void close() {
        driver.close();
    }

    public void quit() {
        driver.quit();
    }

    public void visit(String url) {
        driver.get(url);
    }

    public void visit() {
        driver.get(url);
    }

    public WebDriver getDriver() {
        return driver;
    }

    public void addTodo(String text) {
        WebElement input = driver.findElement(todoInputLoc);
        input.sendKeys(text);
        new Actions(driver)
                .keyDown(Keys.RETURN)
                .perform();
    }

    public void completeTodo(String text) {
        WebElement todo = getTodosByText(text).get(0);
        todo.findElement(By.xpath("./../input")).click();
    }

    public void editTodo(String targetTodoText, String replacementText) {
        WebElement todo = getTodosByText(targetTodoText).get(0);
        Actions act = new Actions(driver);

        act.doubleClick(todo).perform();
        WebElement activeElement = driver.switchTo().activeElement();
        while (!activeElement.getAttribute("value").equals("")) {
            act.keyDown(Keys.BACK_SPACE).perform();
        }
        activeElement.sendKeys(replacementText);
        act.keyDown(Keys.RETURN).perform();
    }

    public void editTodoAndEscape(String targetTodoText, String replacementText) {
        WebElement todo = getTodosByText(targetTodoText).get(0);
        Actions act = new Actions(driver);

        act.doubleClick(todo).perform();
        WebElement activeElement = driver.switchTo().activeElement();
        while (!activeElement.getAttribute("value").equals("")) {
            act.keyDown(Keys.BACK_SPACE).perform();
        }
        activeElement.sendKeys(replacementText);
        act.keyDown(Keys.ESCAPE).perform();
    }

    public List<WebElement> getTodosByText(String text) {
        By todoSelector = By.xpath(String.format("//label[contains(text(), '%s')]", text));
        List<WebElement> todos = driver.findElements(todoSelector);
        return todos;
    }

    public boolean inputHasFocus() {
        WebElement input = driver.findElement(todoInputLoc);
        return input.equals(driver.switchTo().activeElement());
    }

    public void toggleAllTodos() {
        WebElement toggleAllInput = driver.findElement(toggleAllLoc);
        toggleAllInput.click();
    }

    public boolean todoIsCompleted(String text) {
        List<WebElement> todos = getTodosByText(text);
        if (todos.isEmpty()) {
            return false;
        }
        WebElement todo = todos.get(0);
        WebElement todoItem = todo.findElement(By.xpath("./../.."));
        return todoItem.getAttribute("class").equals("completed");
    }

    public boolean clearCompletedIsVisible() {
        List<WebElement> clearCompleted = driver.findElements(clearCompletedLoc);
        return !clearCompleted.isEmpty();
    }

    public void clearCompleted() {
        List<WebElement> clearCompleted = driver.findElements(clearCompletedLoc);
        if (!clearCompleted.isEmpty()) {
            clearCompleted.get(0).click();
        }
    }

    public void deleteTodoByText(String text) {
        WebElement todo = getTodosByText(text).get(0);
        WebElement todoItem = todo.findElement(By.xpath("./../.."));
        new Actions(driver)
                .moveToElement(todoItem)
                .perform();
        WebElement destroyButton = driver.findElement(By.className("destroy"));
        destroyButton.click();
    }

    public String getCountData() {
        WebElement countDataContainer = driver.findElement(counterLoc);
        return countDataContainer.getText();
    }

    public void filterTodos(String filter) {
        switch (filter) {
            case "ACTIVE":
                driver.get(url + "/#/active");
                break;
            case "COMPLETED":
                driver.get(url + "/#/completed");
                break;
            case "ALL":
                driver.get(url + "/#/");
                break;
        }
    }
}
