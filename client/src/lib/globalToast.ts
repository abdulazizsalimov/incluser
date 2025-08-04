// Глобальная система тостов без React состояния
type ToastMessage = {
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
};

let toastCallback: ((message: ToastMessage) => void) | null = null;

export const setGlobalToastCallback = (callback: (message: ToastMessage) => void) => {
  toastCallback = callback;
};

export const showGlobalToast = (message: ToastMessage) => {
  if (toastCallback) {
    // Используем setTimeout чтобы отделить от текущего React цикла
    setTimeout(() => {
      toastCallback!(message);
    }, 0);
  }
};