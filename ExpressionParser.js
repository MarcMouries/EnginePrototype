export class ExpressionParser {
    // Parses a template string into an expression
    parse(template) {
        // Directly returns the template assuming it's a valid expression
        return template;
    }

    // Parses a template string and returns all unique paths it depends on
    parseDependentPaths(template) {
        const regex = /\{\{(.*?)\}\}/g;
        let match;
        const paths = new Set();
        while ((match = regex.exec(template))) {
            paths.add(match[1].trim());
        }
        return Array.from(paths);
    }
}
