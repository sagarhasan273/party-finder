import { toast } from "sonner";

export function fErrorCatch<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  onError?: (error: any) => void,
): (...args: Parameters<T>) => Promise<ReturnType<T> | null> {
  return async (...args: Parameters<T>): Promise<ReturnType<T> | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error("Error in function:", error);
      onError?.(error);
      return null;
    }
  };
}

export function fErrorCatchToast(
  error: any,
  defaultMessage = "An unexpected error occurred.",
) {
  return error instanceof Error
    ? toast.error(defaultMessage)
    : toast.info(
        (error as any)?.data?.message
          ? String((error as any).data.message)
          : error.message,
      );
}
