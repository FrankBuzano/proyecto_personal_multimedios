import { ref, onMounted, onBeforeUnmount } from "vue";

/**
 * Devuelve un ref reactivo `darkness` con valor 0..1 segun el scroll vertical
 * de la pagina (0 = arriba del todo, 1 = al fondo). Ademas escribe el mismo
 * valor en la variable CSS --page-darkness sobre <html>, para que cualquier
 * estilo del documento (fondo, texto, etc.) pueda reaccionar sin necesidad
 * de pasar el ref por props.
 */
export function useScrollDarkness() {
    const darkness = ref(0);
    let rafId = 0;

    function compute() {
        rafId = 0;
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        const raw = max > 0 ? window.scrollY / max : 0;
        const clamped = Math.min(1, Math.max(0, raw));
        darkness.value = clamped;
        doc.style.setProperty("--page-darkness", clamped.toFixed(4));
    }

    function onScroll() {
        if (rafId) return;
        rafId = requestAnimationFrame(compute);
    }

    onMounted(() => {
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
        compute();
    });

    onBeforeUnmount(() => {
        if (rafId) cancelAnimationFrame(rafId);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
    });

    return { darkness };
}
