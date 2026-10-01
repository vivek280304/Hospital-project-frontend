import { useState } from "react";
import {
  LockKeyhole,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  KeyRound,
} from "lucide-react";

import authService from "../../services/authService";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [showCurrent, setShowCurrent] =
    useState(false);

  const [showNew, setShowNew] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  // =========================================================
  // PASSWORD REQUIREMENTS
  // =========================================================

  const passwordChecks = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
  };

  const passwordValid =
    passwordChecks.length &&
    passwordChecks.uppercase &&
    passwordChecks.lowercase &&
    passwordChecks.number;

  // =========================================================
  // SUBMIT
  // =========================================================

  const submit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!currentPassword || !newPassword) {
      setError(
        "Please fill in all required fields."
      );
      return;
    }

    if (!passwordValid) {
      setError(
        "Please make sure your new password meets all requirements."
      );
      return;
    }

    if (currentPassword === newPassword) {
      setError(
        "New password must be different from your current password."
      );
      return;
    }

    try {
      setLoading(true);

      await authService.changePassword({
        currentPassword,
        newPassword,
      });

      setMessage(
        "Your password has been changed successfully."
      );

      setCurrentPassword("");
      setNewPassword("");
      setShowCurrent(false);
      setShowNew(false);

    } catch (e) {
      setError(
        e.response?.data?.message ||
          "Unable to change password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page
      title="Change Password"
      subtitle="Update your password to keep your MediCare account secure"
    >

      <div
        className="
          grid
          gap-6

          lg:grid-cols-[1fr_340px]
        "
      >

        {/* ===================================================
            MAIN FORM
        =================================================== */}

        <section
          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            shadow-[0_2px_10px_rgba(15,23,42,0.04)]
          "
        >

          {/* HEADER */}

          <div
            className="
              border-b
              border-slate-100
              px-5
              py-5

              sm:px-7
              sm:py-6
            "
          >

            <div className="flex items-center gap-3">

              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-50
                  text-blue-600
                "
              >
                <LockKeyhole size={21} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Update your password
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Use a strong password that you don't use elsewhere.
                </p>
              </div>

            </div>

          </div>


          {/* FORM */}

          <form
            onSubmit={submit}
            className="p-5 sm:p-7"
          >

            {/* SUCCESS */}

            {message && (
              <div
                className="
                  mb-5
                  flex
                  items-start
                  gap-3
                  rounded-2xl
                  border
                  border-emerald-200
                  bg-emerald-50
                  p-4
                "
              >
                <CheckCircle2
                  size={19}
                  className="
                    mt-0.5
                    shrink-0
                    text-emerald-600
                  "
                />

                <div>
                  <p className="text-sm font-semibold text-emerald-700">
                    Password updated
                  </p>

                  <p className="mt-0.5 text-xs text-emerald-600">
                    {message}
                  </p>
                </div>
              </div>
            )}


            {/* ERROR */}

            {error && (
              <div
                className="
                  mb-5
                  flex
                  items-start
                  gap-3
                  rounded-2xl
                  border
                  border-red-200
                  bg-red-50
                  p-4
                "
              >
                <AlertCircle
                  size={19}
                  className="
                    mt-0.5
                    shrink-0
                    text-red-600
                  "
                />

                <div>
                  <p className="text-sm font-semibold text-red-700">
                    Unable to update password
                  </p>

                  <p className="mt-0.5 text-xs text-red-600">
                    {error}
                  </p>
                </div>
              </div>
            )}


            {/* CURRENT PASSWORD */}

            <PasswordField
              label="Current Password"
              value={currentPassword}
              onChange={setCurrentPassword}
              show={showCurrent}
              setShow={setShowCurrent}
              placeholder="Enter your current password"
            />


            {/* NEW PASSWORD */}

            <div className="mt-5">

              <PasswordField
                label="New Password"
                value={newPassword}
                onChange={setNewPassword}
                show={showNew}
                setShow={setShowNew}
                placeholder="Create a new password"
              />


              {/* PASSWORD STRENGTH */}

              {newPassword && (
                <div className="mt-3">

                  <div className="mb-2 flex items-center justify-between">

                    <span className="text-xs font-medium text-slate-500">
                      Password requirements
                    </span>

                    <span
                      className={`
                        text-xs
                        font-semibold

                        ${
                          passwordValid
                            ? "text-emerald-600"
                            : "text-slate-400"
                        }
                      `}
                    >
                      {passwordValid
                        ? "Strong password"
                        : "Complete all requirements"}
                    </span>

                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">

                    <PasswordCheck
                      checked={
                        passwordChecks.length
                      }
                      text="At least 8 characters"
                    />

                    <PasswordCheck
                      checked={
                        passwordChecks.uppercase
                      }
                      text="One uppercase letter"
                    />

                    <PasswordCheck
                      checked={
                        passwordChecks.lowercase
                      }
                      text="One lowercase letter"
                    />

                    <PasswordCheck
                      checked={
                        passwordChecks.number
                      }
                      text="One number"
                    />

                  </div>

                </div>
              )}

            </div>


            {/* SUBMIT */}

            <div
              className="
                mt-7
                flex
                flex-col-reverse
                gap-3

                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >

              <p className="text-xs text-slate-400">
                You'll need your current password.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-blue-600
                  px-6
                  py-3
                  text-sm
                  font-bold
                  text-white
                  shadow-sm
                  transition

                  hover:bg-blue-700
                  hover:shadow-md

                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >

                {loading ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />

                    Updating...
                  </>
                ) : (
                  <>
                    <KeyRound size={17} />

                    Change Password
                  </>
                )}

              </button>

            </div>

          </form>

        </section>


        {/* ===================================================
            SECURITY SIDE CARD
        =================================================== */}

        <aside>

          <div
            className="
              rounded-3xl
              border
              border-blue-100
              bg-white
              p-6
              shadow-[0_2px_10px_rgba(15,23,42,0.04)]
            "
          >

            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-blue-50
                text-blue-600
              "
            >
              <ShieldCheck size={24} />
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">
              Keep your account secure
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              A strong password helps protect your personal
              information and medical records.
            </p>


            {/* SECURITY TIPS */}

            <div className="mt-6 space-y-3">

              <SecurityTip>
                Use a password with 8 or more characters.
              </SecurityTip>

              <SecurityTip>
                Mix uppercase, lowercase and numbers.
              </SecurityTip>

              <SecurityTip>
                Don't reuse passwords from other accounts.
              </SecurityTip>

              <SecurityTip>
                Never share your password with anyone.
              </SecurityTip>

            </div>

          </div>


          {/* SMALL SECURITY STATUS */}

          <div
            className="
              mt-4
              flex
              items-center
              gap-3
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-4
            "
          >

            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                bg-emerald-50
                text-emerald-600
              "
            >
              <ShieldCheck size={17} />
            </div>

            <div>
              <p className="text-xs font-bold text-slate-700">
                Account Security
              </p>

              <p className="mt-0.5 text-[11px] text-slate-400">
                Keep your credentials private
              </p>
            </div>

          </div>

        </aside>

      </div>

    </Page>
  );
}


/* =============================================================
   PASSWORD FIELD
============================================================= */

function PasswordField({
  label,
  value,
  onChange,
  show,
  setShow,
  placeholder,
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div
        className="
          flex
          h-12
          items-center
          rounded-xl
          border
          border-slate-200
          bg-slate-50
          px-3
          transition

          focus-within:border-blue-400
          focus-within:bg-white
          focus-within:ring-4
          focus-within:ring-blue-50
        "
      >

        <LockKeyhole
          size={17}
          className="mr-2 shrink-0 text-slate-400"
        />

        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          placeholder={placeholder}
          required
          className="
            min-w-0
            flex-1
            bg-transparent
            text-sm
            text-slate-700
            outline-none
            placeholder:text-slate-400
          "
        />

        <button
          type="button"
          onClick={() =>
            setShow(!show)
          }
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-lg
            text-slate-400
            transition

            hover:bg-slate-100
            hover:text-slate-600
          "
          aria-label={
            show
              ? "Hide password"
              : "Show password"
          }
        >
          {show ? (
            <EyeOff size={17} />
          ) : (
            <Eye size={17} />
          )}
        </button>

      </div>

    </div>
  );
}


/* =============================================================
   PASSWORD CHECK
============================================================= */

function PasswordCheck({
  checked,
  text,
}) {
  return (
    <div className="flex items-center gap-2">

      <CheckCircle2
        size={14}
        className={
          checked
            ? "text-emerald-500"
            : "text-slate-300"
        }
      />

      <span
        className={`
          text-xs
          ${
            checked
              ? "text-slate-600"
              : "text-slate-400"
          }
        `}
      >
        {text}
      </span>

    </div>
  );
}


/* =============================================================
   SECURITY TIP
============================================================= */

function SecurityTip({ children }) {
  return (
    <div className="flex items-start gap-3">

      <CheckCircle2
        size={16}
        className="
          mt-0.5
          shrink-0
          text-blue-500
        "
      />

      <p className="text-xs leading-5 text-slate-500">
        {children}
      </p>

    </div>
  );
}


/* =============================================================
   PAGE
============================================================= */

function Page({
  title,
  subtitle,
  children,
}) {
  return (
    <div className="mx-auto max-w-7xl">

      <div className="mb-6">

        <div className="flex items-center gap-2">

          <span className="h-2 w-2 rounded-full bg-blue-600" />

          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-wider
              text-blue-600
            "
          >
            Account Settings
          </p>

        </div>

        <h1
          className="
            mt-2
            text-2xl
            font-bold
            tracking-tight
            text-slate-900

            sm:text-3xl
          "
        >
          {title}
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          {subtitle}
        </p>

      </div>

      {children}

    </div>
  );
}