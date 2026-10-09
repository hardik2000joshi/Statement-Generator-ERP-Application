import { Check, Moon, Sun, Palette, SlidersHorizontal, Info, SettingsIcon, Bell, Shield } from "lucide-react";
import { useTheme } from "../context/ThemeContext"
import { useState } from "react";

export const Settings = () => {
    const {theme, setTheme} = useTheme();
    const [preferences, setPreferences] = useState({
    currency: "INR",
    dateFormat: "DD/MM/YYYY",
    defaultStatementType: "BASIC",
  });
   const [notifications, setNotifications] = useState({
    emailNotifications: true,
    statementNotifications: true,
    invoiceNotifications: true,
  });
  const [privacy, setPrivacy] = useState({
    showSensitiveInformation: false,
  });
   const [behaviour, setBehaviour] = useState({
    confirmBeforeDelete: true,
    confirmBeforeGenerate: true,
    defaultPage: "Dashboard",
  });

  const handlePreferenceChange = (e) =>{
    const {name, value} = e.target;
    setPreferences((prev) => ({
        ...prev,
        [name]: value
    }))
  }

  const handleNotificationChange = (name) => {
    setNotifications((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handlePrivacyChange = (name) => {
    setPrivacy((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  }

  const handleBehaviourChange = (name) => {
    setBehaviour((previous) => ({
      ...previous,
      [name]: !previous[name],
    }));
  };
    const UsageStep = ({
  number,
  title,
  description,
}) => {
  return (
    <div className="flex gap-4">

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-400">
        {number}
      </div>

      <div>
        <h4 className="font-semibold">
          {title}
        </h4>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>

    </div>
  );
};

// Toggle component
const SettingToggle = ({title, description, checked, onChange}) => {
  return (
    <div className="flex items-center justify-between p-6">
      <div className="pr-6">
        <p className="font-semibold">
          {title}
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={onChange}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked
            ? "bg-blue-600"
            : "bg-slate-300 dark:bg-slate-700"
        }`}
      >

        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            checked
              ? "left-6"
              : "left-1"
          }`}
        />

      </button>
    </div>
  );
};


    return (
        <div className="min-h-screen bg-slate-50 p-6 text-slate-900">
            <div className="mb-8">
            <h1 className="text-3xl font-bold">
                Settings Page
            </h1>
            <p className="mt-1 text-sm text-slate-500">
          Manage your StatementForge preferences and application settings.
        </p>
            </div>

            <div className="space-y-6">
            <section  className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                 <div className="flex items-center gap-3 border-b border-slate-200 p-6 dark:border-slate-800">
                <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <Palette size={20} />
            </div>
            <div>
            <h2 className="text-lg font-bold">
                Appearance
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400">
                Choose how Statement generator looks
            </p>
            </div>
            </div>

             {/* <p className="text-sm">
        Current theme: {theme}
    </p> */}

    <div className="p-6">
                <p className="mb-4 text-sm font-semibold">
                    Theme
                </p>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    className={`flex items-center gap-4 rounded-xl border p-5 text-left transition ${
                        theme === "dark"
                        ? "border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-950":"border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                    }`}
                    >
                        <div className="rounded-lg bg-slate-900 p-3 text-white">
                            <Moon size={22} />
                        </div>

                        <div className="flex-1">
                  <p className="font-semibold">
                    Dark Mode
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Use the dark application theme.
                  </p>
                </div>
                {theme === "dark" && (
                    <Check size={20} className="text-blue-600" />
                )}

                    </button>

                    <button
                type="button"
                onClick={() => setTheme("light")}
                className={`flex items-center gap-4 rounded-xl border p-5 text-left transition ${
                  theme === "light"
                    ? "border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-950"
                    : "border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                }`}
              >

                <div className="rounded-lg bg-white p-3 text-amber-500 shadow-sm">
                  <Sun size={22} />
                </div>

                <div className="flex-1">
                  <p className="font-semibold">
                    Light Mode
                  </p>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Use the light application theme.
                  </p>
                </div>

                {theme === "light" && (
                  <Check
                    size={20}
                    className="text-blue-600"
                  />
                )}

              </button>
                </div>
            </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-3 border-b border-slate-200 p-6">
                    <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
                        <SlidersHorizontal size={20}/>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">
                            Preferences
                        </h2>
                        <p className="text-sm text-slate-500">
                            Configure your application preferences
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-3">
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Currency
                        </label>
                        <select 
                        name="currency" 
                        value={preferences.currency}
                        onChange={handlePreferenceChange}
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none"
                        >
                            <option value="INR">
                                INR - {"\u20B9"}
                            </option>
                            <option value="USD">
                                USD - {"\u0024"}
                            </option>
                            <option value="EUR">
                                EUR - {"\u20AC"}
                            </option>
                        </select>
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                Date Format
              </label>
              <select
                name="dateFormat"
                value={preferences.dateFormat}
                onChange={handlePreferenceChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-800"
              >
                <option value="DD/MM/YYYY">
                  DD/MM/YYYY
                </option>

                <option value="MM/DD/YYYY">
                  MM/DD/YYYY
                </option>

                <option value="YYYY-MM-DD">
                  YYYY-MM-DD
                </option>
              </select>
                    </div>

                     <div>
              <label className="mb-2 block text-sm font-medium">
                Default Statement Type
              </label>

              <select
                name="defaultStatementType"
                value={preferences.defaultStatementType}
                onChange={handlePreferenceChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-800"
              >
                <option value="BASIC">
                  Basic
                </option>

                <option value="DETAILED">
                  Detailed
                </option>

                <option value="MINIMAL">
                  Minimal
                </option>
              </select>
            </div>
                </div>
            </section>

            {/* Notifications */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-200 p-6 dark:border-slate-800">
                <div className="rounded-lg bg-orange-50 p-2 text-orange-600">
                  <Bell size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold">
                    Notifications
                  </h2>
                  <p className="text-sm text-slate-500">
                    Manage application notifications
                  </p>
                </div>
              </div>

              <div className="divide-y divide-slate-200">
                <SettingToggle
              title="Email Notifications"
              description="Receive email notifications from the application."
              checked={notifications.emailNotifications}
              onChange={() =>
                handleNotificationChange(
                  "emailNotifications"
                )
              }
            />

            <SettingToggle
              title="Statement Notifications"
              description="Receive notifications when statements are generated."
              checked={notifications.statementNotifications}
              onChange={() =>
                handleNotificationChange(
                  "statementNotifications"
                )
              }
            />

            <SettingToggle
              title="Invoice Notifications"
              description="Receive notifications related to invoices."
              checked={notifications.invoiceNotifications}
              onChange={() =>
                handleNotificationChange(
                  "invoiceNotifications"
                )
              }
            />
              </div>
            </section>

            {/*  Privacy and Security */}

             <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

          <div className="flex items-center gap-3 border-b border-slate-200 p-6 dark:border-slate-800">

            <div className="rounded-lg bg-green-50 p-2 text-green-600 dark:bg-green-950 dark:text-green-400">
              <Shield size={20} />
            </div>

            <div>
              <h2 className="text-lg font-bold">
                Privacy & Security
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Manage privacy-related application preferences.
              </p>
            </div>

          </div>

          <div>

            <SettingToggle
              title="Show Sensitive Information"
              description="Allow sensitive account information to be displayed."
              checked={privacy.showSensitiveInformation}
              onChange={() =>
                handlePrivacyChange(
                  "showSensitiveInformation"
                )
              }
            />
          </div>
        </section>
        
                       {/* App Behaviour */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-200 p-6">
                <div className="rounded-lg bg-cyan-50 p-2 text-cyan-600">
                  <SettingsIcon size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-bold">
                    App Behaviour
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                Control how the application behaves.
              </p>
                </div>
              </div>

              <div className="divide-y divide-slate-200">
                <SettingToggle 
                title="Confirm Before Delete"
              description="Ask for confirmation before deleting records."
              checked={behaviour.confirmBeforeDelete}
              onChange={() =>
                handleBehaviourChange(
                  "confirmBeforeDelete"
                )
              }
                />

                <SettingToggle
              title="Confirm Before Generate"
              description="Ask for confirmation before generating a statement."
              checked={behaviour.confirmBeforeGenerate}
              onChange={() =>
                handleBehaviourChange(
                  "confirmBeforeGenerate"
                )
              }
            />

            <div className="flex items-center justify-between p-6">

              <div>
                <p className="font-semibold">
                  Default Page
                </p>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Choose the page shown when the application opens.
                </p>
              </div>

              <select
                value={behaviour.defaultPage}
                onChange={(event) =>
                  setBehaviour((previous) => ({
                    ...previous,
                    defaultPage: event.target.value,
                  }))
                }
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
              >
                <option value="Dashboard">
                  Dashboard
                </option>

                <option value="Companies">
                  Companies
                </option>

                <option value="Generator">
                  Generator
                </option>
              </select>
            </div>
              </div>

            </section>
            {/* About Application */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-3 border-b border-slate-200 p-6 dark:border-slate-800">

            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <Info size={20} />
            </div>

            <div>
              <h2 className="text-lg font-bold">
                About StatementForge
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Learn about the application.
              </p>
            </div>

          </div>

          <div className="space-y-6 p-6">

            <div>
              <h3 className="text-lg font-bold">
                StatementForge
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                ERP Statement & Invoice Generator
              </p>

              <p className="mt-3 text-sm text-slate-600">
                StatementForge helps businesses manage
                companies, industries, vendor categories,
                vendors, bank statements, invoices and
                statement email templates.
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-bold">
                How to use StatementForge
              </h3>

              <div className="space-y-4">

                <UsageStep
                  number="1"
                  title="Create a Company"
                  description="Add your company's business information."
                />

                <UsageStep
                  number="2"
                  title="Create Industries"
                  description="Define the industries associated with your companies."
                />

                <UsageStep
                  number="3"
                  title="Create Vendor Categories"
                  description="Create categories for your vendors."
                />

                <UsageStep
                  number="4"
                  title="Add Vendors"
                  description="Add vendors and configure their transaction behaviour."
                />

                <UsageStep
                  number="5"
                  title="Generate Bank Statement"
                  description="Select a company, statement type and period to generate a bank statement."
                />

                <UsageStep
                  number="6"
                  title="Review Statement"
                  description="View transactions, balances and statement details."
                />

                <UsageStep
                  number="7"
                  title="Generate Invoice"
                  description="Select transactions from a bank statement and generate an invoice."
                />

                <UsageStep
                  number="8"
                  title="Send Statement by Email"
                  description="Select an email template, recipient and send the generated statement PDF."
                />

                <UsageStep
                  number="9"
                  title="Manage Templates"
                  description="Create Basic, Detailed and Minimal email templates."
                />
              </div>
            </div>

            <div className="border-t border-slate-200 pt-5">
              <p className="text-sm text-slate-500">
                Version 1.0.0
              </p>
            </div>
            </div>
            </section>
            </div>
        </div>
    )
}