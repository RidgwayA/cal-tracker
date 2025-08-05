
type Props = {
  selectedDate: string;
  onDateChange: (date: string) => void;
};

const DateNavigation = ({ selectedDate, onDateChange }: Props) => {

  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString + 'T12:00:00');
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const isToday = dateString === today.toISOString().split('T')[0];
    const isYesterday = dateString === yesterday.toISOString().split('T')[0];
    
    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const goToPreviousDay = () => {
    const currentDate = new Date(selectedDate + 'T12:00:00');
    currentDate.setDate(currentDate.getDate() - 1);
    onDateChange(currentDate.toISOString().split('T')[0]);
  };

  const goToNextDay = () => {
    const currentDate = new Date(selectedDate + 'T12:00:00');
    const today = new Date().toISOString().split('T')[0];

    if (selectedDate >= today) return;
    
    currentDate.setDate(currentDate.getDate() + 1);
    onDateChange(currentDate.toISOString().split('T')[0]);
  };

  const goToToday = () => {
    const today = new Date().toISOString().split('T')[0];
    onDateChange(today);
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];
  const canGoNext = selectedDate < new Date().toISOString().split('T')[0];

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
          <h3 className="text-lg font-semibold text-textPrimary mb-2 ">
            {formatDateForDisplay(selectedDate)}
          </h3>
          <input
            type="date"
            value={selectedDate}
            max={new Date().toISOString().split('T')[0]}
            onChange={(e) => onDateChange(e.target.value)}
            className="px-4 py-2 border border-borderDark rounded-lg transition-all duration-200 bg-bgCard text-textPrimary cursor-pointer text-center"
          />
        </div>

        <button
          onClick={goToNextDay}
          disabled={!canGoNext}
          className={`p-2 rounded-lg transition-all duration-200 ${
            canGoNext 
              ? 'text-textPrimary hover:text-primaryHover hover:bg-bgLight' 
              : 'text-neutral cursor-not-allowed'
          }`}
          title="Next Day"
        >
          <svg className="w-5 h-5 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
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