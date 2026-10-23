export default Field;
type Field = {
    $on?(type: string, callback: (e: any) => void): () => void;
    $set?(props: Partial<$$ComponentProps>): void;
};
declare const Field: import("svelte").Component<{
    label: string;
    hint?: string;
    error?: string;
    children: import("svelte").Snippet<[Record<string, string | undefined>]>;
}, {}, "">;
type $$ComponentProps = {
    label: string;
    hint?: string;
    error?: string;
    children: import("svelte").Snippet<[Record<string, string | undefined>]>;
};
