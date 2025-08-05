
export const getTodayDate = (): string => {
  return new Date().toISOString().split("T")[0];
};

export const formatReadableDate = (dateString: string): string => {
  return new Date(dateString + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const isToday = (dateString: string): boolean => {
  return dateString === getTodayDate();
};

export const formatDateForInput = (dateString: string): string => {
  if (!dateString) return "";
  try {
    let date = new Date(dateString);
    if (isNaN(date.getTime())) {
      date = new Date(dateString + "T12:00:00");
    }
    return date.toISOString().split("T")[0];
  } catch {
    return "";
  }
};

export const formatDateForDisplay = (dateString: string): string => {
  if (!dateString || typeof dateString !== "string") return "";

  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) return "";

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  } catch {
    return "";
  }
};
