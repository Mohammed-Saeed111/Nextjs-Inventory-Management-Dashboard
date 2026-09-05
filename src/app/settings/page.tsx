"use client";

import React, { useState } from "react";
import Header from "@/app/(components)/Header";

type UserSetting = {
  label: string;
  value: string | boolean;
  type: "text" | "toggle";
};

const mockSettings: UserSetting[] = [
  { label: "Username", value: "john_doe", type: "text" },
  { label: "Email", value: "john.doe@example.com", type: "text" },
  { label: "Notification", value: true, type: "toggle" },
  { label: "Dark Mode", value: false, type: "toggle" },
  { label: "Language", value: "English", type: "text" },
];

const Settings = () => {
  const [userSettings, setUserSettings] = useState<UserSetting[]>(mockSettings);
  const [isSaved, setIsSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleToggleChange = (index: number) => {
    // Fix: use proper immutable update instead of mutating the object
    setUserSettings((prev) =>
      prev.map((setting, i) =>
        i === index ? { ...setting, value: !setting.value as boolean } : setting
      )
    );
    setHasChanges(true);
    setIsSaved(false);
  };

  const handleTextChange = (index: number, newValue: string) => {
    // Fix: use proper immutable update
    setUserSettings((prev) =>
      prev.map((setting, i) =>
        i === index ? { ...setting, value: newValue } : setting
      )
    );
    setHasChanges(true);
    setIsSaved(false);
  };

  const handleSave = () => {
    // Here you would send data to the backend API
    // e.g. await fetch('/api/settings', { method: 'POST', body: JSON.stringify(userSettings) })
    console.log("Saving settings:", userSettings);
    setIsSaved(true);
    setHasChanges(false);

    // Hide the success message after 3 seconds
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="w-full">
      <Header name="User Settings" />

      {/* Success Toast */}
      {isSaved && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Settings saved successfully!
        </div>
      )}

      <div className="overflow-x-auto mt-5 shadow-md">
        <table className="min-w-full bg-white rounded-lg">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                Setting
              </th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {userSettings.map((setting, index) => (
              <tr className="hover:bg-blue-50" key={setting.label}>
                <td className="py-2 px-4">{setting.label}</td>
                <td className="py-2 px-4">
                  {setting.type === "toggle" ? (
                    <label className="inline-flex relative items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={setting.value as boolean}
                        onChange={() => handleToggleChange(index)}
                      />
                      <div
                        className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-blue-400 peer-focus:ring-4 
                        transition peer-checked:after:translate-x-full peer-checked:after:border-white 
                        after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white 
                        after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                        peer-checked:bg-blue-600"
                      ></div>
                    </label>
                  ) : (
                    <input
                      type="text"
                      className="px-4 py-2 border rounded-lg text-gray-500 focus:outline-none focus:border-blue-500"
                      value={setting.value as string}
                      onChange={(e) => handleTextChange(index, e.target.value)}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={handleSave}
          className={`px-6 py-2 rounded-lg text-white font-semibold transition-colors ${
            hasChanges
              ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!hasChanges}
        >
          Save Settings
        </button>
        {hasChanges && (
          <span className="text-sm text-orange-500 font-medium">
            ● Unsaved changes
          </span>
        )}
      </div>
    </div>
  );
};

export default Settings;
