import { renderForm } from './src/dform'

const schema = {
    cond: {
      type: 'equals',
      field_id: 'showForm',
      field_value: true,
    },
    fields: [{
      type: 'boolean',
      id: 'input1',
    }, {
      type: 'string',
      id: 'input2'
    }],
    children: [{
      cond: {
        type: 'and',
        conds: [{
            type: 'truthy',
            field_id: 'input1',
        }, {
            type: 'not_empty',
            field_id: 'input2',
        }],
      },
      fields: [{
          type: 'boolean',
          id: 'input3',
      }],
    }],
}

const inputFactories = {
    'boolean': args => `<BooleanInput id=${args.id}>`,
    'string': args => `<StringInput id=${args.id}>`,
}

const state = {
    showForm: true,
    input1: true,
    input2: 'Some string',
}
console.log(renderForm(state, schema, inputFactories))
// [ '<BooleanInput id=input1>',
//   '<StringInput id=input2>',
//   '<BooleanInput id=input3>' ]

state.input1 = false
console.log(renderForm(state, schema, inputFactories))
// [ '<BooleanInput id=input1>', '<StringInput id=input2>' ]

state.showForm = false
console.log(renderForm(state, schema, inputFactories))
// []
