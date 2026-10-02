export function runDeferred(task: () => void | Promise<void>): () => void {
  const timer = setTimeout(() => {
    void task();
  }, 0);
  return () => clearTimeout(timer);
}
