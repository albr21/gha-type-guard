export type Schema =
  | { type: 'string'; pattern?: string }
  | { type: 'boolean' }
  | { type: 'integer' }
  | { type: 'float' }
  | { type: 'number' }
  | { type: 'any' }
  | { type: 'null' }
  | { type: 'undefined' }
  | { type: 'enum'; values: unknown[] }
  | { type: 'array'; items: Schema }
  | {
      type: 'object';
      properties: Record<string, Schema>;
      required?: string[];
    }
  | { type: 'union'; anyOf: Schema[] };

export function toSchema(item: any): Schema {
  if (!item.schema && !item.type) {
    throw new Error('Each item must have either a schema or a type defined');
  }

  if (item.schema) return item.schema;

  switch (item.type) {
    case 'string':
      return { type: 'string', pattern: item.pattern };

    case 'boolean':
      return { type: 'boolean' };

    case 'integer':
      return { type: 'integer' };

    case 'float':
      return { type: 'float' };

    case 'number':
      return { type: 'number' };

    case 'any':
      return { type: 'any' };

    case 'enum':
      return { type: 'enum', values: item.enumValues };

    case 'array':
      return {
        type: 'array',
        items: { type: item.itemsType } as Schema,
      };

    case 'object':
      return {
        type: 'object',
        properties: item.propertyTypes,
        required: item.required ?? [],
      };

    case 'union':
      return {
        type: 'union',
        anyOf: (item.unionTypes).map((t: string) => ({
          type: t,
        })) as Schema[],
      };

    default:
      throw new Error(`Unknown type: ${item.type}`);
  }
}