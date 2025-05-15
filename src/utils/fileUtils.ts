/**
 * Truncates a file path to hide the last directory/filename
 * @param fullPath The full file path
 * @returns The truncated path with the last segment hidden
 */
export const truncatePath = (fullPath: string): string => {
  const parts = fullPath.split("/");
  if (parts.length <= 2) return "";

  // Remove the last segment and join the rest
  const truncated = parts.slice(0, -1).join("/");
  return truncated;
};
