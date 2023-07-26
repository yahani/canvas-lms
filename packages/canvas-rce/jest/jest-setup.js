/*
 * Copyright (C) 2019 - present Instructure, Inc.
 *
 * This file is part of Canvas.
 *
 * Canvas is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

// Several components use aphrodite, which tries to manipulate the dom
// on a timer which expires after the test completes and the document no longer exists
import {StyleSheetTestUtils} from 'aphrodite'
import {filterUselessConsoleMessages} from '@instructure/js-utils'

/**
 * We want to ensure errors and warnings get appropriate eyes. If
 * you are seeing an exception from here, it probably means you
 * have an unintended consequence from your changes. If you expect
 * the warning/error, add it to the ignore list below.
 */
/* eslint-disable no-console */
const globalError = global.console.error
const ignoredErrors = [
  /An update to %s inside a test was not wrapped in act/,
  /Can't perform a React state update on an unmounted component/,
  /A component is changing a controlled input of type %s to be uncontrolled/,
  /A component is changing an uncontrolled input of type %s to be controlled./,
  /The prop `renderLabel` is marked as required in `SimpleSelect`/,
  /The prop `sortBy.order` is marked as required in `Images`/,
  /SyntaxError: unknown pseudo-class selector ':host>/,
  /You seem to have overlapping act\(\) calls/,
  /Invalid prop `documents.searchString` of type `string` supplied to `DocumentsPanel`/,
  /The prop `sortBy.order` is marked as required in `DocumentsPanel`/,
  /The prop `sortBy.order` is marked as required in `SavedIconMakerList`/,
  /Invalid prop `images.searchString` of type `string` supplied to `SavedIconMakerList`/,
  /The prop `refreshToken` is marked as required in `RceFileBrowser`/,
  /Invalid prop `media.searchString` of type `string` supplied to `MediaPanel`/,
  /The prop `label` is marked as required in `FormField`/,
  /The prop `label` is marked as required in `FormFieldLayout`/,
  /Can't call %s on a component that is not yet mounted./,
  /The prop `dimensionsState.usePercentageUnits` is marked as required in `DimensionsInput`/,
  /The prop `videoOptions.naturalHeight` is marked as required in `VideoOptionsTray`/,
  /The prop `renderLabel` is marked as required in `Select`/,
  /The prop `renderLabel` is marked as required in `NumberInput`/,
  /The prop `sortBy.order` is marked as required in `MediaPanel`/,
  /Invalid prop `images.searchString` of type `string` supplied to `Images`/,
  /Invalid prop `source` of type `object` supplied to `RceFileBrowser`/,
  /unknown pseudo-class selector'/,
  /Invalid URL: undefined/,
  /failed updating video captions/,
  /The prop `state.compressed` is marked as required in `ImageOptions`/,
  /The prop `state.image` is marked as required in `ImageOptions`/,
  /The prop `data.icon` is marked as required in `SingleColor`/,
  /The content `content` is marked as required in `LinkOptionsTray`/,
  /The prop `host` is marked as required in `RceFileBrowser`/,
  /The prop `jwt` is marked as required in `RceFileBrowser`/,
  /The prop `source` is marked as required in `RceFileBrowser`/,
  /The prop `contextType` is marked as required in `DocumentsPanel`/,
  /The prop `media.course.files\[0].title` is marked as required in `MediaPanel`/,
  /The prop `contextType` is marked as required in `MediaPanel`/,
  /The prop `audioOptions.titleText` is marked as required in `AudioOptionsTray`/,
  /The prop `audioOptions.id` is marked as required in `AudioOptionsTray`/,
  /The prop `trayProps` is marked as required in `AudioOptionsTray`/,
  /Invalid prop `audioOptions` of type `boolean` supplied to `AudioOptionsTray`/,
  /The prop `context` is marked as required in `RceFileBrowser`/,
  /Invalid prop `audioOptions` of type `boolean` supplied to `AudioOptionsTray`/,
  /Not implemented: navigation/,
  /Not implemented: HTMLFormElement.prototype.submit/,
  /The prop `images.course.files\[0].content_type` is marked as required in `Images`/,
  /Cannot read properties of undefined \(reading 'canvadoc_session_url'\)/,
]
const globalWarn = global.console.warn
const ignoredWarnings = [
  /componentWillReceiveProps has been renamed/,
  /Store interaction failed/,
  /Unsupported LTI 1.3 Content Item/,
  /Found bad LTI MRU data/,
  /Cannot save LTI MRU list/,
  /clicked sidebar (link|image) without a focused editor/,
]
global.console = {
  log: console.log,
  error: error => {
    if (ignoredErrors.some(regex => regex.test(error))) {
      return
    }
    globalError(error)
    throw new Error(
      `Looks like you have an unhandled error. Keep our test logs clean by handling or filtering it. ${error}`
    )
  },
  warn: warning => {
    if (ignoredWarnings.some(regex => regex.test(warning))) {
      return
    }
    globalWarn(warning)
    throw new Error(
      `Looks like you have an unhandled warning. Keep our test logs clean by handling or filtering it. ${warning}`
    )
  },
  info: console.info,
  debug: console.debug,
}
/* eslint-enable no-console */

filterUselessConsoleMessages(console)
StyleSheetTestUtils.suppressStyleInjection()

// because InstUI themeable components need an explicit "dir" attribute on the <html> element
document.documentElement.setAttribute('dir', 'ltr')

require('@instructure/ui-themes')

// set up mocks for native APIs
if (!('MutationObserver' in window)) {
  Object.defineProperty(window, 'MutationObserver', {
    value: require('@sheerun/mutationobserver-shim'),
  })
}

if (!('ResizeObserver' in window)) {
  Object.defineProperty(window, 'ResizeObserver', {
    writable: true,
    configurable: true,
    value: class IntersectionObserver {
      observe() {
        return null
      }

      unobserve() {
        return null
      }
    },
  })
}

if (typeof window.URL.createObjectURL === 'undefined') {
  Object.defineProperty(window.URL, 'createObjectURL', {value: () => 'http://example.com/whatever'})
}

window.scroll = () => {}
window.ENV = {}
