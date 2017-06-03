
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

const renderInput = (field, inputFactories) => {
  if (field.type in inputFactories) {
    return inputFactories[field.type](field);
  } else {
    throw new Error(`No input factory found for ${field.type}`);
  }
}

const renderForm = (state, schema, inputFactories) => {
  if (shouldRender(state, schema.cond)) {
    const fields = schema.fields.map(f => renderInput(f, inputFactories))

    const children = schema.children ? schema.children.reduce((acc, c) =>
      [ ...acc, ...renderForm(state, c, inputFactories)], []) : []

    return [
      ...fields,
      ...children,
    ]
  } else {
    return [];
  }
}

export { renderForm }
