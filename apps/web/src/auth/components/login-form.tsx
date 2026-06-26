import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";

import { useSignIn } from "../hooks";
import { loginSchema } from "../schemas";
import { AuthMark } from "./auth-shell";

export function LoginForm() {
  const signIn = useSignIn();
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      await signIn.mutateAsync(value);
      void navigate({ to: "/dashboard" });
    },
  });

  return (
    <form
      className="auth-card"
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
    >
      <AuthMark />
      <h1>Welcome back</h1>
      <p className="auth-sub">Log in to your Blimely account</p>

      <form.Field
        name="email"
        children={(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <div className="auth-field">
              <label htmlFor={field.name}>Email</label>
              <input
                id={field.name}
                type="email"
                placeholder="you@example.com"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
              />
              {isInvalid && <p className="auth-err">{field.state.meta.errors[0]?.message}</p>}
            </div>
          );
        }}
      />

      <form.Field
        name="password"
        children={(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <div className="auth-field">
              <label htmlFor={field.name}>Password</label>
              <input
                id={field.name}
                type="password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
              />
              {isInvalid && <p className="auth-err">{field.state.meta.errors[0]?.message}</p>}
            </div>
          );
        }}
      />

      {signIn.error && <div className="auth-formerr">{signIn.error.message}</div>}

      <button type="submit" className="btn btn-blue auth-submit" disabled={signIn.isPending}>
        {signIn.isPending ? "Signing in…" : "Sign in"}
      </button>

      <p className="auth-foot">
        Don&apos;t have an account? <Link to="/auth/signup">Sign up</Link>
      </p>
    </form>
  );
}
