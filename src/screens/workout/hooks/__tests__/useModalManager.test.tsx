import { renderHook, act } from "@testing-library/react-native";
import { useModalManager } from "../useModalManager";

describe("useModalManager", () => {
  test("opens and closes modals with defaults", () => {
    const { result } = renderHook(() => useModalManager());

    act(() => {
      result.current.showError("שגיאה", "משהו קרה");
    });
    expect(result.current.isOpen).toBe(true);
    expect(result.current.activeModal).toBe("error");
    expect(result.current.modalConfig.title).toBe("שגיאה");
    expect(result.current.modalConfig.confirmText).toBe("אישור");

    act(() => {
      result.current.hideModal();
    });
    expect(result.current.isOpen).toBe(false);
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
      result.current.confirm();
    });

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(result.current.isOpen).toBe(false);
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
      result.current.cancel();
    });

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(result.current.isOpen).toBe(false);
  });
});
