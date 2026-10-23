export default ChoiceGroup;
type ChoiceGroup = {
    $on?(type: string, callback: (e: any) => void): () => void;
    $set?(props: Partial<$$ComponentProps>): void;
};
declare const ChoiceGroup: import("svelte").Component<{
    label: string;
    options?: string[];
    value?: string;
}, {}, "value">;
type $$ComponentProps = {
    label: string;
    options?: string[];
    value?: string;
};
