import { useEffect, useRef, useState } from "react";
import { useProfile } from "../context/ProfileContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useTranslation } from "react-i18next";

const inputClasses =
  "mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900";

function Account() {
  const { profile, loading, updateProfile } = useProfile();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { t } = useTranslation();

  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState<"man" | "woman">("man");
  const [saving, setSaving] = useState(false);

  const initialized = useRef(false);

  useEffect(() => {
    if (profile && !initialized.current) {
      setFullName(profile.fullName ?? "");
      setDob(profile.dob ?? "");
      setAddress(profile.address ?? "");
      setAvatar(profile.avatar ?? "man");
      initialized.current = true;
    }
  }, [profile]);

  if (loading) {
    return (
      <p className="text-gray-500 dark:text-gray-400">{t("account.loading")}</p>
    );
  }

  const handleSave = async () => {
    if (!fullName.trim()) {
      showToast(t("account.toast.nameRequired"), "error");
      return;
    }
    setSaving(true);
    try {
      await updateProfile({ fullName: fullName.trim(), dob, address, avatar });
      showToast(t("account.toast.updated"), "success");
    } catch {
      showToast(t("account.toast.saveFailed"), "error");
    } finally {
      setSaving(false);
    }
  };

  const face = avatar === "woman" ? "👩" : "👨";
  return (
    <div className="max-w-lg">
      <h2 className="text-2xl font-bold">{t("account.title")}</h2>
      <p className="mt-1 text-gray-500 dark:text-gray-400">
        {t("account.subtitle")}
      </p>
      <div className="mt-6 space-y-4 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-2xl dark:bg-blue-900">
            {face}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {user?.email}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">
            {t("account.fullName")}
          </label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={inputClasses}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            {t("account.dob")}
          </label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className={inputClasses}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            {t("account.address")}
          </label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={2}
            className={inputClasses}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            {t("account.avatar")}
          </label>
          <div className="mt-1 flex gap-2">
            {(["man", "woman"] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setAvatar(opt)}
                className={`rounded-md border px-4 py-2 text-sm ${
                  avatar === opt
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                {opt === "woman"
                  ? `👩 ${t("account.avatarWoman")}`
                  : `👨 ${t("account.avatarMan")}`}{" "}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? t("account.saving") : t("account.save")}{" "}
        </button>
      </div>
    </div>
  );
}

export default Account;
