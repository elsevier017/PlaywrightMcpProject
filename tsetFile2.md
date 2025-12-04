Feature: Promotional Banner Visibility
  Scenario: User views homepage banner
    Given the user is on the homepage
    When the page loads
    Then the banner should contain the text "All QA engineers can use this website for automation practice and API testing"
    And an image of a person holding shopping bags should be displayed next to the banner

Feature: API List Navigation
  Scenario: User clicks on "APIs list for practice" button
    Given the user is on the homepage
    When the user clicks the "APIs list for practice" button
    Then the browser should navigate to the API list page
    And the page should display available APIs for testing

Feature: Test Cases Navigation
  Scenario: User clicks on "Test Cases" button
    Given the user is on the homepage
    When the user clicks the "Test Cases" button
    Then the browser should navigate to the Test Cases page
    And the page should list various automation test scenarios


Feature: Homepage Accessibility
  Scenario: User opens the AutomationExercise homepage
    Given the user navigates to "https://automationexercise.com"
    When the homepage loads
    Then the page should display the banner with text "Full-Fledged practice website for Automation Engineers"
    And the user should see buttons labeled "Test Cases" and "APIs list for practice"
