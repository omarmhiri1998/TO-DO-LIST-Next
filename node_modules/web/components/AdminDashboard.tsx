"use client";

import {
    useEffect,
    useState,
    useTransition
} from "react";

import Image
    from "next/image";

import {
    useRouter
} from "next/navigation";

import {
    deleteUserAction,
    updateUserRoleAction
} from "@/app/actions/adminActions";

import "./AdminDashboard.css";

type AdminUser = {
    id: string;
    email: string;
    role: string;
    createdAt:
    string | null;
};

type Props = {
    currentUserId:
    string;

    currentUserEmail:
    string;

    initialUsers:
    AdminUser[];
};

const themes = [
    "#4f7cff",
    "#7c5cff",
    "#20a779",
    "#f58a3d"
];

export default function AdminDashboard({
    currentUserId,
    currentUserEmail,
    initialUsers
}: Props) {
    const router =
        useRouter();

    const [
        isPending,
        startTransition
    ] =
        useTransition();

    const [
        error,
        setError
    ] =
        useState("");

    useEffect(() => {
        const stored =
            localStorage.getItem(
                "todo-theme"
            );

        const index =
            stored
                ? Number(stored)
                : 0;

        const color =
            themes[index] ||
            themes[0];

        document
            .documentElement
            .style
            .setProperty(
                "--primary",
                color
            );
    }, []);

    function changeRole(
        id: string,
        role: string
    ) {
        setError("");

        startTransition(
            async () => {
                const result =
                    await updateUserRoleAction(
                        id,
                        role as
                        | "user"
                        | "admin"
                    );

                if (
                    !result.success
                ) {
                    setError(
                        result.message ||
                        "Could not update role"
                    );

                    return;
                }

                router.refresh();
            }
        );
    }

    function deleteUser(
        id: string
    ) {
        const confirmed =
            window.confirm(
                "Delete this user and all of their tasks?"
            );

        if (!confirmed) {
            return;
        }

        setError("");

        startTransition(
            async () => {
                const result =
                    await deleteUserAction(
                        id
                    );

                if (
                    !result.success
                ) {
                    setError(
                        result.message ||
                        "Could not delete user"
                    );

                    return;
                }

                router.refresh();
            }
        );
    }

    return (
        <main className="admin-page">

            <section className="admin-shell">

                <header className="admin-topbar">

                    <div className="admin-brand">

                        <Image
                            src="/images/logo.png"
                            alt="Todo Logo"
                            width={120}
                            height={120}
                        />

                        <div>
                            <span>
                                Administration
                            </span>

                            <h1>
                                User Management
                            </h1>

                            <p>
                                Manage accounts
                                and permissions
                            </p>
                        </div>

                    </div>

                    <button
                        type="button"
                        className="admin-back"
                        onClick={() =>
                            router.push("/")
                        }
                    >
                        ← Back to Tasks
                    </button>

                </header>

                <section className="admin-summary">

                    <div className="summary-card">

                        <span>
                            Total Users
                        </span>

                        <strong>
                            {
                                initialUsers.length
                            }
                        </strong>

                    </div>

                    <div className="summary-card">

                        <span>
                            Admins
                        </span>

                        <strong>
                            {
                                initialUsers
                                    .filter(
                                        (user) =>
                                            user.role ===
                                            "admin"
                                    )
                                    .length
                            }
                        </strong>

                    </div>

                    <div className="summary-card">

                        <span>
                            Regular Users
                        </span>

                        <strong>
                            {
                                initialUsers
                                    .filter(
                                        (user) =>
                                            user.role !==
                                            "admin"
                                    )
                                    .length
                            }
                        </strong>

                    </div>

                </section>

                <section className="admin-current">

                    <div>
                        <span>
                            Signed in as
                        </span>

                        <strong>
                            {currentUserEmail}
                        </strong>
                    </div>

                    <div className="admin-role-badge">
                        Admin
                    </div>

                </section>

                {error && (
                    <div className="admin-error">
                        {error}
                    </div>
                )}

                <section className="users-panel">

                    <div className="users-panel-header">

                        <div>
                            <h2>
                                Users
                            </h2>

                            <p>
                                Change roles or
                                remove accounts.
                            </p>
                        </div>

                        {isPending && (
                            <span className="admin-saving">
                                Saving...
                            </span>
                        )}

                    </div>

                    <div className="users-list">

                        {initialUsers.map(
                            (user) => {

                                const isMe =
                                    user.id ===
                                    currentUserId;

                                return (
                                    <article
                                        key={
                                            user.id
                                        }
                                        className="user-card"
                                    >

                                        <div className="user-avatar">
                                            {user.email
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <div className="user-information">

                                            <div className="user-email-row">

                                                <strong>
                                                    {user.email}
                                                </strong>

                                                {isMe && (
                                                    <span className="you-badge">
                                                        You
                                                    </span>
                                                )}

                                            </div>

                                            <span className="user-created">

                                                {user.createdAt
                                                    ? `Created ${new Date(
                                                        user.createdAt
                                                    ).toLocaleDateString(
                                                        "de-DE"
                                                    )}`
                                                    : "Existing account"}

                                            </span>

                                        </div>

                                        <div className="user-controls">

                                            <select
                                                value={
                                                    user.role
                                                }
                                                disabled={
                                                    isMe ||
                                                    isPending
                                                }
                                                onChange={(event) =>
                                                    changeRole(
                                                        user.id,
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                            >
                                                <option value="user">
                                                    User
                                                </option>

                                                <option value="admin">
                                                    Admin
                                                </option>
                                            </select>

                                            <button
                                                type="button"
                                                className="user-delete"
                                                disabled={
                                                    isMe ||
                                                    isPending
                                                }
                                                onClick={() =>
                                                    deleteUser(
                                                        user.id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </article>
                                );
                            }
                        )}

                    </div>

                </section>

            </section>

        </main>
    );
}