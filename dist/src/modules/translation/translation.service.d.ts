export declare class TranslationService {
    private translator;
    constructor();
    translate(text: string, targetLang: string): Promise<string>;
}
