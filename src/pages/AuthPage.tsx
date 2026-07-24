import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";

function friendlyAuthError(err: unknown, t: TFunction): string {
  const code = (err as { code?: string })?.code;
  switch (code) {
    case "auth/invalid-email":
      return t("auth.errors.invalidEmail");
    case "auth/email-already-in-use":
      return t("auth.errors.emailInUse");
    case "auth/weak-password":
      return t("auth.errors.weakPassword");
    case "auth/missing-password":
      return t("auth.errors.missingPassword");
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return t("auth.errors.wrongCredentials");
    default:
      if (err instanceof Error) {
        return (
          err.message
            .replace(/^Firebase:\s*/i, "")
            .replace(/\s*\(auth\/[^)]+\)\.?$/i, "")
            .trim() || t("auth.errors.generic")
        );
      }
      return t("auth.errors.generic");
  }
}

function AuthPage() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState<"man" | "woman">("man");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { t } = useTranslation();
  const inputClass =
    "w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-900";

  const handleSubmit = async () => {
    setError("");
    if (mode === "signup") {
      if (!fullName.trim() || !dob || !address.trim()) {
        setError(t("auth.errors.fillAllFields"));
        return;
      }
      if (password.length < 6) {
        setError(t("auth.errors.passwordTooShort"));
        return;
      }
    }
    setBusy(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await signup(email, password, {
          fullName: fullName.trim(),
          dob,
          address: address.trim(),
          avatar,
        });
      }
    } catch (err) {
      setError(friendlyAuthError(err, t));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div className="max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-xl font-bold">
          {mode === "login" ? t("auth.login") : t("auth.createAccount")}
        </h2>

        <div className="mt-4 flex flex-col gap-3">
          {mode === "signup" && (
            <div>
              <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">
                {t("auth.fullName")}
              </label>
              <input
                type="text"
                placeholder={t("auth.fullNamePlaceholder")}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={inputClass}
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">
              {t("auth.email")}
            </label>
            <input
              type="email"
              placeholder={t("auth.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">
              {t("auth.password")}
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
            {mode === "signup" && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {t("auth.passwordHint")}
              </p>
            )}
          </div>

          {mode === "signup" && (
            <>
              <div>
                <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">
                  {t("auth.dob")}
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">
                  {t("auth.address")}
                </label>
                <textarea
                  placeholder={t("auth.addressPlaceholder")}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">
                  {t("auth.avatar")}
                </label>
                <div className="flex gap-2">
                  {(["man", "woman"] as const).map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setAvatar(a)}
                      className={`flex-1 rounded-md border px-3 py-2 text-sm capitalize transition-colors ${
                        avatar === a
                          ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                          : "border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                      }`}
                    >
                      {a === "woman"
                        ? t("account.avatarWoman")
                        : t("account.avatarMan")}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={busy}
            className="mt-1 rounded-md bg-blue-600 px-3 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {busy
              ? t("auth.pleaseWait")
              : mode === "login"
                ? t("auth.login")
                : t("auth.signUp")}
          </button>
        </div>

        <button
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setError("");
          }}
          className="mt-4 text-sm text-blue-600 hover:underline"
        >
          {mode === "login"
            ? t("auth.needAccount")
            : t("auth.haveAccount")}
        </button>
      </div>
    </div>
  );
}

export default AuthPage;
