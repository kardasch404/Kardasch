"use strict";
// Copyright 2022 DeepL SE (https://www.deepl.com)
// Use of this source code is governed by an MIT
// license that can be found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlossaryEntries = void 0;
const errors_1 = require("./errors");
const utils_1 = require("./utils");
/**
 * Stores the entries of a glossary.
 */
class GlossaryEntries {
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
    constructor(options) {
        this.implEntries = {};
        if ((options === null || options === void 0 ? void 0 : options.entries) !== undefined) {
            if ((options === null || options === void 0 ? void 0 : options.tsv) !== undefined) {
                throw new errors_1.DeepLError('options.entries and options.tsv are mutually exclusive');
            }
            Object.assign(this.implEntries, options.entries);
        }
        else if ((options === null || options === void 0 ? void 0 : options.tsv) !== undefined) {
            const tsv = options.tsv;
            for (const entry of tsv.split(/\r\n|\n|\r/)) {
                if (entry.length === 0) {
                    continue;
                }
                const [source, target, extra] = entry.split('\t', 3);
                if (target === undefined) {
                    throw new errors_1.DeepLError(`Missing tab character in entry '${entry}'`);
                }
                else if (extra !== undefined) {
                    throw new errors_1.DeepLError(`Duplicate tab character in entry '${entry}'`);
                }
                this.add(source, target, false);
            }
        }
    }
    /**
     * Add the specified source-target entry.
     * @param source Source term of the glossary entry.
     * @param target Target term of the glossary entry.
     * @param overwrite If false, throw an error if the source entry already exists.
     */
    add(source, target, overwrite = false) {
        if (!overwrite && source in this.implEntries) {
            throw new errors_1.DeepLError(`Duplicate source term '${source}'`);
        }
        this.implEntries[source] = target;
    }
    /**
     * Retrieve the contained entries.
     */
    entries() {
        return this.implEntries;
    }
    /**
     * Converts glossary entries to a tab-separated values (TSV) string.
     * @return string containing entries in TSV format.
     * @throws {Error} If any glossary entries are invalid.
     */
    toTsv() {
        return Object.entries(this.implEntries)
            .map(([source, target]) => {
            GlossaryEntries.validateGlossaryTerm(source);
            GlossaryEntries.validateGlossaryTerm(target);
            return `${source}\t${target}`;
        })
            .join('\n');
    }
    /**
     * Checks if the given glossary term contains any disallowed characters.
     * @param term Glossary term to check for validity.
     * @throws {Error} If the term is not valid or a disallowed character is found.
     */
    static validateGlossaryTerm(term) {
        if (!(0, utils_1.isString)(term) || term.length === 0) {
            throw new errors_1.DeepLError(`'${term}' is not a valid term.`);
        }
        for (let idx = 0; idx < term.length; idx++) {
            const charCode = term.charCodeAt(idx);
            if ((0 <= charCode && charCode <= 31) || // C0 control characters
                (128 <= charCode && charCode <= 159) || // C1 control characters
                charCode === 0x2028 ||
                charCode === 0x2029 // Unicode newlines
            ) {
                throw new errors_1.DeepLError(`Term '${term}' contains invalid character: '${term[idx]}' (${charCode})`);
            }
        }
    }
}
exports.GlossaryEntries = GlossaryEntries;
