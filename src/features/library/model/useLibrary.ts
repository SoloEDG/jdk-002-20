import { computed, ref } from "vue";
import { catalog } from "../lib/catalog";
export function useLibrary() {
  const selectedId = ref(catalog[0]!.id);
  const search = ref("");
  const selected = computed(
    () => catalog.find((t) => t.id === selectedId.value) ?? catalog[0]!,
  );
  const tracks = computed(() =>
    catalog.filter((t) =>
      `${t.title} ${t.artist}`
        .toLowerCase()
        .includes(search.value.toLowerCase()),
    ),
  );
  return {
    selectedId,
    selected,
    search,
    tracks,
    select: (id: string) => {
      if (catalog.some((t) => t.id === id)) selectedId.value = id;
    },
  };
}
