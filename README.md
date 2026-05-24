# gha-type-guard

Action to check types at runtime using TypeScript's type system.

Provides a way to validate that values conform to specified types, including support for complex types like arrays, enums, objects, and unions. This can be used to ensure that inputs to your GitHub Actions are of the expected types, improving reliability and reducing errors.

## Usage

```yaml
steps:
  - name: Check types
    uses: albr21/gha-type-guard@v1
    with:
      payload: |-
        [
          {"value": <value1>, "type": "string"},
          {"value": <value2>, "type": "boolean"},
        ]
```

Payload format:
- Simple format:
```yaml
payload: |-
    [
      {"value": <value1>, "type": "string"},
      {"value": <value1>, "type": "string", "pattern": "^[a-zA-Z]+$"},
      {"value": <value2>, "type": "boolean"},
      {"value": <value3>, "type": "integer"},
      {"value": <value4>, "type": "float"},
      {"value": <value4>, "type": "number"},
      {"value": <value8>, "type": "any"},
      {"value": <value5>, "type": "array", "itemsType": "string"},
      {"value": <value6>, "type": "enum", "enumValues": ["value1", "value2"]},
      {"value": <value7>, "type": "object", "propertyTypes": {"name": "string", "age": "integer"}},
      {"value": <value11>, "type": "union", "unionTypes": ["string", "integer"]}
    ]
```
- Schema Format:
```yaml
payload: |-
    [
      {"value": <value1>, "schema": {"type": "string"}},
      {"value": <value2>, "schema": {"type": "boolean"}},
      {"value": <value3>, "schema": {"type": "integer"}},
      {"value": <value4>, "schema": {"type": "float"}},
      {"value": <value4>, "schema": {"type": "number"}},
      {"value": <value5>, "schema": {"type": "array", "items": {"type": "string"}}},
      {"value": <value6>, "schema": {"type": "enum", "values": ["value1", "value2"]}},
      {"value": <value7>, "schema": {"type": "object", "properties": {"name": {"type":"string"}, "age":{"type":"integer"}}, "required": ["name", "age"]}},
      {"value": <value8>, "schema": {"type": "any"}},
      {"value": <value11>, "schema": {"type": "union", "anyOf": [{"type": "string"}, {"type": "integer"}]}}
    ]
```

## Contributing

Check out the [CONTRIBUTING](CONTRIBUTING.md) file for guidelines on how to contribute to this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
