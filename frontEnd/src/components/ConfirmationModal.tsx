type ConfirmationModalProps = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
};

const ConfirmationModal = ({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = 'danger'
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: '🗑️',
          iconBg: 'bg-errorBg',
          iconColor: 'text-error',
          confirmButton: 'bg-error hover:bg-errorHover text-textInverse'
        };
      case 'warning':
        return {
          icon: '⚠️',
          iconBg: 'bg-primaryAlt/20',
          iconColor: 'text-primaryAlt',
          confirmButton: 'bg-primaryAlt hover:bg-primaryHoverAlt text-textInverse'
        };
      case 'info':
        return {
          icon: 'ℹ️',
          iconBg: 'bg-primary/20',
          iconColor: 'text-primary',
          confirmButton: 'bg-primary hover:bg-primaryHover text-textInverse'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 bg-myBlack/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-bgCard rounded-xl shadow-2xl w-full max-w-sm sm:max-w-md">
        <div className="p-4 sm:p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`w-10 h-10 ${styles.iconBg} rounded-lg flex items-center justify-center`}>
              <span className="text-lg">{styles.icon}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-textPrimary">{title}</h3>
            </div>
          </div>
          
          <p className="text-textPrimary mb-6">{message}</p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-offWhite text-textPrimary rounded-lg hover:bg-neutral/20 border border-borderDark font-medium text-sm transition-colors cursor-pointer"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors cursor-pointer ${styles.confirmButton}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;