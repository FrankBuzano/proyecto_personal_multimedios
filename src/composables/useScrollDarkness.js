import { ref, onMounted, onBeforeUnmount } from "vue";

/**
 * Devuelve un ref reactivo `darkness` con valor 0..1 en funcion del scroll
 * vertical de la pagina (0 = arriba del todo, 1 = al fondo).
 *
 * Implementacion pendiente: por ahora solo devuelve el ref con valor 0 y
 * el contrato de montaje/desmontaje. La logica de scroll real se conecta
 * en una entrega posterior.
 */
export function useScrollDarkness() {
    const darkness = ref(0);

    function onScroll() {
        // TODO: calcular darkness = clamp(scrollY / (scrollHeight - innerHeight), 0, 1)
    }

    onMounted(() => {
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
    });

    onBeforeUnmount(() => {
        window.removeEventListener("scroll", onScroll);
    });

    return { darkness };
}
