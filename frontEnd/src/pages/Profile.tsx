import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { type UserType } from "../types";

const Profile = () => {
  const navigate = useNavigate();
  const storedUserId = localStorage.getItem("userId");
  const userId = storedUserId ? parseInt(storedUserId, 10) : null;

  const [user, setUser] = useState<UserType>({
    id: 0,
    name: "",
    email: "",
    date_of_birth: "",
    daily_calorie_goal: 2000,
  });

  const [editingField, setEditingField] = useState<keyof UserType | null>(null);
  const [tempValue, setTempValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "";

    const date = dateString.split('T')[0]; 
    const [year, month, day] = date.split('-');
    return `${month}/${day}/${year}`;
  };

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";

    return dateString.split('T')[0]; 
  };

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user profile:", err);
        navigate("/login");
      });
  }, [userId, navigate]);

  const handleSave = async () => {
    if (!editingField || !userId) return;

    setIsSaving(true);
    
 
    let processedValue = tempValue;
    if (editingField === "daily_calorie_goal") {
      processedValue = Number(tempValue).toString();
    }

    const updatePayload = {
      [editingField]: editingField === "daily_calorie_goal" ? Number(tempValue) : processedValue,
    };

    try {
      const res = await fetch(`/api/users/${userId}/preferences`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      });

      if (res.ok) {
        setUser((prev) => {
          const updated = { ...prev, ...updatePayload };
          if (editingField === "name") {
            localStorage.setItem("userName", updated.name);
          }
          return updated;
        });
        setEditingField(null);
        setTempValue("");
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const renderField = (
    label: string,
    key: keyof UserType,
    type: "text" | "number" | "date",
    icon: string
  ) => (
    <div className="bg-surface backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-borderLight">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
          <span className="text-lg">{icon}</span>
        </div>
        <h3 className="text-lg font-semibold text-textPrimary">{label}</h3>
      </div>

      {editingField === key ? (
        <div className="space-y-3">
          <input
            type={type}
            className="w-full px-4 py-3 border border-borderDark rounded-lg focus:ring-primary focus:border-primary transition-all duration-200 bg-bgCard text-textPrimary"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-success text-textInverse rounded-lg hover:bg-successHover transition-all duration-200 font-medium disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setEditingField(null)}
              className="flex-1 px-4 py-2 bg-surface text-textPrimary rounded-lg hover:bg-error transition-all duration-200 font-medium border border-borderLight cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xl font-semibold text-textPrimary">
              {key === "date_of_birth"
                ? formatDateForDisplay(user[key])
                : user[key]}
            </p>
            <p className="text-sm text-textPrimary/70">
              {key === "daily_calorie_goal" && "calories per day"}
            </p>
          </div>
          <button
            onClick={() => {
              setEditingField(key);
              setTempValue(
                key === "date_of_birth"
                  ? formatDateForInput(user[key])
                  : user[key].toString()
              );
            }}
            className="px-4 py-2 text-primary hover:text-primaryHover hover:bg-primary/10 rounded-lg transition-all duration-200 font-medium cursor-pointer"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bgDark to-bgLight flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
            <svg
              className="w-8 h-8 text-textInverse animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <p className="text-textPrimary">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bgDark to-bgLight">
      <header className="bg-surface backdrop-blur-sm border-b border-borderLight">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-textPrimary">Profile Settings</h1>
              <p className="text-sm text-textPrimary/80">
                Manage your account preferences
              </p>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 bg-primary text-textInverse rounded-lg hover:bg-primaryHover transition-all duration-200 font-medium shadow-lg shadow-primary/25 cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderField("Full Name", "name", "text", "👤")}
          {renderField("Email Address", "email", "text", "📧")}
          {renderField("Date of Birth", "date_of_birth", "date", "🎂")}
          {renderField("Daily Calorie Goal", "daily_calorie_goal", "number", "🎯")}
        </div>
      </main>
    </div>
  );
};

export default Profile;