export default Notice;
type Notice = {
    $on?(type: string, callback: (e: any) => void): () => void;
    $set?(props: Partial<$$ComponentProps>): void;
};
declare const Notice: import("svelte").Component<{
    tone?: "info" | "warning" | "success" | "danger";
    title: string;
    children?: import("svelte").Snippet;
    live?: boolean;
}, {}, "">;
type $$ComponentProps = {
    tone?: "info" | "warning" | "success" | "danger";
    title: string;
    children?: import("svelte").Snippet;
    live?: boolean;
};
