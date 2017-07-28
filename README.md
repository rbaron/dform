# dform - JSON Schema based dynamic forms.

dform is a set of libraries for managing dynamic forms. The dynamic forms are described through a JSON schema. Client libraries -- targeting, for example, the web or mobile environments -- read a dform JSON schema and render the forms accordingly.

This repository hosts the "core" logic, purely in javascript, that is the base onto which platform-specific libraries can be implemented. This library simply determines "when" each input should be rendered in a form, given a schema. The "how" is left for the client libraries to implement. This makes it easy for a schema to have the same behavior in different platforms (web and mobile, for instance).

For examples of client libraries, which rely on this one, check out:

* [react-dform](https://github.com/rbaron/react-dform) - React (web)
* [react-native-dform](https://github.com/rbaron/react-native-dform) - React Native

In order to aid the creation of dform JSON schemas, which can be tricky for big/complex dynamic forms, there is also the [dform-editor](https://github.com/rbaron/dform-editor) repository that hosts a web-based dform schema editor.

# Installation

```sh
  $ npm install --save dform
```

or

```sh
$ yarn add dform
```

# Example

In the following example, there are three inputs defined in the `schema`. Inputs `input1` and `input2` will be rendered if `state.showForm` is `true`, whereas `input3` will be rendered if, in addition, `input1` is `true` _and_ `input2` is not empty:

```javascript
import { renderForm } from 'dform'

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
// This should be customized by the implementing client library.
// Here we just have dummy inputs, which are really just strings.
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
```

# License

MIT
