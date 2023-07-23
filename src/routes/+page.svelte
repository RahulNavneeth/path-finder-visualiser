<script lang="ts">
    import { onMount } from "svelte";
    import { writable } from "svelte/store";

    type Tool = "WALL" | "SOURCE" | "TARGET" | "OPEN" | "VISITED";
    type Type = "CONSTRUCT" | "DESTROY";
    type Grid = Array<Array<Tool>>;

    let gridStore = writable<Grid>([]);

    let TYPE: Type = "CONSTRUCT";
    let TOOL: Tool = "WALL";

    onMount(() => {
        const GRID_WIDTH = Math.ceil(window.innerWidth / 75);
        const GRID_HEIGHT = Math.ceil(window.innerHeight / 75);

        let grid: Array<Array<Tool>> = [...Array(GRID_HEIGHT)].map((_, x) =>
            [...Array(GRID_WIDTH)].map((_, y) => {
                if (
                    x === 0 ||
                    x === GRID_HEIGHT - 1 ||
                    y === 0 ||
                    y === GRID_WIDTH - 1
                ) {
                    return "WALL";
                } else {
                    return "OPEN";
                }
            })
        );

        gridStore.set(grid);
    });

    let s = [0, 0];
    let t = [0, 0];

    const place = (r: number, c: number) => {
        if (TYPE === "CONSTRUCT") {
            if (TOOL === "SOURCE") {
                $gridStore[r][c] = "SOURCE";
                if (s[0] !== 0 && s[1] !== 0) $gridStore[s[0]][s[1]] = "OPEN";
                s = [r, c];
            } else if (TOOL === "TARGET") {
                $gridStore[r][c] = "TARGET";
                if (t[0] !== 0 && t[1] !== 0) $gridStore[t[0]][t[1]] = "OPEN";
                t = [r, c];
            } else if (TOOL === "WALL") {
                $gridStore[r][c] = "WALL";
            }
        } else if (TYPE === "DESTROY") {
            if (
                r !== 0 &&
                r !== $gridStore.length - 1 &&
                c !== 0 &&
                c !== $gridStore[0].length - 1
            )
                $gridStore[r][c] = "OPEN";
        }
    };

    const bfs = (r: number, c: number) => {
        const queue: Array<[[number, number], number]> = [];
        queue.push([[r, c], 0]);

        const grid = $gridStore;
        let count = 0;

        const processNextNode = () => {
            if (queue.length === 0) return;

            const [[x, y], w] = queue.shift() || [[0, 0], 0];

            if (grid[x][y] === "WALL") {
                processNextNode();
                return;
            }

            let dir = [
                [0, 1],
                [1, 0],
                [0, -1],
                [-1, 0],
            ];

            for (let i = 0; i < 4; i++) {
                let nx: number = x + dir[i][0];
                let ny: number = y + dir[i][1];
                if (grid[nx][ny] === "OPEN" || grid[nx][ny] === "TARGET") {
                    let nl = w + 1;
                    if (grid[nx][ny] === "TARGET") {
                        alert("FOUND");
                        return;
                    }
                    count = Math.max(count, nl);
                    grid[nx][ny] = "VISITED";
                    queue.push([[nx, ny], nl]);
                }
            }
            gridStore.set(grid);
            setTimeout(processNextNode, 100);
        };

        processNextNode();
    };
    $: console.log($gridStore);
</script>

<div
    class="absolute flex flex-row align-center justify-between bottom-20 left-24 z-50 bg-blur-10 w-[80%] py-3"
>
    <div>
        <button
            class="border-black p-2 px-4 bg-white border-2"
            on:click={() => {
                TYPE = "CONSTRUCT";
            }}
        >
            CONSTRUCT
        </button>
        <button
            class="border-black p-2 px-4 bg-red-200 border-2"
            on:click={() => {
                TYPE = "DESTROY";
            }}
        >
            DESTROY
        </button>
        <button
            class="border-black p-2 px-4 bg-[#c0ffaa]"
            on:click={() => {
                TOOL = "SOURCE";
            }}
        >
            SOURCE
        </button>
        <button
            class="border-black p-2 px-4 bg-[#ffe7aa]"
            on:click={() => {
                TOOL = "TARGET";
            }}
        >
            TARGET
        </button>
        <button
            class="border-black p-2 px-4 bg-black text-white"
            on:click={() => {
                TOOL = "WALL";
            }}
        >
            WALL
        </button>
    </div>
    <div>
        <button
            class="border-black p-2 px-4 bg-black text-white"
            on:click={() => bfs(s[0], s[1])}
        >
            SEARCH
        </button>
    </div>
</div>

<div>
    {#each $gridStore as row, id_x}
        <div class="flex">
            {#each row as cell, id_y}
                <button
                    style="background-color: {cell === 'WALL'
                        ? '#101010'
                        : cell === 'SOURCE'
                        ? '#c0ffaa'
                        : cell === 'TARGET'
                        ? '#ffe7aa'
                        : cell === 'VISITED'
                        ? '#ACDCFF'
                        : cell === 'OPEN'
                        ? '#ffffff'
                        : '#ffaaaa'}"
                    class="w-[75px] h-[75px]"
                    class:wall={TYPE === "CONSTRUCT" && TOOL === "WALL"}
                    class:source={TYPE === "CONSTRUCT" && TOOL === "SOURCE"}
                    class:target={TYPE === "CONSTRUCT" && TOOL === "TARGET"}
                    class:destroy={TYPE !== "CONSTRUCT"}
                    on:click={() => {
                        place(id_x, id_y);
                    }}
                />
            {/each}
        </div>
    {/each}
</div>

<style>
    .wall:hover {
        background-color: #101010;
    }

    .source:hover {
        background-color: #c0ffaa;
    }

    .target:hover {
        background-color: #ffe7aa;
    }

    .destroy:hover {
        background-color: #ffaaaa;
    }
</style>
