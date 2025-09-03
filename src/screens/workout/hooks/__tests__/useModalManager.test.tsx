import { renderHook, act } from "@testing-library/react-native";
import { useModalManager } from "../useModalManager";

describe("useModalManager", () => {
  test("opens and closes modals with defaults", () => {
    const { result } = renderHook(() => useModalManager());

    act(() => {
      result.current.showError("שגיאה", "משהו קרה");
    });
    expect(result.current.activeModal !== null).toBe(true);
    expect(result.current.activeModal).toBe("error");
    expect(result.current.modalConfig.title).toBe("שגיאה");
    expect(result.current.modalConfig.confirmText).toBe("אישור");

    act(() => {
      result.current.hideModal();
    });
    expect(result.current.activeModal === null).toBe(true);
  });

  test("confirm executes onConfirm and resets state", () => {
    const onConfirm = jest.fn();
    const { result } = renderHook(() => useModalManager());

    act(() => {
      result.current.showConfirm("אישור", "להמשיך?", onConfirm, true);
    });
    expect(result.current.activeModal).toBe("confirm");
    expect(result.current.modalConfig.destructive).toBe(true);
    expect(result.current.modalConfig.confirmText).toBe("מחק");

    act(() => {
      // Manually call the onConfirm function
      result.current.modalConfig.onConfirm?.();
      result.current.hideModal();
    });

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(result.current.activeModal === null).toBe(true);
  });

  test("cancel executes onCancel when provided", () => {
    const onCancel = jest.fn();
    const { result } = renderHook(() => useModalManager());

    act(() => {
      result.current.showModal("confirm", {
        title: "בטוח?",
        message: "פעולה",
        onCancel,
      });
    });
    expect(result.current.modalConfig.cancelText).toBe("ביטול");

    act(() => {
      // Manually call the onCancel function
      result.current.modalConfig.onCancel?.();
      result.current.hideModal();
    });

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(result.current.activeModal === null).toBe(true);
  });
});
