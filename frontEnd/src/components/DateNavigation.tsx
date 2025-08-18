import { getUserTimeZone, getTodayDate, addDaysYMD } from "../utils/dateUtils";

type Props = {
  selectedDate: string;                 // YYYY-MM-DD
  onDateChange: (date: string) => void;
};

const DateNavigation = ({ selectedDate, onDateChange }: Props) => {
  const tz = getUserTimeZone();
  const today = getTodayDate(tz);

  // Format like your original: "Today" / "Yesterday" / "Wed, Aug 14"
  const formatDateForDisplay = (ymd: string) => {
    const yesterday = addDaysYMD(today, -1, tz);

    if (ymd === today) return "Today";
    if (ymd === yesterday) return "Yesterday";

    // Render a short, stable label in the user's tz; anchor at noon UTC to avoid DST weirdness
    const [y, m, d] = ymd.split("-").map(Number);
    const noonUtc = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
    return new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(noonUtc);
  };

  const goToPreviousDay = () => {
    onDateChange(addDaysYMD(selectedDate, -1, tz));
  };

  const goToNextDay = () => {
    // prevent going into the future
    if (selectedDate >= today) return;
    onDateChange(addDaysYMD(selectedDate, +1, tz));
  };

  const goToToday = () => {
    onDateChange(today);
  };

  const isToday = selectedDate === today;
  const canGoNext = selectedDate < today;

  return (
    <div className="bg-surface backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-borderLight mb-6">
      <div className="flex items-center justify-between">
        <button
          onClick={goToPreviousDay}
          className="p-2 text-textPrimary hover:text-primaryHover hover:bg-bgLight rounded-lg transition-all duration-200"
          title="Previous Day"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="text-center">
          <h3 className="text-lg font-semibold text-textPrimary mb-2">
            {formatDateForDisplay(selectedDate)}
          </h3>

          <input
            type="date"
            value={selectedDate}
            max={today} // ⬅️ today in the user's timezone (no UTC drift)
            onChange={(e) => onDateChange(e.target.value)}
            className="px-4 py-2 border border-borderDark rounded-lg transition-all duration-200 bg-bgCard text-textPrimary cursor-pointer text-center"
          />
        </div>

        <button
          onClick={goToNextDay}
          disabled={!canGoNext}
          className={`p-2 rounded-lg transition-all duration-200 ${
            canGoNext
              ? "text-textPrimary hover:text-primaryHover hover:bg-bgLight"
              : "text-neutral cursor-not-allowed"
          }`}
          title="Next Day"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="flex justify-center mt-4">
        {!isToday && (
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-primary text-textInverse rounded-lg hover:bg-primaryHover transition-all duration-200 font-medium text-sm shadow-lg shadow-primary/25 cursor-pointer"
          >
            Go to Today
          </button>
        )}
      </div>
    </div>
  );
};

export default DateNavigation;
