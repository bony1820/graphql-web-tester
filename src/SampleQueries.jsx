import { useState } from 'react';
import { buildSchema } from 'graphql';
import { faker } from '@faker-js/faker';

function generateSampleQueries(schemaText) {
  try {
    const schema = buildSchema(schemaText);
    const queries = [];
    const mutations = [];

    // Get Query type
    const queryType = schema.getQueryType();
    if (queryType) {
      const fields = queryType.getFields();
      Object.keys(fields).forEach(fieldName => {
        const field = fields[fieldName];
        const args = field.args;
        const returnType = field.type;

        const { expandedArgs, callArgs, mockArgs } = expandArgs(args);

        let query = `query`;
        if (expandedArgs.length > 0) {
          query += `(${expandedArgs.join(', ')})`;
        }
        query += ` {\n  ${fieldName}`;
        if (callArgs.length > 0) {
          query += `(${callArgs.join(', ')})`;
        }
        query += ` {\n    ${getBasicFields(returnType)}\n  }\n}`;

        let example = `query {\n  ${fieldName}`;
        if (mockArgs.length > 0) {
          example += `(${mockArgs.join(', ')})`;
        }
        example += ` {\n    ${getBasicFieldsForExample(returnType)}\n  }\n}`;

        queries.push({
          name: fieldName,
          request: query,
          example
        });
      });
    }

    // Get Mutation type
    const mutationType = schema.getMutationType();
    if (mutationType) {
      const fields = mutationType.getFields();
      Object.keys(fields).forEach(fieldName => {
        const field = fields[fieldName];
        const args = field.args;
        const returnType = field.type;

        const { expandedArgs, callArgs, mockArgs } = expandArgs(args);

        let mutation = `mutation`;
        if (expandedArgs.length > 0) {
          mutation += `(${expandedArgs.join(', ')})`;
        }
        mutation += ` {\n  ${fieldName}`;
        if (callArgs.length > 0) {
          mutation += `(${callArgs.join(', ')})`;
        }
        mutation += ` {\n    ${getBasicFields(returnType)}\n  }\n}`;

        let example = `mutation {\n  ${fieldName}`;
        if (mockArgs.length > 0) {
          example += `(${mockArgs.join(', ')})`;
        }
        example += ` {\n    ${getBasicFieldsForExample(returnType)}\n  }\n}`;

        mutations.push({
          name: fieldName,
          request: mutation,
          example
        });
      });
    }

    return { queries, mutations };
  } catch (error) {
    console.error('Error parsing schema:', error);
    return { queries: [], mutations: [] };
  }
}

function expandArgs(args) {
  const expandedArgs = [];
  const callArgs = [];
  const mockArgs = [];

  args.forEach(arg => {
    const argType = arg.type;
    const unwrappedType = argType.ofType || argType;
    if (unwrappedType.getFields) {
      // Input type, expand fields
      const inputFields = unwrappedType.getFields();
      Object.keys(inputFields).forEach(fieldName => {
        const field = inputFields[fieldName];
        expandedArgs.push(`$${fieldName}: ${field.type}`);
      });
      const inputObj = Object.keys(inputFields).map(fieldName => `${fieldName}: $${fieldName}`).join(', ');
      callArgs.push(`${arg.name}: { ${inputObj} }`);
      const mockObj = Object.keys(inputFields).map(fieldName => `${fieldName}: ${getMockValue(inputFields[fieldName].type)}`).join(', ');
      mockArgs.push(`${arg.name}: { ${mockObj} }`);
    } else {
      // Regular arg
      expandedArgs.push(`$${arg.name}: ${arg.type}`);
      callArgs.push(`${arg.name}: $${arg.name}`);
      mockArgs.push(`${arg.name}: ${getMockValue(arg.type)}`);
    }
  });

  return { expandedArgs, callArgs, mockArgs };
}

function getMockValue(type) {
  const unwrapped = type.ofType || type;
  if (unwrapped.name === 'String') {
    return `"${faker.lorem.words(2)}"`;
  }
  if (unwrapped.name === 'ID') return `"${faker.string.uuid()}"`;
  if (unwrapped.name === 'Int') {
    return faker.number.int({ min: 1, max: 100 });
  }
  if (unwrapped.name === 'Boolean') return faker.datatype.boolean();
  if (unwrapped.name === 'DateTime') return `"${faker.date.recent().toISOString()}"`;
  return `"${faker.lorem.word()}"`; // Default
}

function getBasicFields(type, depth = 0) {
  if (depth > 2) return 'id'; // Prevent deep nesting
  if (type.ofType) {
    return getBasicFields(type.ofType, depth);
  }
  if (type.getFields) {
    const fields = type.getFields();
    const basicFields = Object.keys(fields).slice(0, 3).map(fieldName => {
      const fieldType = fields[fieldName].type;
      const unwrapped = fieldType.ofType || fieldType;
      if (unwrapped.getFields && depth < 1) {
        return `${fieldName} {\n      ${getBasicFields(unwrapped, depth + 1)}\n    }`;
      } else {
        return fieldName;
      }
    });
    return basicFields.join('\n    ');
  }
  return 'id';
}

function getBasicFieldsForExample(type) {
  if (type.ofType) {
    return getBasicFieldsForExample(type.ofType);
  }
  if (type.getFields) {
    const fields = type.getFields();
    const basicFields = Object.keys(fields).slice(0, 3);
    return basicFields.join('\n    ');
  }
  return 'id';
}

export default function SampleQueries() {
  const [queries, setQueries] = useState([]);
  const [mutations, setMutations] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const { queries: q, mutations: m } = generateSampleQueries(text);
        setQueries(q);
        setMutations(m);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Sample GraphQL Queries</h1>
      <input type="file" accept=".graphql" onChange={handleFileUpload} />
      {queries.length > 0 && (
        <>
          <h2>Queries</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {queries.map((q, idx) => (
              <li key={idx} style={{ marginBottom: 24 }}>
                <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{idx + 1}. {q.name}</div>
                <div style={{ marginBottom: 8 }}>
                  <strong>Request:</strong>
                  <pre style={{ background: '#222', color: '#fff', padding: 12, fontSize: 14, whiteSpace: 'pre-wrap', marginTop: 4 }}>{q.request}</pre>
                </div>
                <div>
                  <strong>Example:</strong>
                  <pre style={{ background: '#222', color: '#fff', padding: 12, fontSize: 14, whiteSpace: 'pre-wrap', marginTop: 4 }}>{q.example}</pre>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
      {mutations.length > 0 && (
        <>
          <hr style={{ margin: '40px 0' }} />
          <h2>Mutations</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {mutations.map((q, idx) => (
              <li key={idx} style={{ marginBottom: 24 }}>
                <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{idx + 1}. {q.name}</div>
                <div style={{ marginBottom: 8 }}>
                  <strong>Request:</strong>
                  <pre style={{ background: '#222', color: '#fff', padding: 12, fontSize: 14, whiteSpace: 'pre-wrap', marginTop: 4 }}>{q.request}</pre>
                </div>
                <div>
                  <strong>Example:</strong>
                  <pre style={{ background: '#222', color: '#fff', padding: 12, fontSize: 14, whiteSpace: 'pre-wrap', marginTop: 4 }}>{q.example}</pre>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
