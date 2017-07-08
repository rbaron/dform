import { activeFields, renderForm } from '../src/dform'

const schema = {
  // height 1 node 1
  fields: [{
    type: 'string',
    id: 'field_111'
  }, {
    type: 'boolean',
    id: 'field_112'
  }],
  cond: {
    type: 'always_true',
  },
  children: [{
  // height 2 node 1
    fields: [{
      type: 'boolean',
      id: 'field_211',
    }, {
      type: 'string',
      id: 'field_212',
    }],
    cond: {
      type: 'and',
      conds: [{
        type: 'not_empty',
        field_id: 'field_111',
      }, {
        type: 'truthy',
        field_id: 'field_112',
      }],
    },
    children: [{
      // height 3 node 1
      fields: [{
        type: 'string',
        id: 'field_311',
      }],
      cond: {
        type: 'always_true',
      },
    }],
  }, {
    // height 2 node 2
    fields: [{
      type: 'boolean',
      id: 'field_221',
    }, {
      type: 'string',
      id: 'field_222',
    }],
    cond: {
      type: 'or',
      conds: [{
        type: 'not_empty',
        field_id: 'field_111',
      }, {
        type: 'truthy',
        field_id: 'field_112',
      }],
    },
    children: [{
      // height 3 node 2
      fields: [{
        type: 'string',
        id: 'field_321',
      }],
      cond: {
        type: 'equals',
        field_id: 'field_221',
        field_value: true,
      },
    }],
  }],
}

const inputFactories = {
  'string': (args) => `<StringInput ${JSON.stringify(args)}>`,
  'boolean': (args) => `<BooleanInput ${JSON.stringify(args)}>`,
}

describe('render', () => {
  it('renders all fields', () => {
    const state = {
      field_111: 'Some content',
      field_112: true,
      field_221: true,
    }

    const rendered = renderForm(state, schema, inputFactories);
    expect(rendered).toHaveLength(8)
    expect(rendered).toMatchSnapshot()
  })

  it('renders node 11 and node 22 fields', () => {
    const state = {
      field_111: '',
      field_112: true,
    }

    const rendered = renderForm(state, schema, inputFactories);
    expect(rendered).toHaveLength(4)
    expect(rendered).toMatchSnapshot()
  })

  it('renders node 11, node 22 and node 32 fields', () => {
    const state = {
      field_111: '',
      field_112: true,
      field_221: true,
    }

    const rendered = renderForm(state, schema, inputFactories);
    expect(rendered).toHaveLength(5)
    expect(rendered).toMatchSnapshot()
  })

  it('renders node 11 and node 22 fields', () => {
    const state = {
      field_111: '',
      field_112: true,
      field_221: false,
    }

    const rendered = renderForm(state, schema, inputFactories);
    expect(rendered).toHaveLength(4)
    expect(rendered).toMatchSnapshot()
  })
})

describe('activeKeys', () => {
  it('returns all fields', () => {
    const state = {
      field_111: 'Some content',
      field_112: true,
      field_221: true,
    }

    const fields = activeFields(state, schema)
    const fieldSet = new Set(fields.map(f => f.id))

    const expected = new Set([
      'field_111',
      'field_112',
      'field_211',
      'field_212',
      'field_311',
      'field_221',
      'field_222',
      'field_321',
    ])
    expect(fieldSet).toEqual(expected)
  })

  it.only('returns expected fields', () => {
    const state = {
      field_111: 'Some content',
      field_112: false,
      field_221: true,
    }
    const fields = activeFields(state, schema)
    const fieldSet = new Set(fields.map(f => f.id))

    const expected = new Set([
      'field_111',
      'field_112',
      'field_221',
      'field_222',
      'field_321',
    ])
    expect(fieldSet).toEqual(expected)
  })
})
