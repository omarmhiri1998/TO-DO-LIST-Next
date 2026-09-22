import {
  expect,
  test
} from "@playwright/test";

test(
  "user can signup, login and manage todos",
  async ({ page }) => {
    const unique =
      Date.now();

    const email =
      `e2e-${unique}@example.com`;

    const password =
      "Test123456";

    const todoText =
      `Playwright Todo ${unique}`;

    const editedText =
      `Edited Todo ${unique}`;

    await page.goto(
      "/signup"
    );

    await page
      .getByLabel(
        "Email"
      )
      .fill(email);

    await page
      .getByLabel(
        "Password",
        {
          exact: true
        }
      )
      .fill(password);

    await page
      .getByLabel(
        "Confirm Password",
        {
          exact: true
        }
      )
      .fill(password);

    await page
      .getByRole(
        "button",
        {
          name:
            "Create Account"
        }
      )
      .click();

    await expect(
      page
    ).toHaveURL(
      /\/login/
    );

    await page
      .getByLabel(
        "Email"
      )
      .fill(email);

    await page
      .getByLabel(
        "Password",
        {
          exact: true
        }
      )
      .fill(password);

    await page
      .getByRole(
        "button",
        {
          name: "Login",
          exact: true
        }
      )
      .click();

    await expect(
      page
    ).toHaveURL(
      /\/$/
    );

    await page
      .getByRole(
        "textbox",
        {
          name: "Task",
          exact: true
        }
      )
      .fill(todoText);

    await page
      .getByLabel(
        "Category",
        {
          exact: true
        }
      )
      .selectOption(
        "studys"
      );

    await page
      .getByLabel(
        "Date",
        {
          exact: true
        }
      )
      .fill(
        "2026-09-30"
      );

    await page
      .getByLabel(
        "Time",
        {
          exact: true
        }
      )
      .fill(
        "20:00"
      );

    await page
      .getByLabel(
        "Important",
        {
          exact: true
        }
      )
      .check();

    await page
      .getByRole(
        "button",
        {
          name:
            "Add Task +",
          exact: true
        }
      )
      .click();

    await expect(
      page.getByText(
        todoText,
        {
          exact: true
        }
      )
    ).toBeVisible();

    const card =
      page
        .locator(
          ".todo-card"
        )
        .filter({
          hasText:
            todoText
        });

    await expect(
      card
    ).toBeVisible();

    await card
      .getByRole(
        "button",
        {
          name: /Edit/
        }
      )
      .click();

    const editForm =
      page.locator(
        ".edit-form"
      );

    await expect(
      editForm
    ).toBeVisible();

    await editForm
      .locator(
        'input[type="text"]'
      )
      .fill(
        editedText
      );

    await editForm
      .getByRole(
        "button",
        {
          name: "Save",
          exact: true
        }
      )
      .click();

    await expect(
      page.getByText(
        editedText,
        {
          exact: true
        }
      )
    ).toBeVisible();

    const editedCard =
      page
        .locator(
          ".todo-card"
        )
        .filter({
          hasText:
            editedText
        });

    await expect(
      editedCard
    ).toBeVisible();

    await editedCard
      .getByRole(
        "button",
        {
          name:
            "Mark Done",
          exact: true
        }
      )
      .click();

    await expect(
      editedCard
        .getByRole(
          "button",
          {
            name:
              /Completed/
          }
        )
    ).toBeVisible();

    page.once(
      "dialog",
      async dialog => {
        await dialog.accept();
      }
    );

    await editedCard
      .getByRole(
        "button",
        {
          name:
            /Delete/
        }
      )
      .click();

    await expect(
      page.getByText(
        editedText,
        {
          exact: true
        }
      )
    ).not.toBeVisible();

    await page
      .getByRole(
        "button",
        {
          name:
            "Logout",
          exact: true
        }
      )
      .click();

    await expect(
      page
    ).toHaveURL(
      /\/login/
    );
  }
);