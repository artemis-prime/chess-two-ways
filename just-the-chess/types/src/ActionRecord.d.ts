import type Action from './Action';
import type Move from './Move';
import type Piece from './Piece';
type AnnotatedResult = 'checkmate' | 'stalemate' | 'check';
declare const ANNOTATION_FROM_RESULT: {
    checkmate: string;
    stalemate: string;
    check: string;
};
declare const ANNOTATIONS: string[];
declare const ANNOTATEDRESULTS: AnnotatedResult[];
type ActionMode = 'do' | 'undo' | 'redo';
declare class ActionRecord {
    readonly move: Move;
    readonly action: Action;
    readonly captured: Piece | undefined;
    annotatedResult: AnnotatedResult | null;
    constructor(move: Move, action: Action, captured?: Piece, annotatedResult?: AnnotatedResult);
    toRichLANString(): string;
    toCommonLANString(): string;
    private _toLANString;
    static fromRichLANString: (lan: string) => ActionRecord;
}
export { ActionRecord as default, type AnnotatedResult, type ActionMode, ANNOTATION_FROM_RESULT, ANNOTATIONS, ANNOTATEDRESULTS, };
