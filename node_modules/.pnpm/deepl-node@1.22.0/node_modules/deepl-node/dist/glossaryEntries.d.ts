/**
 * Stores the entries of a glossary.
 */
export declare class GlossaryEntries {
    private implEntries;
    /**
     * Construct a GlossaryEntries object containing the specified entries as an object or a
     * tab-separated values (TSV) string. The entries and tsv options are mutually exclusive.
     * @param options Controls how to create glossary entries. If options is unspecified, no
     *     entries will be created.
     * @param options.entries Object containing fields storing entries, for example:
     *     `{'Hello': 'Hallo'}`.
     * @param options.tsv String containing TSV to parse. Each line should contain a source and
     *     target term separated by a tab. Empty lines are ignored.
     * @return GlossaryEntries object containing parsed entries.
     * @throws DeepLError If given entries contain invalid characters.
     */
    constructor(options?: {
        tsv?: string;
        entries?: Record<string, string>;
    });
    /**
     * Add the specified source-target entry.
     * @param source Source term of the glossary entry.
     * @param target Target term of the glossary entry.
     * @param overwrite If false, throw an error if the source entry already exists.
     */
    add(source: string, target: string, overwrite?: boolean): void;
    /**
     * Retrieve the contained entries.
     */
    entries(): Record<string, string>;
    /**
     * Converts glossary entries to a tab-separated values (TSV) string.
     * @return string containing entries in TSV format.
     * @throws {Error} If any glossary entries are invalid.
     */
    toTsv(): string;
    /**
     * Checks if the given glossary term contains any disallowed characters.
     * @param term Glossary term to check for validity.
     * @throws {Error} If the term is not valid or a disallowed character is found.
     */
    static validateGlossaryTerm(term: string): void;
}
