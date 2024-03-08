import { QBtnDropdown, QCheckbox, QInput, QList, QSelect, QRadio, QToggle } from 'quasar'
import { boot } from 'quasar/wrappers'

const defaults = {
  formField: {
    filled: true,
    dense: true,
    'dropdown-icon': 'expand_more',
  },
  other: {
    // dense: true
  }
}

export default boot(() => {
  setDefaults(QBtnDropdown, defaults.formField)
  setDefaults(QCheckbox, defaults.formField)
  setDefaults(QInput, defaults.formField)
  setDefaults(QList, defaults.other)
  setDefaults(QRadio, defaults.formField)
  setDefaults(QSelect, defaults.formField)
  setDefaults(QToggle, defaults.formField)
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setDefaults(component: any, defaults: Record<string, unknown>) {
  Object.keys(defaults).forEach(prop => {
    component.props[prop] = Array.isArray(component.props[prop]) === true || typeof component.props[prop] === 'function'
      ? { type: component.props[prop], default: defaults[prop] }
      : { ...component.props[prop], default: defaults[prop] }
  })
}
