import { writable } from "svelte/store";

export const modal = writable<{ message: string, type: ("SUCCESS" | "ERROR" | "WARNING"), show: boolean }>({ message: "", type: "SUCCESS", show: false });
