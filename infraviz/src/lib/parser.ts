import { TerraformResource } from "./types";

/**
 * A simplified HCL parser for the MVP.
 * It extracts 'resource' blocks and their attributes.
 * 
 * NOTE: This is not a full HCL parser. It relies on standard formatting.
 * For a production app, we would use a WASM-compiled 'hcl2json' or similar.
 */
export function parseTerraform(content: string): TerraformResource[] {
    const resources: TerraformResource[] = [];

    // Regex to find resource blocks: resource "type" "name" { ... }
    // We use a simple approach: find the start, then find the matching closing brace.
    const resourceRegex = /resource\s+"([^"]+)"\s+"([^"]+)"\s+\{/g;

    let match;
    while ((match = resourceRegex.exec(content)) !== null) {
        const [fullMatch, type, name] = match;
        const startIndex = match.index + fullMatch.length;
        const blockContent = extractBlockContent(content, startIndex);

        if (blockContent) {
            const attributes = parseAttributes(blockContent);
            resources.push({
                id: `${type}.${name}`,
                type,
                name,
                attributes,
            });
        }
    }

    return resources;
}

function extractBlockContent(content: string, startIndex: number): string | null {
    let depth = 1;
    let currentIndex = startIndex;

    while (depth > 0 && currentIndex < content.length) {
        const char = content[currentIndex];
        if (char === '{') depth++;
        if (char === '}') depth--;
        currentIndex++;
    }

    if (depth === 0) {
        return content.substring(startIndex, currentIndex - 1);
    }

    return null;
}

function parseAttributes(blockContent: string): Record<string, any> {
    const attributes: Record<string, any> = {};
    const lines = blockContent.split('\n');

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('//')) continue;

        // Simple attribute: key = "value" or key = reference
        const parts = trimmed.split('=');
        if (parts.length >= 2) {
            const key = parts[0].trim();
            let value = parts.slice(1).join('=').trim();

            // Remove quotes if present
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            }

            attributes[key] = value;
        }
    }

    return attributes;
}
