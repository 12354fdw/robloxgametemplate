/** get a class's symbol via __csymbol */
export const getDIClassSymbol = <T extends object>(obj: T): string => {
    const meta = getmetatable(obj) as { __csymbol?: string; __index?: object};
    const symbol = meta.__csymbol;
    if (symbol !== undefined) return symbol;

    if (!meta.__index) {
        const mmeta = getmetatable(meta);
        assert(mmeta);

        return getDIClassSymbol(meta);
    }

    assert(meta.__index !== obj);
    return getDIClassSymbol(meta.__index);
}