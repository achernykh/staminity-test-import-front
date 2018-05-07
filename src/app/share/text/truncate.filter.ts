export const truncateFilter = () => (s, max = 140) => s && (s.length <= max ? s : s.slice(0, max - 1) + "…");