import type Action from './Action';
import type Move from './Move';
interface Resolution {
    readonly move: Move;
    readonly action: Action | null;
}
export { type Resolution as default };
