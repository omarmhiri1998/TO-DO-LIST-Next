"use client";

import {
    FormEvent,
    useState
} from "react";

import Image
    from "next/image";

import {
    useRouter
} from "next/navigation";

import {
    loginAction
} from "../actions/authActions";

import "./Auth.css";

export default function LoginPage() {
    const router =
        useRouter();

    const [
        email,
        setEmail
    ] = useState("");

    const [
        password,
        setPassword
    ] = useState("");

    const [
        error,
        setError
    ] = useState("");

    const [
        loading,
        setLoading
    ] = useState(false);

    async function handleSubmit(
        event:
            FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const result =
                await loginAction({
                    email,
                    password
                });

            if (!result.success) {
                setError(
                    result.message ||
                    "Login failed"
                );

                return;
            }

            router.push("/");
            router.refresh();

        } catch {
            setError(
                "Login failed"
            );

        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="auth-page">

            <div className="auth-card">

                <div className="auth-brand">

                    <div className="auth-logo">
                        <Image
                            src="/images/logo.png"
                            alt="Todo Logo"
                            width={170}
                            height={170}
                            priority
                        />
                    </div>

                    <h1>
                        Welcome Back
                    </h1>

                    <p>
                        Log in and continue
                        organizing your tasks.
                    </p>

                </div>

                <form
                    className="auth-form"
                    onSubmit={
                        handleSubmit
                    }
                >

                    <div className="auth-field">

                        <label
                            htmlFor="email"
                        >
                            Email
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                            autoComplete="email"
                            required
                        />

                    </div>

                    <div className="auth-field">

                        <label
                            htmlFor="password"
                        >
                            Password
                        </label>

                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            autoComplete="current-password"
                            required
                        />

                    </div>

                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>

                </form>

                <div className="auth-divider">
                    <span />
                    <p>
                        New here?
                    </p>
                    <span />
                </div>

                <p className="auth-switch">

                    Don't have an account?

                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                "/signup"
                            )
                        }
                    >
                        Sign Up
                    </button>

                </p>

            </div>

        </main>
    );
}