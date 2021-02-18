export const generateCacheGroups = (parts: string[]) => {
    const groups: { [key: string]: any } = {};
    parts.forEach(part => {
        groups[`suite-${part}`] = {
            chunks: 'initial',
            name: `suite-${part}`,
            test: new RegExp(`/packages/suite/src/${part}/`),
        };
    });

    return groups;
};
