
const shouldRender = (state, cond) => {
  if (cond.type === 'always_true') {
    return true
  } else if (cond.type === 'equals') {
    return state[cond.field_id] === cond.field_value;
  } else if (cond.type === 'not_empty') {
    return state[cond.field_id] !== '';
  } else if (cond.type === 'truthy') {
    return !!state[cond.field_id];
  } else if (cond.type === 'falsy') {
    return !state[cond.field_id];
  } else if (cond.type === 'and') {
    return cond.conds.every(c => shouldRender(state, c))
  } else if (cond.type === 'or') {
    return cond.conds.some(c => shouldRender(state, c))
  } else {
    return false
  }
}

const renderInput = (field, inputFactories, missingFactoryHandler) => {
  if (field.type in inputFactories) {
    return inputFactories[field.type](field);
  } else if (missingFactoryHandler) {
    return missingFactoryHandler(field);
  } else {
    throw new Error(`No input factory found for ${field.type}`);
  }
}

const renderForm = (state, schema, inputFactories, missingFactoryHandler = null) => {
  if (shouldRender(state, schema.cond)) {
    const fields = schema.fields.map(f => renderInput(f, inputFactories, missingFactoryHandler))

    const children = schema.children ? schema.children.reduce((acc, c) =>
      [ ...acc, ...renderForm(state, c, inputFactories, missingFactoryHandler)], []) : []

    return [
      ...fields,
      ...children,
    ]
  } else {
    return [];
  }
}

const activeFields = (state, schema) => {
  const inputFactories = {}
  const missingFactoryHandler = field => field

  return renderForm(state, schema, inputFactories, missingFactoryHandler)
}

const defaultState = (schema, keyExtractor) => {
  const getDefault = field => {
    switch (field.type) {
      case 'boolean':
        return field.default || false
      case 'string':
        return field.default || ''
      default:
        return field.default
    }
  }

  const traverse = (schema) => {
    const state = schema.fields.reduce((acc, f) => {
      return { ...acc, [keyExtractor(f)]: getDefault(f) }
    }, {})

    if (!schema.children) {
      return state
    } else {
      return schema.children.reduce((acc, child) => ({
        ...acc,
        ...traverse(child),
      }), state)
    }
  }

  return traverse(schema)
}

export { activeFields, defaultState, renderForm }
