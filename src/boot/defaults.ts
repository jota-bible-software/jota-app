import { QBtn,QBtnDropdown, QCheckbox, QFile, QInput, QList, QSelect, QRadio, QToggle, QTooltip } from 'quasar'
import { boot } from 'quasar/wrappers'

const defaults = {
  formField: {
    outlined: true,
    dense: true,
    'dropdown-icon': 'expand_more',
  },
  other: {
    // dense: true
  }
}

export default boot(() => {
  setDefaults(QBtn, { noWrap: true})
  setDefaults(QBtnDropdown, defaults.formField)
  setDefaults(QCheckbox, defaults.formField)
  setDefaults(QInput, defaults.formField)
  setDefaults(QList, defaults.other)
  setDefaults(QRadio, defaults.formField)
  setDefaults(QSelect, defaults.formField)
  setDefaults(QToggle, defaults.formField)
  setDefaults(QFile, defaults.formField)
  setDefaults(QTooltip, { delay: 500 })
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setDefaults(component: any, defaults: Record<string, unknown>) {
  Object.keys(defaults).forEach(prop => {
    component.props[prop] = Array.isArray(component.props[prop]) === true || typeof component.props[prop] === 'function'
      ? { type: component.props[prop], default: defaults[prop] }
      : { ...component.props[prop], default: defaults[prop] }
  })
}

window._jota_test_support = {
  getSelectionRange: () => {
    const selection = document.getSelection()
    return selection?.rangeCount ? selection.getRangeAt(0) : undefined
  },
}
