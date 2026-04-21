export type DbExpenseStatus = "completed" | "pending" | "scheduled";

export function expenseStatusLabel(
  status: DbExpenseStatus
): "Completed" | "Pending" | "Scheduled" {
  if (status === "completed") {
    return "Completed";
  }
  if (status === "pending") {
    return "Pending";
  }
  return "Scheduled";
}
