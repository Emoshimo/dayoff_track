import { create } from "zustand";
import { ClientEmployee, DayOffRequest } from "../interfaces/interfaces";

interface EmployeeStoreState {
  clientEmployee: ClientEmployee | null;
  pendingDayOffs: DayOffRequest[];
  approvedDayOffs: DayOffRequest[];
  rejectedDayOffs: DayOffRequest[];
}
interface EmployeeStoreActions {
  updateClientEmployee: (employeeData: ClientEmployee) => void;
  updatePendingDayOffs: (requests: DayOffRequest[]) => void;
  updateApprovedDayOffs: (requests: DayOffRequest[]) => void;
  updateRejectedDayOffs: (requests: DayOffRequest[]) => void;
  reset: () => void;
}

const useEmployeeStore = create<EmployeeStoreState & EmployeeStoreActions>(
  (set) => ({
    clientEmployee: null,
    pendingDayOffs: [],
    approvedDayOffs: [],
    rejectedDayOffs: [],
    updateClientEmployee: (employeeData) =>
      set({ clientEmployee: employeeData }),
    updatePendingDayOffs: (requests) => set({ pendingDayOffs: requests }),
    updateApprovedDayOffs: (requests) => set({ approvedDayOffs: requests }),
    updateRejectedDayOffs: (requests) => set({ rejectedDayOffs: requests }),
    reset: () =>
      set({
        clientEmployee: null,
        pendingDayOffs: [],
        approvedDayOffs: [],
        rejectedDayOffs: [],
      }),
  })
);

export default useEmployeeStore;
