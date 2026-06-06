type ActionResponse<T> =
  | { success: true; data: T }
  | { success: false; message: string };

export async function withAction<T>(
  fn: () => Promise<T>,
): Promise<ActionResponse<T>> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Ocorreu um erro inesperado." };
  }
}
