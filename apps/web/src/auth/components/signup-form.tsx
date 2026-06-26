import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";

import { useSignUp } from "../hooks";
import { signupSchema } from "../schemas";
import { AuthMark } from "./auth-shell";

export function SignupForm() {
  const signUp = useSignUp();
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: signupSchema,
    },
    onSubmit: async ({ value }) => {
      await signUp.mutateAsync({ email: value.email, password: value.password });
      void navigate({ to: "/auth/confirm-email" });
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
      <h1>Create your account</h1>
      <p className="auth-sub">Start putting your TikTok on autopilot</p>

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

      <form.Field
        name="confirmPassword"
        children={(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <div className="auth-field">
              <label htmlFor={field.name}>Confirm password</label>
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

      {signUp.error && <div className="auth-formerr">{signUp.error.message}</div>}

      <button type="submit" className="btn btn-blue auth-submit" disabled={signUp.isPending}>
        {signUp.isPending ? "Creating account…" : "Create account"}
      </button>

      <p className="auth-foot">
        Already have an account? <Link to="/auth/login">Log in</Link>
      </p>
    </form>
  );
}
