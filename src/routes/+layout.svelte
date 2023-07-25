<script>
    import { modal } from "$lib/store/modal";
    import Modal from "$lib/components/modal/index.svelte";
    import "../app.css";
</script>

<div class="w-screen h-screen font-prime">
    {#if $modal.show}
        <Modal />
    {/if}
    <slot />
</div>
