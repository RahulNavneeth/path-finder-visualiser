<script lang="ts">
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import { colors } from "../lib";

    type Tool = "WALL" | "SOURCE" | "TARGET" | "OPEN" | ["VISITED", number];
    type Type = "CONSTRUCT" | "DESTROY";
    type Grid = Array<Array<Tool>>;

    let gridStore = writable<Grid>([]);

    let TYPE: Type = "CONSTRUCT";
    let TOOL: Tool = "WALL";
    let GRID_WIDTH = 0;
    let GRID_HEIGHT = 0;

    const generate_grid = () => {
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
    };

    onMount(() => {
        GRID_WIDTH = Math.ceil(window.innerWidth / 50);
        GRID_HEIGHT = Math.ceil(window.innerHeight / 50) - 1;
        generate_grid();
    });

    let s = [0, 0];
    let t = [0, 0];

    const place = (r: number, c: number) => {
        if (TYPE === "CONSTRUCT") {
            if (TOOL === "SOURCE") {
                if ($gridStore[r][c] === "OPEN") {
                    $gridStore[r][c] = "SOURCE";
                    if (s[0] !== 0 && s[1] !== 0)
                        $gridStore[s[0]][s[1]] = "OPEN";
                    s = [r, c];
                }
            } else if (TOOL === "TARGET") {
                if ($gridStore[r][c] === "OPEN") {
                    $gridStore[r][c] = "TARGET";
                    if (t[0] !== 0 && t[1] !== 0)
                        $gridStore[t[0]][t[1]] = "OPEN";
                    t = [r, c];
                }
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
                    grid[nx][ny] = ["VISITED", nl];
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
    class="flex flex-row align-center justify-between z-50 bg-blur-10 w-full h-[50px] px-1"
>
    <div class="flex flex-row align-center justify-start py-1 w-full">
        <button
            style="background-color: {TYPE === 'CONSTRUCT'
                ? '#FFAAAA'
                : 'white'};"
            class="border-black px-4 border-2 mr-1"
            on:click={() => {
                TYPE = "CONSTRUCT";
            }}
        >
            CONSTRUCT
        </button>
        <button
            style="background-color: {TYPE === 'DESTROY'
                ? '#FFAAAA'
                : 'white'};"
            class="border-black px-4 border-2 mr-1"
            on:click={() => {
                TYPE = "DESTROY";
            }}
        >
            DESTROY
        </button>
        <div class="flex flex-col items-center justify-center mr-1">|</div>
        <button
            style="background-color: {TOOL === 'SOURCE' ? '#c0ffaa' : 'white'};"
            class="border-black px-4 bg-[#c0ffaa] border-2 mr-1"
            on:click={() => {
                TOOL = "SOURCE";
            }}
        >
            SOURCE
        </button>
        <button
            style="background-color: {TOOL === 'TARGET' ? '#ffe7aa' : 'white'};"
            class="border-black px-4 bg-[#ffe7aa] border-2 mr-1"
            on:click={() => {
                TOOL = "TARGET";
            }}
        >
            TARGET
        </button>
        <button
            style="background-color: {TOOL === 'WALL'
                ? 'black'
                : 'white'};color: {TOOL === 'WALL' ? 'white' : 'black'};"
            class="border-black px-4 border-2"
            on:click={() => {
                TOOL = "WALL";
            }}
        >
            WALL
        </button>
    </div>
    <div class="flex flex-row align-center justify-end py-1 w-full">
        <button
            class="border-black px-4 bg-[#ACDCFF] text-blue border-2 mr-1"
            on:click={() => bfs(s[0], s[1])}
        >
            SEARCH
        </button>
        <button
            class="border-black px-4 bg-[#D1ACFF] text-blue border-2"
            on:click={generate_grid}
        >
            RESET
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
                        : cell === 'OPEN'
                        ? '#ffffff'
                        : cell[0] === 'VISITED'
                        ? colors[cell[1]]
                        : '#ffaaaa'}"
                    class="w-[50px] h-[50px] border-[0.5px] border-black {cell ==
                    'OPEN'
                        ? 'hover:scale-105 hover:border-2'
                        : ''} transition-all"
                    on:click={() => {
                        place(id_x, id_y);
                    }}
                />
            {/each}
        </div>
    {/each}
</div>
