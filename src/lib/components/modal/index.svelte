<script lang="ts">
    import { modal } from "$lib/store/modal";
    import { slide } from "svelte/transition";

    setTimeout(() => {
        $modal.show = false;
    }, 3000);
</script>

<div
    class="w-screen h-screen absolute flex flex-row items-center justify-center"
>
    <div
        transition:slide
        class="border-black z-[20] flex flex-row items-center justify-center border-2 w-[425px] bg-white h-[75px] shadow-md"
    >
        {#if $modal.type === "ERROR"}
            <div
                class="w-full border-black bg-[#FF7979] h-full flex flex-col items-center justify-center text-black"
            >
                <div class="w-full text-center">
                    {$modal.message}
                </div>
            </div>
        {:else if $modal.type === "SUCCESS"}
            <div
                class="w-full bg-[#9CEAAE] border-black h-full flex flex-col items-center justify-center text-black"
            >
                <div class="w-full text-center">
                    {$modal.message}
                </div>
            </div>
        {:else if $modal.type === "WARNING"}
            <div
                class="w-full border-black h-full flex flex-col items-center bg-[#FFDB83] justify-center text-black"
            >
                <div class="w-full text-center">
                    {$modal.message}
                </div>
            </div>
        {/if}
    </div>
</div>
