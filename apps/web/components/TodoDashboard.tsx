"use client";

import {
  FormEvent,
  useEffect,
  useState,
  useTransition
} from "react";

import Image from "next/image";

import {
  useRouter
} from "next/navigation";

import {
  createTodo,
  deleteTodo,
  toggleTodo,
  updateTodo
} from "../app/actions/todoActions";

import {
  logoutAction
} from "../app/actions/authActions";

import "./TodoDashboard.css";

type Todo = {
  id: string;
  category: string;
  contain: string;
  date: string;
  time: string;
  important: boolean;
  completed: boolean;
};

type Props = {
  user: {
    email: string;
    role: string;
  };

  initialTodos: Todo[];
};

const themes = [
  {
    name: "Blue",
    color: "#4f7cff"
  },
  {
    name: "Purple",
    color: "#7c5cff"
  },
  {
    name: "Green",
    color: "#20a779"
  },
  {
    name: "Orange",
    color: "#f58a3d"
  }
];

const categoryImages: Record<
  string,
  string
> = {
  work:
    "/images/work.png",

  studys:
    "/images/studys.png",

  sport:
    "/images/sport.png",

  health:
    "/images/health.png",

  voyage:
    "/images/voyage.png"
};

export default function TodoDashboard({
  user,
  initialTodos
}: Props) {
  const router =
    useRouter();

  const [
    isPending,
    startTransition
  ] = useTransition();

  const [
    category,
    setCategory
  ] = useState(
    "work"
  );

  const [
    contain,
    setContain
  ] = useState(
    ""
  );

  const [
    date,
    setDate
  ] = useState(
    ""
  );

  const [
    time,
    setTime
  ] = useState(
    ""
  );

  const [
    important,
    setImportant
  ] = useState(
    false
  );

  const [
    editingId,
    setEditingId
  ] = useState<
    string | null
  >(null);

  const [
    editTodo,
    setEditTodo
  ] = useState<
    Todo | null
  >(null);

  const [
    themeIndex,
    setThemeIndex
  ] = useState(0);

  const [
    currentTime,
    setCurrentTime
  ] = useState<
    Date | null
  >(null);

  const [
    error,
    setError
  ] = useState(
    ""
  );

  const [
    mobileFormOpen,
    setMobileFormOpen
  ] = useState(
    false
  );

  useEffect(() => {
    const savedTheme =
      localStorage.getItem(
        "todo-theme"
      );

    if (
      savedTheme !== null
    ) {
      const index =
        Number(
          savedTheme
        );

      if (
        !Number.isNaN(
          index
        ) &&
        themes[index]
      ) {
        setThemeIndex(
          index
        );
      }
    }
  }, []);

  useEffect(() => {
    document
      .documentElement
      .style
      .setProperty(
        "--primary",
        themes[
          themeIndex
        ].color
      );

    localStorage.setItem(
      "todo-theme",
      String(
        themeIndex
      )
    );
  }, [
    themeIndex
  ]);

  useEffect(() => {
    setCurrentTime(
      new Date()
    );

    const timer =
      setInterval(
        () => {
          setCurrentTime(
            new Date()
          );
        },
        1000
      );

    return () => {
      clearInterval(
        timer
      );
    };
  }, []);

  useEffect(() => {
    if (!mobileFormOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [
    mobileFormOpen
  ]);

  function isDue(
    todo: Todo
  ) {
    if (
      !currentTime ||
      !todo.date ||
      !todo.time ||
      todo.completed
    ) {
      return false;
    }

    const dueDate =
      new Date(
        `${todo.date}T${todo.time}`
      );

    return (
      currentTime >=
      dueDate
    );
  }

  function formatDate(
    value: string
  ) {
    if (!value) {
      return "";
    }

    const dateValue =
      new Date(
        `${value}T00:00:00`
      );

    return dateValue
      .toLocaleDateString(
        "de-DE"
      );
  }

  async function handleAdd(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      !contain.trim()
    ) {
      setError(
        "Please enter a task."
      );

      return;
    }

    setError("");

    startTransition(
      async () => {
        const result =
          await createTodo({
            category,
            contain,
            date,
            time,
            important
          });

        if (
          !result.success
        ) {
          setError(
            result.message ||
            "Could not add task"
          );

          return;
        }

        setCategory(
          "work"
        );

        setContain(
          ""
        );

        setDate(
          ""
        );

        setTime(
          ""
        );

        setImportant(
          false
        );

        setMobileFormOpen(
          false
        );

        router.refresh();
      }
    );
  }

  function startEdit(
    todo: Todo
  ) {
    setEditingId(
      todo.id
    );

    setEditTodo({
      ...todo
    });
  }

  function cancelEdit() {
    setEditingId(
      null
    );

    setEditTodo(
      null
    );
  }

  function saveEdit() {
    if (
      !editTodo
    ) {
      return;
    }

    if (
      !editTodo
        .contain
        .trim()
    ) {
      setError(
        "Task cannot be empty."
      );

      return;
    }

    setError("");

    startTransition(
      async () => {
        const result =
          await updateTodo(
            editTodo.id,
            {
              category:
                editTodo.category,

              contain:
                editTodo.contain,

              date:
                editTodo.date,

              time:
                editTodo.time,

              important:
                editTodo.important
            }
          );

        if (
          !result.success
        ) {
          setError(
            result.message ||
            "Could not update task"
          );

          return;
        }

        setEditingId(
          null
        );

        setEditTodo(
          null
        );

        router.refresh();
      }
    );
  }

  function handleDelete(
    id: string
  ) {
    const confirmed =
      window.confirm(
        "Delete this task?"
      );

    if (
      !confirmed
    ) {
      return;
    }

    setError("");

    startTransition(
      async () => {
        const result =
          await deleteTodo(
            id
          );

        if (
          !result.success
        ) {
          setError(
            result.message ||
            "Could not delete task"
          );

          return;
        }

        router.refresh();
      }
    );
  }

  function handleToggle(
    todo: Todo
  ) {
    setError("");

    startTransition(
      async () => {
        const result =
          await toggleTodo(
            todo.id,
            !todo.completed
          );

        if (
          !result.success
        ) {
          setError(
            "Could not update task"
          );

          return;
        }

        router.refresh();
      }
    );
  }

  async function handleLogout() {
    await logoutAction();

    router.replace(
      "/login"
    );

    router.refresh();
  }

  function changeTheme() {
    setThemeIndex(
      (
        themeIndex + 1
      ) %
      themes.length
    );
  }

  return (
    <main className="todo-page">

      <section className="todo-shell">

        <header className="todo-header">

          <div className="brand-area">

            <Image
              src="/images/logo.png"
              alt="Todo Logo"
              width={130}
              height={130}
              priority
            />

            <div>

              <h1>
                My Todo
              </h1>

              <p>
                Plan your day and
                stay focused.
              </p>

            </div>

          </div>

          <div className="header-actions">

            <button
              type="button"
              className="theme-button"
              onClick={
                changeTheme
              }
            >

              <span
                className="theme-dot"
              />

              {
                themes[
                  themeIndex
                ].name
              }

            </button>

            {user.role ===
              "admin" && (

              <button
                type="button"
                className="admin-button"
                onClick={() =>
                  router.push(
                    "/admin"
                  )
                }
              >
                Admin
              </button>

            )}

            <button
              type="button"
              className="logout-button"
              onClick={
                handleLogout
              }
            >
              Logout
            </button>

          </div>

        </header>

        <section className="welcome-card">

          <div>

            <span className="welcome-label">
              Welcome back
            </span>

            <h2>
              {user.email}
            </h2>

            <p>
              Keep moving forward,
              one task at a time.
            </p>

          </div>

          <div className="today-box">

            <span>
              Today
            </span>

            <strong>
              {currentTime
                ? currentTime
                    .toLocaleDateString(
                      "de-DE"
                    )
                : "--.--.----"}
            </strong>

            <strong>
              {currentTime
                ? currentTime
                    .toLocaleTimeString(
                      "de-DE",
                      {
                        hour:
                          "2-digit",

                        minute:
                          "2-digit"
                      }
                    )
                : "--:--"}
            </strong>

          </div>

        </section>

        <section className="create-card desktop-create-card">

          <div className="section-title">

            <div>

              <span className="section-label">
                New task
              </span>

              <h2>
                What do you want
                to do?
              </h2>

              <p>
                Add the task,
                category, date
                and time.
              </p>

            </div>

          </div>

          <form
            className="todo-form"
            onSubmit={
              handleAdd
            }
          >

            <div className="form-main">

              <div className="field task-field">

                <label
                  htmlFor="contain"
                >
                  Task
                </label>

                <input
                  id="contain"
                  type="text"
                  value={
                    contain
                  }
                  placeholder="What do you want to do?"
                  onChange={(event) =>
                    setContain(
                      event
                        .target
                        .value
                    )
                  }
                  required
                />

              </div>

              <div className="field">

                <label
                  htmlFor="category"
                >
                  Category
                </label>

                <select
                  id="category"
                  value={
                    category
                  }
                  onChange={(event) =>
                    setCategory(
                      event
                        .target
                        .value
                    )
                  }
                >

                  <option value="work">
                    Work
                  </option>

                  <option value="studys">
                    Studys
                  </option>

                  <option value="sport">
                    Sport
                  </option>

                  <option value="health">
                    Health
                  </option>

                  <option value="voyage">
                    Voyage
                  </option>

                </select>

              </div>

              <div className="field">

                <label
                  htmlFor="date"
                >
                  Date
                </label>

                <input
                  id="date"
                  type="date"
                  value={
                    date
                  }
                  onChange={(event) =>
                    setDate(
                      event
                        .target
                        .value
                    )
                  }
                />

              </div>

              <div className="field">

                <label
                  htmlFor="time"
                >
                  Time
                </label>

                <input
                  id="time"
                  type="time"
                  value={
                    time
                  }
                  onChange={(event) =>
                    setTime(
                      event
                        .target
                        .value
                    )
                  }
                />

              </div>

            </div>

            <div className="form-bottom">

              <label className="important-check">

                <input
                  type="checkbox"
                  checked={
                    important
                  }
                  onChange={(event) =>
                    setImportant(
                      event
                        .target
                        .checked
                    )
                  }
                />

                <span>
                  Important
                </span>

              </label>

              <button
                type="submit"
                className="add-button"
                disabled={
                  isPending
                }
              >
                {isPending
                  ? "Saving..."
                  : "Add Task +"}
              </button>

            </div>

            {error && (
              <p className="todo-error">
                {error}
              </p>
            )}

          </form>

        </section>

        {mobileFormOpen && (
          <div
            className="mobile-form-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-form-title"
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                setMobileFormOpen(
                  false
                );
              }
            }}
          >
            <section className="mobile-form-sheet">

              <div className="mobile-form-header">
                <div>
                  <span className="section-label">
                    New task
                  </span>

                  <h2 id="mobile-form-title">
                    Add a Todo
                  </h2>
                </div>

                <button
                  type="button"
                  className="mobile-form-close"
                  aria-label="Close add task form"
                  onClick={() =>
                    setMobileFormOpen(
                      false
                    )
                  }
                >
                  ×
                </button>
              </div>

              <form
                className="todo-form mobile-todo-form"
                onSubmit={
                  handleAdd
                }
              >
                <div className="form-main">

                  <div className="field task-field">
                    <label htmlFor="mobile-contain">
                      Task
                    </label>

                    <input
                      id="mobile-contain"
                      type="text"
                      value={
                        contain
                      }
                      placeholder="What do you want to do?"
                      onChange={(event) =>
                        setContain(
                          event.target.value
                        )
                      }
                      autoFocus
                      required
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="mobile-category">
                      Category
                    </label>

                    <select
                      id="mobile-category"
                      value={
                        category
                      }
                      onChange={(event) =>
                        setCategory(
                          event.target.value
                        )
                      }
                    >
                      <option value="work">
                        Work
                      </option>

                      <option value="studys">
                        Studys
                      </option>

                      <option value="sport">
                        Sport
                      </option>

                      <option value="health">
                        Health
                      </option>

                      <option value="voyage">
                        Voyage
                      </option>
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="mobile-date">
                      Date
                    </label>

                    <input
                      id="mobile-date"
                      type="date"
                      value={
                        date
                      }
                      onChange={(event) =>
                        setDate(
                          event.target.value
                        )
                      }
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="mobile-time">
                      Time
                    </label>

                    <input
                      id="mobile-time"
                      type="time"
                      value={
                        time
                      }
                      onChange={(event) =>
                        setTime(
                          event.target.value
                        )
                      }
                    />
                  </div>

                </div>

                <div className="form-bottom">
                  <label className="important-check">
                    <input
                      type="checkbox"
                      checked={
                        important
                      }
                      onChange={(event) =>
                        setImportant(
                          event.target.checked
                        )
                      }
                    />

                    <span>
                      Important
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="add-button"
                    disabled={
                      isPending
                    }
                  >
                    {isPending
                      ? "Saving..."
                      : "Add Task +"}
                  </button>
                </div>

                {error && (
                  <p className="todo-error">
                    {error}
                  </p>
                )}
              </form>

            </section>
          </div>
        )}

        <section className="tasks-section">

          <div className="tasks-heading">

            <div>

              <span className="section-label">
                Tasks
              </span>

              <h2>
                Your Todo List
              </h2>

              <p>
                {
                  initialTodos
                    .length
                }{" "}
                {
                  initialTodos
                    .length ===
                  1
                    ? "task"
                    : "tasks"
                }
              </p>

            </div>

          </div>

          {initialTodos.length ===
          0 ? (

            <div className="empty-state">

              <div className="empty-icon">
                ✓
              </div>

              <h3>
                Your list is empty
              </h3>

              <p>
                Add your first task
                above.
              </p>

            </div>

          ) : (

            <div className="todo-list">

              {initialTodos.map(
                (todo) => {

                  const due =
                    isDue(
                      todo
                    );

                  const editing =
                    editingId ===
                    todo.id;

                  return (
                    <article
                      key={
                        todo.id
                      }
                      className={[
                        "todo-card",

                        todo.important
                          ? "todo-important"
                          : "",

                        due
                          ? "todo-due"
                          : "",

                        todo.completed
                          ? "todo-completed"
                          : ""
                      ].join(" ")}
                    >

                      <div className="todo-card-image">

                        <Image
                          src={
                            categoryImages[
                              todo.category
                            ] ||
                            categoryImages.work
                          }
                          alt={
                            todo.category
                          }
                          width={82}
                          height={82}
                        />

                      </div>

                      <div className="todo-card-content">

                        {due && (
                          <div className="due-badge">
                            ⚠ Due now
                          </div>
                        )}

                        {todo.important && (
                          <div className="important-badge">
                            Important
                          </div>
                        )}

                        {editing &&
                        editTodo ? (

                          <div className="edit-form">

                            <div className="edit-field">

                              <label>
                                Task
                              </label>

                              <input
                                type="text"
                                value={
                                  editTodo
                                    .contain
                                }
                                onChange={(event) =>
                                  setEditTodo({
                                    ...editTodo,

                                    contain:
                                      event
                                        .target
                                        .value
                                  })
                                }
                              />

                            </div>

                            <div className="edit-grid">

                              <div className="edit-field">

                                <label>
                                  Category
                                </label>

                                <select
                                  value={
                                    editTodo
                                      .category
                                  }
                                  onChange={(event) =>
                                    setEditTodo({
                                      ...editTodo,

                                      category:
                                        event
                                          .target
                                          .value
                                    })
                                  }
                                >

                                  <option value="work">
                                    Work
                                  </option>

                                  <option value="studys">
                                    Studys
                                  </option>

                                  <option value="sport">
                                    Sport
                                  </option>

                                  <option value="health">
                                    Health
                                  </option>

                                  <option value="voyage">
                                    Voyage
                                  </option>

                                </select>

                              </div>

                              <div className="edit-field">

                                <label>
                                  Date
                                </label>

                                <input
                                  type="date"
                                  value={
                                    editTodo
                                      .date
                                  }
                                  onChange={(event) =>
                                    setEditTodo({
                                      ...editTodo,

                                      date:
                                        event
                                          .target
                                          .value
                                    })
                                  }
                                />

                              </div>

                              <div className="edit-field">

                                <label>
                                  Time
                                </label>

                                <input
                                  type="time"
                                  value={
                                    editTodo
                                      .time
                                  }
                                  onChange={(event) =>
                                    setEditTodo({
                                      ...editTodo,

                                      time:
                                        event
                                          .target
                                          .value
                                    })
                                  }
                                />

                              </div>

                            </div>

                            <label className="important-check">

                              <input
                                type="checkbox"
                                checked={
                                  editTodo
                                    .important
                                }
                                onChange={(event) =>
                                  setEditTodo({
                                    ...editTodo,

                                    important:
                                      event
                                        .target
                                        .checked
                                  })
                                }
                              />

                              <span>
                                Important
                              </span>

                            </label>

                            <div className="card-actions">

                              <button
                                type="button"
                                className="save-button"
                                onClick={
                                  saveEdit
                                }
                                disabled={
                                  isPending
                                }
                              >
                                Save
                              </button>

                              <button
                                type="button"
                                className="cancel-button"
                                onClick={
                                  cancelEdit
                                }
                              >
                                Cancel
                              </button>

                            </div>

                          </div>

                        ) : (

                          <>

                            <div className="todo-card-top">

                              <span className="category-badge">
                                {
                                  todo.category
                                }
                              </span>

                              <button
                                type="button"
                                className="complete-button"
                                onClick={() =>
                                  handleToggle(
                                    todo
                                  )
                                }
                                disabled={
                                  isPending
                                }
                              >
                                {todo.completed
                                  ? "✓ Completed"
                                  : "Mark Done"}
                              </button>

                            </div>

                            <h3>
                              {
                                todo.contain
                              }
                            </h3>

                            <div className="todo-datetime">

                              {todo.date && (

                                <div className="date-item">

                                  <span className="date-icon">
                                    📅
                                  </span>

                                  <div>
                                    <small>
                                      Date
                                    </small>

                                    <strong>
                                      {
                                        formatDate(
                                          todo.date
                                        )
                                      }
                                    </strong>
                                  </div>

                                </div>

                              )}

                              {todo.time && (

                                <div className="date-item">

                                  <span className="date-icon">
                                    🕒
                                  </span>

                                  <div>
                                    <small>
                                      Time
                                    </small>

                                    <strong>
                                      {
                                        todo.time
                                      }
                                    </strong>
                                  </div>

                                </div>

                              )}

                            </div>

                            <div className="card-actions">

                              <button
                                type="button"
                                className="edit-button"
                                onClick={() =>
                                  startEdit(
                                    todo
                                  )
                                }
                              >
                                ✎ Edit
                              </button>

                              <button
                                type="button"
                                className="delete-button"
                                onClick={() =>
                                  handleDelete(
                                    todo.id
                                  )
                                }
                              >
                                − Delete
                              </button>

                            </div>

                          </>

                        )}

                      </div>

                    </article>
                  );
                }
              )}

            </div>

          )}

        </section>

        {!mobileFormOpen && (
          <button
            type="button"
            className="mobile-add-fab"
            onClick={() =>
              setMobileFormOpen(
                true
              )
            }
            aria-label="Add task"
          >
            <span className="mobile-add-icon">
              +
            </span>
            <span>
              Add Todo
            </span>
          </button>
        )}

      </section>

    </main>
  );
}