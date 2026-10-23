export default Dialog;
type Dialog = {
    $on?(type: string, callback: (e: any) => void): () => void;
    $set?(props: Partial<$$ComponentProps>): void;
};
declare const Dialog: import("svelte").Component<{
    open?: boolean;
    title: string;
    children: import("svelte").Snippet;
    footer?: import("svelte").Snippet;
    busy?: boolean;
    returnTo?: HTMLElement;
}, {}, "open">;
type $$ComponentProps = {
    open?: boolean;
    title: string;
    children: import("svelte").Snippet;
    footer?: import("svelte").Snippet;
    busy?: boolean;
    returnTo?: HTMLElement;
};
