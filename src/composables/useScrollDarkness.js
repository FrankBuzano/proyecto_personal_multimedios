import { ref, onMounted, onBeforeUnmount } from "vue";

function smoothstep(edge0, edge1, x) {
    const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
}

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
        doc.style.setProperty("--text-light", smoothstep(0, 0.5, clamped).toFixed(4));
        doc.style.setProperty("--bg-dark", smoothstep(0.1, 0.65, clamped).toFixed(4));
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
