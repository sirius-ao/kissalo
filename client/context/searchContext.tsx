type FilterProviderProps<T> = {
  data: T[];
  search: string;
  filter: (item: T, search: string) => boolean;
  children: (filteredData: T[]) => React.ReactNode;
};

export function FilterProvider<T>({
  data,
  search,
  filter,
  children,
}: FilterProviderProps<T>) {
  const filteredData = !search?.trim()
    ? data
    : data.filter((item) => filter(item, search));

  return <>{children(filteredData)}</>;
}
