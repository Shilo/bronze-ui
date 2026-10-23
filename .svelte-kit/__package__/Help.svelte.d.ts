export default Help;
type Help = {
    $on?(type: string, callback: (e: any) => void): () => void;
    $set?(props: Partial<$$ComponentProps>): void;
};
declare const Help: import("svelte").Component<{
    label: string;
    text: string;
}, {}, "">;
type $$ComponentProps = {
    label: string;
    text: string;
};
