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
    registerAction
} from "../actions/authActions";

import "../login/Auth.css";

export default function SignupPage() {
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
        confirmPassword,
        setConfirmPassword
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

        if (
            password !==
            confirmPassword
        ) {
            setError(
                "Passwords do not match"
            );

            return;
        }

        if (
            password.length < 6
        ) {
            setError(
                "Password must contain at least 6 characters"
            );

            return;
        }

        setLoading(true);

        try {
            const result =
                await registerAction({
                    email,
                    password
                });

            if (!result.success) {
                setError(
                    result.message ||
                    "Registration failed"
                );

                return;
            }

            router.push(
                "/login"
            );

        } catch {
            setError(
                "Registration failed"
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
                        Create Account
                    </h1>

                    <p>
                        Create your account and
                        organize your day.
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
                            placeholder="Create a password"
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            autoComplete="new-password"
                            required
                        />

                    </div>

                    <div className="auth-field">

                        <label
                            htmlFor="confirmPassword"
                        >
                            Confirm Password
                        </label>

                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="Repeat your password"
                            value={
                                confirmPassword
                            }
                            onChange={(event) =>
                                setConfirmPassword(
                                    event.target.value
                                )
                            }
                            autoComplete="new-password"
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
                            ? "Creating account..."
                            : "Create Account"}
                    </button>

                </form>

                <div className="auth-divider">
                    <span />
                    <p>
                        Already registered?
                    </p>
                    <span />
                </div>

                <p className="auth-switch">

                    Already have an account?

                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                "/login"
                            )
                        }
                    >
                        Login
                    </button>

                </p>

            </div>

        </main>
    );
}