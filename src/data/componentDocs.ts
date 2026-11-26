export interface ApiRow {
  name: string
  type?: string
  default?: string
  description: string
}

export interface ComponentNavItem {
  slug: string
  name: string
  category: string
  phase: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
  summary: string
  importSymbol?: string
  status?: 'Ready' | 'Beta'
  a11y?: {
    keyboard?: string[]
    aria?: string[]
  }
}

export const PHASE_TITLES: Record<ComponentNavItem['phase'], string> = {
  0: 'Foundation',
  1: 'Core & Layout',
  2: 'Form Inputs',
  3: 'Data Display',
  4: 'Feedback & Overlay',
  5: 'Navigation',
  6: 'Advanced Data',
  7: 'Forms Advanced',
  8: 'Panels & Layout',
  9: 'Menus',
  10: 'Data Advanced',
  11: 'Overlays, Media & Directives'
}

export const COMPONENT_NAV: ComponentNavItem[] = [
  {
    slug: 'utilities',
    name: 'Theme Utilities',
    category: 'Foundation',
    phase: 0,
    summary: 'Theme-adaptive .mfs-* CSS utility classes for custom styling across Clay, Glass, and Neo.'
  },
  // Phase 1 (6)
  {
    slug: 'button',
    name: 'Button',
    category: 'Core',
    phase: 1,
    summary: 'Adaptive action button with variants, sizes, loading state, and tactile depth.',
    a11y: {
      keyboard: ['Enter / Space activates button', 'Tab moves focus'],
      aria: ['aria-busy when loading', 'disabled attribute prevents activation']
    }
  },
  {
    slug: 'button-group',
    name: 'ButtonGroup',
    category: 'Core',
    phase: 1,
    summary: 'Grouped container joining adjacent buttons with collapsed borders and shared radius.'
  },
  {
    slug: 'input',
    name: 'Input',
    category: 'Form',
    phase: 1,
    summary: 'Single-line text input with label, helper text, error state, and theme-aware depth.',
    a11y: {
      keyboard: ['Tab focuses input', 'Standard text editing shortcuts'],
      aria: ['Associated <label> via for/id', 'aria-invalid and error message binding']
    }
  },
  {
    slug: 'card',
    name: 'Card',
    category: 'Layout',
    phase: 1,
    summary: 'Surface container with header, body, and footer slots for grouped content.'
  },
  {
    slug: 'badge',
    name: 'Badge',
    category: 'Display',
    phase: 1,
    summary: 'Compact status indicator and counter pill in semantic theme colors.'
  },
  {
    slug: 'overlay-badge',
    name: 'OverlayBadge',
    category: 'Display',
    phase: 1,
    status: 'Ready',
    summary: 'Positions a status or counter Badge on the top-right corner of any wrapped element.'
  },
  {
    slug: 'switch',
    name: 'Switch',
    category: 'Form',
    phase: 1,
    summary: 'Accessible boolean toggle switch with keyboard support and smooth thumb motion.',
    a11y: {
      keyboard: ['Space / Enter toggles state'],
      aria: ['role="switch"', 'aria-checked reflects boolean state']
    }
  },
  {
    slug: 'modal',
    name: 'Modal',
    category: 'Overlay',
    phase: 1,
    summary: 'Focus-managed dialog overlay with backdrop blur, ESC close, and action slots.',
    a11y: {
      keyboard: ['Escape closes modal', 'Tab cycles focus inside dialog'],
      aria: ['role="dialog"', 'aria-modal="true"', 'aria-labelledby for title']
    }
  },

  // Phase 2 (11)
  {
    slug: 'textarea',
    name: 'Textarea',
    category: 'Form',
    phase: 2,
    summary: 'Multi-line text area with auto-resize option, character count, and validation.'
  },
  {
    slug: 'input-number',
    name: 'InputNumber',
    category: 'Form',
    phase: 2,
    summary: 'Numeric stepper input with min/max bounds, step increments, and keyboard arrows.'
  },
  {
    slug: 'password',
    name: 'Password',
    category: 'Form',
    phase: 2,
    summary: 'Secure password field with visibility toggle and optional strength indicator.'
  },
  {
    slug: 'checkbox',
    name: 'Checkbox',
    category: 'Form',
    phase: 2,
    summary: 'Binary or array-bound checkbox with indeterminate state and tactile check mark.',
    a11y: {
      keyboard: ['Space toggles checked state'],
      aria: ['Native checkbox or aria-checked="mixed" for indeterminate']
    }
  },
  {
    slug: 'checkbox-group',
    name: 'CheckboxGroup',
    category: 'Form',
    phase: 2,
    status: 'Ready',
    summary: 'Accessible group container managing shared array v-model, direction, and invalid/disabled states for Checkboxes.',
    a11y: {
      keyboard: ['Tab moves between checkboxes', 'Space toggles each checkbox'],
      aria: ['role="group"', 'aria-invalid when invalid']
    }
  },
  {
    slug: 'radio-button',
    name: 'RadioButton',
    category: 'Form',
    phase: 2,
    summary: 'Mutually exclusive radio option with accessible group semantics.'
  },
  {
    slug: 'radio-button-group',
    name: 'RadioButtonGroup',
    category: 'Form',
    phase: 2,
    status: 'Ready',
    summary: 'Accessible radiogroup container coordinating shared name, single-value v-model, and layout direction.',
    a11y: {
      keyboard: ['ArrowUp / ArrowDown or ArrowLeft / ArrowRight cycle options', 'Space selects focused radio'],
      aria: ['role="radiogroup"', 'aria-invalid when invalid']
    }
  },
  {
    slug: 'chips',
    name: 'Chips',
    category: 'Form',
    phase: 2,
    status: 'Ready',
    summary: 'Multi-tag text input creating removable Chip pills via Enter or separator keys.',
    a11y: {
      keyboard: ['Enter or separator key adds chip', 'Backspace removes last chip when input is empty'],
      aria: ['aria-invalid when invalid or error is set', 'Native remove buttons for each chip']
    }
  },
  {
    slug: 'select',
    name: 'Select',
    category: 'Form',
    phase: 2,
    summary: 'Searchable single-select dropdown with keyboard navigation and clearable option.',
    a11y: {
      keyboard: ['ArrowUp / ArrowDown navigate options', 'Enter selects', 'Escape closes'],
      aria: ['role="combobox"', 'aria-expanded', 'aria-activedescendant']
    }
  },
  {
    slug: 'multi-select',
    name: 'MultiSelect',
    category: 'Form',
    phase: 2,
    summary: 'Multi-value searchable dropdown selector displaying chosen items as removable chips with select-all support.',
    a11y: {
      keyboard: ['Enter toggles dropdown', 'Escape closes dropdown', 'Tab navigates chip remove buttons and options'],
      aria: ['role="combobox"', 'aria-expanded', 'aria-invalid', 'role="listbox" with aria-multiselectable="true"', 'role="option" with aria-selected']
    }
  },
  {
    slug: 'slider',
    name: 'Slider',
    category: 'Form',
    phase: 2,
    summary: 'Continuous or stepped range slider supporting single value, dual-thumb range, and keyboard arrow stepping.',
    a11y: {
      keyboard: ['ArrowLeft / ArrowDown decrease value', 'ArrowRight / ArrowUp increase value', 'Home / End jump to min/max'],
      aria: ['role="slider"', 'aria-valuemin, aria-valuemax, aria-valuenow', 'aria-label on single and dual thumbs']
    }
  },
  {
    slug: 'rating',
    name: 'Rating',
    category: 'Form',
    phase: 2,
    summary: 'Interactive star rating slider with readonly display, clearable selection, and keyboard arrow support.',
    a11y: {
      keyboard: ['ArrowRight / ArrowUp increment rating', 'ArrowLeft / ArrowDown decrement rating', 'Tab focuses rating control'],
      aria: ['role="slider"', 'aria-valuemin="0", aria-valuemax, aria-valuenow', 'aria-label on container and individual star buttons']
    }
  },
  {
    slug: 'color-picker',
    name: 'ColorPicker',
    category: 'Form',
    phase: 2,
    summary: 'Color swatch and hex picker popover with preset palette, hex input, and live preview.',
    a11y: {
      keyboard: ['Tab navigates trigger, hex input, and swatches', 'Escape closes popover'],
      aria: ['aria-expanded on trigger', 'aria-label="Pick a color"', 'aria-label on palette, hex input, and each swatch']
    }
  },
  {
    slug: 'date-picker',
    name: 'DatePicker',
    category: 'Form',
    phase: 2,
    summary: 'Calendar popover date selector with min/max constraints, disabled dates, and formatted output.',
    a11y: {
      keyboard: ['Tab navigates trigger, month controls, and day buttons', 'Escape closes calendar popover'],
      aria: ['aria-expanded on trigger', 'aria-invalid when error is set', 'Native button semantics for day and month controls']
    }
  },
  {
    slug: 'form',
    name: 'Form & FormField',
    category: 'Form',
    phase: 2,
    status: 'Ready',
    importSymbol: 'Form',
    summary: 'Schema/resolver form container with FormField context, submit handling, and server 422 error mapping.',
    a11y: {
      keyboard: ['Enter submits form from inputs', 'Tab moves sequentially across FormField controls'],
      aria: ['Native <form> submission semantics', 'Associated <label> and inline error messages via FormField']
    }
  },
  {
    slug: 'mentions',
    name: 'Mentions',
    category: 'Form',
    phase: 2,
    status: 'Ready',
    summary: 'Textarea with @ trigger detection, floating suggestion list, and async remote search support.',
    a11y: {
      keyboard: ['ArrowUp / ArrowDown navigate suggestions', 'Enter inserts selected mention', 'Escape closes suggestion list'],
      aria: ['role="combobox" with aria-autocomplete="list" and aria-expanded', 'role="listbox" and role="option" with aria-selected']
    }
  },

  // Phase 3 (7)
  {
    slug: 'avatar',
    name: 'Avatar',
    category: 'Display',
    phase: 3,
    summary: 'User or entity representation supporting images, initials, shapes, and sizes.'
  },
  {
    slug: 'avatar-group',
    name: 'AvatarGroup',
    category: 'Display',
    phase: 3,
    status: 'Ready',
    summary: 'Overlapping avatar stack with configurable max limit and +N overflow indicator.'
  },
  {
    slug: 'chip',
    name: 'Chip',
    category: 'Display',
    phase: 3,
    summary: 'Compact tag/chip element with optional icon, severity, and removable action.'
  },
  {
    slug: 'divider',
    name: 'Divider',
    category: 'Layout',
    phase: 3,
    summary: 'Horizontal or vertical content separator with optional centered or aligned label.'
  },
  {
    slug: 'accordion',
    name: 'Accordion',
    category: 'Layout',
    phase: 3,
    summary: 'Collapsible content panels supporting single or multiple expanded sections.',
    a11y: {
      keyboard: ['Enter / Space toggles panel', 'Tab moves between headers'],
      aria: ['aria-expanded on trigger', 'aria-controls linking panel region']
    }
  },
  {
    slug: 'timeline',
    name: 'Timeline',
    category: 'Display',
    phase: 3,
    summary: 'Chronological event list with custom markers, timestamps, and opposite content.'
  },
  {
    slug: 'carousel',
    name: 'Carousel',
    category: 'Display',
    phase: 3,
    summary: 'Responsive slide deck with prev/next controls, pagination dots, and autoplay.'
  },
  {
    slug: 'image',
    name: 'Image',
    category: 'Display',
    phase: 3,
    summary: 'Image container with aspect framing, fallback handling, and lightbox preview.'
  },

  // Phase 4 (9)
  {
    slug: 'toast',
    name: 'Toast',
    category: 'Feedback',
    phase: 4,
    summary: 'Transient notification stack driven by the useToast() composable.'
  },
  {
    slug: 'alert',
    name: 'Alert',
    category: 'Feedback',
    phase: 4,
    summary: 'Inline contextual banner for info, success, warning, and error messages.'
  },
  {
    slug: 'tooltip',
    name: 'Tooltip',
    category: 'Overlay',
    phase: 4,
    summary: 'Hover and focus-triggered floating hint with configurable placement.',
    a11y: {
      keyboard: ['Focus reveals tooltip', 'Escape dismisses'],
      aria: ['role="tooltip"', 'aria-describedby on trigger']
    }
  },
  {
    slug: 'drawer',
    name: 'Drawer',
    category: 'Overlay',
    phase: 4,
    summary: 'Slide-over side or edge panel for navigation, filters, or detail inspection.',
    a11y: {
      keyboard: ['Escape closes drawer', 'Tab stays trapped while open'],
      aria: ['role="dialog"', 'aria-modal="true"']
    }
  },
  {
    slug: 'popover',
    name: 'Popover',
    category: 'Overlay',
    phase: 4,
    summary: 'Click-triggered floating surface anchored to a trigger element with outside-click and Escape dismissal.',
    a11y: {
      keyboard: ['Escape closes popover', 'Tab moves through interactive popover content'],
      aria: ['aria-expanded and aria-haspopup="dialog" on trigger', 'role="dialog" on floating surface']
    }
  },
  {
    slug: 'skeleton',
    name: 'Skeleton',
    category: 'Feedback',
    phase: 4,
    summary: 'Animated loading placeholder matching text, circle, or card dimensions.'
  },
  {
    slug: 'progress-bar',
    name: 'ProgressBar',
    category: 'Feedback',
    phase: 4,
    summary: 'Linear progress indicator supporting determinate percentage and indeterminate mode.'
  },
  {
    slug: 'progress-spinner',
    name: 'ProgressSpinner',
    category: 'Feedback',
    phase: 4,
    summary: 'Circular loading spinner with configurable size and stroke width.'
  },
  {
    slug: 'confirm-dialog',
    name: 'ConfirmDialog',
    category: 'Overlay',
    phase: 4,
    summary: 'Promise-based confirmation alert dialog triggered via the useConfirm() composable with Escape and backdrop dismissal.',
    a11y: {
      keyboard: ['Escape cancels and closes dialog', 'Tab moves between cancel and confirm actions'],
      aria: ['role="alertdialog"', 'aria-modal="true"', 'aria-labelledby and aria-describedby']
    }
  },
  {
    slug: 'dynamic-dialog',
    name: 'DynamicDialog',
    category: 'Overlay',
    phase: 4,
    status: 'Ready',
    summary: 'Programmatic modal host rendering arbitrary Vue components via useDialog().open().',
    a11y: {
      keyboard: ['Escape closes active dialog', 'Tab cycles focus inside Modal host'],
      aria: ['role="dialog"', 'aria-modal="true"', 'aria-labelledby bound to dialog header']
    }
  },

  // Phase 5 (7)
  {
    slug: 'navbar',
    name: 'Navbar',
    category: 'Navigation',
    phase: 5,
    summary: 'Responsive top navigation bar with brand, links, and right action slots.'
  },
  {
    slug: 'tabs',
    name: 'Tabs',
    category: 'Navigation',
    phase: 5,
    summary: 'Tabbed content switcher with animated active indicator, disabled tab support, and ARIA keyboard navigation.',
    a11y: {
      keyboard: ['ArrowLeft / ArrowRight switch tabs', 'Home / End jump to first/last'],
      aria: ['role="tablist"', 'role="tab"', 'aria-selected and aria-disabled', 'role="tabpanel"']
    }
  },
  {
    slug: 'breadcrumb',
    name: 'Breadcrumb',
    category: 'Navigation',
    phase: 5,
    summary: 'Hierarchical path trail showing current location with clickable ancestors.'
  },
  {
    slug: 'pagination',
    name: 'Pagination',
    category: 'Navigation',
    phase: 5,
    summary: 'Accessible page navigation controls with page size, first/last boundary buttons, and active page state.',
    a11y: {
      keyboard: ['Tab navigates page and boundary buttons', 'Enter / Space activates selected page'],
      aria: ['aria-current="page" on active page', 'Descriptive aria-label on first, previous, page, next, and last buttons']
    }
  },
  {
    slug: 'steps',
    name: 'Steps',
    category: 'Navigation',
    phase: 5,
    summary: 'Multi-step progress stepper with active, completed, and interactive step states for wizards.',
    a11y: {
      keyboard: ['Tab navigates interactive steps', 'Enter / Space activates clickable step'],
      aria: ['aria-label="Progress steps"', 'aria-current="step" on active step']
    }
  },
  {
    slug: 'context-menu',
    name: 'ContextMenu',
    category: 'Navigation',
    phase: 5,
    summary: 'Right-click or trigger-bound contextual action menu with icons, dividers, and keyboard arrow navigation.',
    a11y: {
      keyboard: ['ArrowUp / ArrowDown navigate menu items', 'Enter / Space invokes item', 'Escape closes menu'],
      aria: ['role="menu"', 'role="menuitem"', 'role="separator" on dividers']
    }
  },
  {
    slug: 'scroll-top',
    name: 'ScrollTop',
    category: 'Navigation',
    phase: 5,
    summary: 'Floating button that appears after scrolling to smoothly return to top.'
  },
  {
    slug: 'command-palette',
    name: 'CommandPalette',
    category: 'Navigation',
    phase: 5,
    status: 'Ready',
    summary: 'Global ⌘K / Ctrl+K command modal with grouped actions, keyboard navigation, and remote search.',
    a11y: {
      keyboard: ['⌘K / Ctrl+K toggles palette', 'ArrowUp / ArrowDown navigate commands', 'Enter executes active item', 'Escape closes palette'],
      aria: ['role="dialog" and aria-modal="true"', 'role="listbox", role="group", and role="option" with aria-selected']
    }
  },

  // Phase 6 (3)
  {
    slug: 'data-table',
    name: 'DataTable',
    category: 'Data',
    phase: 6,
    summary: 'Structured table with sorting, search filtering, selection, and pagination.',
    a11y: {
      keyboard: ['Tab navigates sortable headers and controls', 'Enter / Space toggles sort'],
      aria: ['aria-sort on sortable headers', 'aria-selected on selectable rows']
    }
  },
  {
    slug: 'column',
    name: 'Column',
    category: 'Data',
    phase: 6,
    summary: 'Renderless column definition component for declarative DataTable headers and body templates.'
  },
  {
    slug: 'data-view',
    name: 'DataView',
    category: 'Data',
    phase: 6,
    summary: 'Collection presenter switching seamlessly between list and grid layouts.'
  },
  {
    slug: 'tree',
    name: 'Tree',
    category: 'Data',
    phase: 6,
    summary: 'Hierarchical expandable tree view with node selection and custom icons.'
  },
  {
    slug: 'infinite-scroll',
    name: 'InfiniteScroll',
    category: 'Data',
    phase: 6,
    status: 'Ready',
    summary: 'IntersectionObserver sentinel container for incremental batch loading with retryable error and finished states.',
    a11y: {
      keyboard: ['Tab focuses retry button when an error state is displayed'],
      aria: ['role="status" and aria-live="polite" during loading', 'role="alert" for error state', 'aria-hidden="true" on intersection sentinel']
    }
  },

  // Phase 7 (13)
  {
    slug: 'auto-complete',
    name: 'AutoComplete',
    category: 'Forms Advanced',
    phase: 7,
    summary: 'Combobox text input with live local or remote suggestion filtering, keyboard navigation, and custom item templates.',
    a11y: {
      keyboard: ['ArrowUp / ArrowDown navigate suggestions', 'Enter selects active option', 'Escape closes suggestion list'],
      aria: ['role="combobox" with aria-expanded and aria-autocomplete="list"', 'role="listbox" and role="option" with aria-selected', 'role="status" for empty state']
    }
  },
  {
    slug: 'cascader',
    name: 'Cascader',
    category: 'Forms Advanced',
    phase: 7,
    summary: 'Multi-level hierarchical option selector for nested categories.'
  },
  {
    slug: 'tree-select',
    name: 'TreeSelect',
    category: 'Forms Advanced',
    phase: 7,
    summary: 'Dropdown selector presenting hierarchical tree nodes.'
  },
  {
    slug: 'knob',
    name: 'Knob',
    category: 'Forms Advanced',
    phase: 7,
    summary: 'Circular dial input for numeric values with drag and step support.'
  },
  {
    slug: 'select-button',
    name: 'SelectButton',
    category: 'Forms Advanced',
    phase: 7,
    summary: 'Segmented button group for single or multiple option selection.'
  },
  {
    slug: 'toggle-button',
    name: 'ToggleButton',
    category: 'Forms Advanced',
    phase: 7,
    summary: 'Two-state pressable button with active label and icon support.'
  },
  {
    slug: 'input-otp',
    name: 'InputOtp',
    category: 'Forms Advanced',
    phase: 7,
    summary: 'One-time passcode input with auto-advance and paste distribution.'
  },
  {
    slug: 'input-mask',
    name: 'InputMask',
    category: 'Forms Advanced',
    phase: 7,
    summary: 'Formatted input enforcing pattern masks for dates, phones, or codes.'
  },
  {
    slug: 'input-group',
    name: 'InputGroup',
    category: 'Forms Advanced',
    phase: 7,
    summary: 'Composite input container pairing fields with addons, icons, or buttons.'
  },
  {
    slug: 'input-group-addon',
    name: 'InputGroupAddon',
    category: 'Forms Advanced',
    phase: 7,
    summary: 'Prefix or suffix addon slot inside InputGroup for text, icons, or units.'
  },
  {
    slug: 'listbox',
    name: 'Listbox',
    category: 'Forms Advanced',
    phase: 7,
    summary: 'Scrollable list selector supporting single, multiple, and filterable items.'
  },
  {
    slug: 'float-label',
    name: 'FloatLabel',
    category: 'Forms Advanced',
    phase: 7,
    summary: 'Floating label wrapper that animates above the input on focus or value.'
  },
  {
    slug: 'ifta-label',
    name: 'IftaLabel',
    category: 'Forms Advanced',
    phase: 7,
    summary: 'In-field top-aligned label container for compact form density.'
  },
  {
    slug: 'editor',
    name: 'Editor',
    category: 'Forms Advanced',
    phase: 7,
    summary: 'Rich text formatting editor with formatting toolbar, readonly mode, and sanitized HTML output.',
    a11y: {
      keyboard: ['Tab navigates formatting toolbar buttons and editable region', 'Standard rich-text editing shortcuts inside contenteditable'],
      aria: ['role="toolbar" with aria-label="Formatting" and labeled action buttons', 'role="textbox" with aria-multiline="true"']
    }
  },
  {
    slug: 'code-editor',
    name: 'CodeEditor',
    category: 'Forms Advanced',
    phase: 7,
    summary: 'XSS-safe VSCode-style code editor and readonly viewer with line numbers and zero-v-html syntax highlighting.',
    a11y: {
      keyboard: ['Tab inserts indentation inside editor', 'Tab navigates copy button when outside textarea'],
      aria: ['aria-label="Code editor" and aria-invalid on textarea', 'aria-hidden="true" on decorative gutter and syntax overlay', 'aria-label on copy button']
    }
  },
  {
    slug: 'icon-field',
    name: 'IconField',
    category: 'Forms Advanced',
    phase: 7,
    summary: 'Theme-adaptive input wrapper positioning leading and trailing icons around form fields.'
  },
  {
    slug: 'input-icon',
    name: 'InputIcon',
    category: 'Forms Advanced',
    phase: 7,
    summary: 'Positioned icon element rendered inside IconField.'
  },

  // Phase 8 (9)
  {
    slug: 'split-button',
    name: 'SplitButton',
    category: 'Panels & Layout',
    phase: 8,
    summary: 'Primary action button paired with a dropdown menu of secondary actions.'
  },
  {
    slug: 'speed-dial',
    name: 'SpeedDial',
    category: 'Panels & Layout',
    phase: 8,
    summary: 'Floating action button that expands radial or linear quick actions.'
  },
  {
    slug: 'panel',
    name: 'Panel',
    category: 'Panels & Layout',
    phase: 8,
    summary: 'Collapsible content container with header, toggle, and footer slots.'
  },
  {
    slug: 'fieldset',
    name: 'Fieldset',
    category: 'Panels & Layout',
    phase: 8,
    summary: 'Grouped section container with legend title and optional collapse.'
  },
  {
    slug: 'splitter',
    name: 'Splitter',
    category: 'Panels & Layout',
    phase: 8,
    summary: 'Resizable split-pane layout supporting horizontal and vertical panels.'
  },
  {
    slug: 'toolbar',
    name: 'Toolbar',
    category: 'Panels & Layout',
    phase: 8,
    summary: 'Horizontal grouping bar with start, center, and end action slots.'
  },
  {
    slug: 'scroll-panel',
    name: 'ScrollPanel',
    category: 'Panels & Layout',
    phase: 8,
    summary: 'Custom themed scrollable viewport with sleek scrollbar styling.'
  },
  {
    slug: 'fluid',
    name: 'Fluid',
    category: 'Panels & Layout',
    phase: 8,
    summary: 'Full-width layout wrapper stretching nested form controls.'
  },
  {
    slug: 'deferred',
    name: 'Deferred',
    category: 'Panels & Layout',
    phase: 8,
    summary: 'Intersection-aware wrapper deferring render until scrolled into view.'
  },

  // Phase 9 (7)
  {
    slug: 'menu',
    name: 'Menu',
    category: 'Menus',
    phase: 9,
    summary: 'Vertical or popup action menu with grouped items and icons.'
  },
  {
    slug: 'tiered-menu',
    name: 'TieredMenu',
    category: 'Menus',
    phase: 9,
    summary: 'Multi-level nested menu opening submenus on hover or click.'
  },
  {
    slug: 'slide-menu',
    name: 'SlideMenu',
    category: 'Menus',
    phase: 9,
    summary: 'Compact sliding navigation menu with back breadcrumb for submenus.'
  },
  {
    slug: 'panel-menu',
    name: 'PanelMenu',
    category: 'Menus',
    phase: 9,
    summary: 'Accordion-style sidebar navigation menu with expandable sections.'
  },
  {
    slug: 'mega-menu',
    name: 'MegaMenu',
    category: 'Menus',
    phase: 9,
    summary: 'Multi-column dropdown navigation menu for rich site hierarchies.'
  },
  {
    slug: 'dock',
    name: 'Dock',
    category: 'Menus',
    phase: 9,
    summary: 'Interactive launcher dock with hover magnification and edge placement.'
  },
  {
    slug: 'tab-menu',
    name: 'TabMenu',
    category: 'Menus',
    phase: 9,
    summary: 'Horizontal tab strip for route or view navigation.'
  },

  // Phase 10 (7)
  {
    slug: 'order-list',
    name: 'OrderList',
    category: 'Data Advanced',
    phase: 10,
    summary: 'Reorderable item list with move-up, move-down, and boundary controls.'
  },
  {
    slug: 'pick-list',
    name: 'PickList',
    category: 'Data Advanced',
    phase: 10,
    summary: 'Dual-list transfer control for moving items between source and target.'
  },
  {
    slug: 'tree-table',
    name: 'TreeTable',
    category: 'Data Advanced',
    phase: 10,
    summary: 'Tabular data grid with expandable hierarchical rows.'
  },
  {
    slug: 'organization-chart',
    name: 'OrganizationChart',
    category: 'Data Advanced',
    phase: 10,
    summary: 'Visual hierarchy diagram for org charts and reporting trees.'
  },
  {
    slug: 'virtual-scroller',
    name: 'VirtualScroller',
    category: 'Data Advanced',
    phase: 10,
    summary: 'Windowed list renderer for large datasets with smooth scrolling.'
  },
  {
    slug: 'meter-group',
    name: 'MeterGroup',
    category: 'Data Advanced',
    phase: 10,
    summary: 'Segmented multi-value meter bar with legend breakdown.'
  },
  {
    slug: 'inplace',
    name: 'Inplace',
    category: 'Data Advanced',
    phase: 10,
    summary: 'Click-to-edit inline container toggling between display and edit views.'
  },
  {
    slug: 'sortable-list',
    name: 'SortableList',
    category: 'Data Advanced',
    phase: 10,
    status: 'Ready',
    importSymbol: 'SortableList',
    summary: 'Zero-dependency drag-and-drop sortable list with drag handles, cross-list Kanban transfer, and keyboard reordering.',
    a11y: {
      keyboard: [
        'Space toggles grab state on focused item',
        'ArrowUp / ArrowDown (or ArrowLeft / ArrowRight when horizontal) moves grabbed item',
        'Alt+Arrow keys reorder focused item directly without grabbing',
        'Escape cancels active grab'
      ],
      aria: [
        'role="listitem" and aria-roledescription="sortable item" on items',
        'aria-live="polite" region announces grab and move actions'
      ]
    }
  },

  // Phase 11 (11)
  {
    slug: 'confirm-popup',
    name: 'ConfirmPopup',
    category: 'Overlays, Media & Directives',
    phase: 11,
    summary: 'Anchored confirmation alert dialog popover for inline destructive actions via useConfirm().',
    a11y: {
      keyboard: ['Escape cancels and closes popup', 'Tab moves between cancel and confirm buttons'],
      aria: ['role="alertdialog"', 'aria-modal="false"']
    }
  },
  {
    slug: 'inline-message',
    name: 'InlineMessage',
    category: 'Overlays, Media & Directives',
    phase: 11,
    summary: 'Compact inline status message for form fields and validation.'
  },
  {
    slug: 'block-ui',
    name: 'BlockUI',
    category: 'Overlays, Media & Directives',
    phase: 11,
    summary: 'Overlay blocker disabling interaction during async operations.'
  },
  {
    slug: 'galleria',
    name: 'Galleria',
    category: 'Overlays, Media & Directives',
    phase: 11,
    summary: 'Media gallery with main stage, thumbnail strip, and navigation controls.'
  },
  {
    slug: 'file-upload',
    name: 'FileUpload',
    category: 'Overlays, Media & Directives',
    phase: 11,
    summary: 'Drag-and-drop file uploader with keyboard trigger, queue preview, MIME/size validation, and loading state.',
    a11y: {
      keyboard: ['Enter / Space on dropzone opens native file picker', 'Tab navigates dropzone and file remove buttons'],
      aria: ['role="button" and aria-label="Upload files" on dropzone', 'aria-busy and role="status" with aria-live="polite" when loading', 'role="alert" for validation errors']
    }
  },
  {
    slug: 'image-cropper',
    name: 'ImageCropper',
    category: 'Media',
    phase: 10,
    status: 'Ready',
    importSymbol: 'ImageCropper',
    summary: 'Interactive client-side image cropper with pan, zoom, rotation, and circle/rect output before upload.',
    a11y: {
      keyboard: ['Enter / Space on empty dropzone opens file picker', 'Tab navigates zoom, rotation, and crop action controls'],
      aria: ['role="button" and aria-label="Select an image to crop"', 'Descriptive aria-label on zoom and rotate controls', 'role="alert" for error messages']
    }
  },
  {
    slug: 'image-compare',
    name: 'ImageCompare',
    category: 'Media',
    phase: 10,
    status: 'Ready',
    summary: 'Before/after image comparison slider with pointer drag and keyboard range support.'
  },
  {
    slug: 'signature-pad',
    name: 'SignaturePad',
    category: 'Media',
    phase: 10,
    status: 'Ready',
    summary: 'Pointer-driven canvas signature pad exporting PNG/JPEG data URLs, Blobs, and File objects.',
    a11y: {
      keyboard: ['Tab navigates Clear and Save action buttons', 'Enter / Space activates Clear or Save'],
      aria: ['Native button semantics and disabled state on Clear and Save controls']
    }
  },
  {
    slug: 'terminal',
    name: 'Terminal',
    category: 'Overlays, Media & Directives',
    phase: 11,
    summary: 'Interactive command-line shell component with command history.'
  },
  {
    slug: 'chart',
    name: 'Chart',
    category: 'Overlays, Media & Directives',
    phase: 11,
    summary: 'Lightweight SVG bar, line, and donut chart with theme-aware colors.'
  },
  {
    slug: 'v-ripple',
    name: 'v-ripple',
    category: 'Overlays, Media & Directives',
    phase: 11,
    summary: 'Directive adding tactile ink ripple feedback on pointer interaction.'
  },
  {
    slug: 'v-focus-trap',
    name: 'v-focus-trap',
    category: 'Overlays, Media & Directives',
    phase: 11,
    summary: 'Directive confining keyboard Tab and Shift+Tab focus within a modal or active region.',
    a11y: {
      keyboard: ['Tab wraps from last focusable element back to first', 'Shift+Tab wraps from first focusable element to last'],
      aria: ['Preserves native focusable element semantics inside trapped container']
    }
  },
  {
    slug: 'v-animate-on-scroll',
    name: 'v-animate-on-scroll',
    category: 'Overlays, Media & Directives',
    phase: 11,
    importSymbol: 'vAnimateOnScroll',
    summary: 'Zero-CSS IntersectionObserver directive with built-in motion presets (fade-up, fade-down, fade-left, fade-right, zoom-in) and custom class support.',
    a11y: {
      keyboard: ['No keyboard interception; purely visual scroll-reveal behavior'],
      aria: ['Respects prefers-reduced-motion: reduce by skipping enter transforms']
    }
  },
  {
    slug: 'v-style-class',
    name: 'v-style-class',
    category: 'Overlays, Media & Directives',
    phase: 11,
    importSymbol: 'vStyleClass',
    summary: 'Directive toggling CSS classes on target elements upon click.'
  },
  {
    slug: 'v-tooltip',
    name: 'v-tooltip',
    category: 'Overlays, Media & Directives',
    phase: 11,
    importSymbol: 'vTooltip',
    summary: 'Directive attaching hover and focus-triggered floating tooltips with top, right, bottom, or left placement modifiers.',
    a11y: {
      keyboard: ['Focusin reveals tooltip on focusable triggers', 'Focusout hides tooltip'],
      aria: ['role="tooltip" on dynamically mounted floating element']
    }
  },
  {
    slug: 'portal',
    name: 'Portal',
    category: 'Overlays, Media & Directives',
    phase: 11,
    status: 'Ready',
    summary: 'Declarative Teleport wrapper rendering slot content into a target DOM container.'
  },
  {
    slug: 'v-badge',
    name: 'vBadge',
    category: 'Overlays, Media & Directives',
    phase: 11,
    status: 'Ready',
    importSymbol: 'vBadge',
    summary: 'Directive attaching a compact themed corner badge directly onto any element.'
  },
  {
    slug: 'v-keyfilter',
    name: 'vKeyFilter',
    category: 'Overlays, Media & Directives',
    phase: 11,
    status: 'Ready',
    importSymbol: 'vKeyFilter',
    summary: 'Directive restricting keyboard and paste input to preset character classes or custom RegExp.'
  },
  {
    slug: 'page-transition',
    name: 'PageTransition',
    category: 'Overlays, Media & Directives',
    phase: 11,
    status: 'Ready',
    importSymbol: 'PageTransition',
    summary: 'Theme-aware route and view transition wrapper supporting slide-up, fade, slide-left, and scale presets.'
  },
  {
    slug: 'use-page-progress',
    name: 'usePageProgress',
    category: 'Overlays, Media & Directives',
    phase: 11,
    status: 'Ready',
    importSymbol: 'usePageProgress',
    summary: 'Top-edge NProgress-style route and async loading bar composable with automatic Vue Router integration.'
  }
]

export function getComponentBySlug(slug: string): ComponentNavItem {
  return COMPONENT_NAV.find((item) => item.slug === slug) ?? COMPONENT_NAV[0]
}
