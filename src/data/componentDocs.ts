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
    summary: 'Adaptive action button with variants, sizes, loading state, and tactile depth.'
  },
  {
    slug: 'input',
    name: 'Input',
    category: 'Form',
    phase: 1,
    summary: 'Single-line text input with label, helper text, error state, and theme-aware depth.'
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
    slug: 'switch',
    name: 'Switch',
    category: 'Form',
    phase: 1,
    summary: 'Accessible boolean toggle switch with keyboard support and smooth thumb motion.'
  },
  {
    slug: 'modal',
    name: 'Modal',
    category: 'Overlay',
    phase: 1,
    summary: 'Focus-managed dialog overlay with backdrop blur, ESC close, and action slots.'
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
    summary: 'Binary or array-bound checkbox with indeterminate state and tactile check mark.'
  },
  {
    slug: 'radio-button',
    name: 'RadioButton',
    category: 'Form',
    phase: 2,
    summary: 'Mutually exclusive radio option with accessible group semantics.'
  },
  {
    slug: 'select',
    name: 'Select',
    category: 'Form',
    phase: 2,
    summary: 'Searchable single-select dropdown with keyboard navigation and clearable option.'
  },
  {
    slug: 'multi-select',
    name: 'MultiSelect',
    category: 'Form',
    phase: 2,
    summary: 'Multi-value dropdown selector displaying chosen items as removable chips.'
  },
  {
    slug: 'slider',
    name: 'Slider',
    category: 'Form',
    phase: 2,
    summary: 'Continuous or stepped range slider supporting single value or dual-thumb range.'
  },
  {
    slug: 'rating',
    name: 'Rating',
    category: 'Form',
    phase: 2,
    summary: 'Interactive star rating input with readonly display and clearable selection.'
  },
  {
    slug: 'color-picker',
    name: 'ColorPicker',
    category: 'Form',
    phase: 2,
    summary: 'Color swatch and hex picker with preset palette and live preview.'
  },
  {
    slug: 'date-picker',
    name: 'DatePicker',
    category: 'Form',
    phase: 2,
    summary: 'Calendar popover date selector with min/max constraints and formatted output.'
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
    summary: 'Collapsible content panels supporting single or multiple expanded sections.'
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
    summary: 'Hover and focus-triggered floating hint with configurable placement.'
  },
  {
    slug: 'drawer',
    name: 'Drawer',
    category: 'Overlay',
    phase: 4,
    summary: 'Slide-over side or edge panel for navigation, filters, or detail inspection.'
  },
  {
    slug: 'popover',
    name: 'Popover',
    category: 'Overlay',
    phase: 4,
    summary: 'Click-triggered floating surface anchored to a trigger element.'
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
    summary: 'Promise-based confirmation modal triggered via the useConfirm() composable.'
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
    summary: 'Tabbed content switcher with keyboard arrow support and active indicator.'
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
    summary: 'Page navigation controls with page size, boundary buttons, and active state.'
  },
  {
    slug: 'steps',
    name: 'Steps',
    category: 'Navigation',
    phase: 5,
    summary: 'Multi-step progress stepper for wizards and sequential workflows.'
  },
  {
    slug: 'context-menu',
    name: 'ContextMenu',
    category: 'Navigation',
    phase: 5,
    summary: 'Right-click or trigger-bound contextual action menu with keyboard navigation.'
  },
  {
    slug: 'scroll-top',
    name: 'ScrollTop',
    category: 'Navigation',
    phase: 5,
    summary: 'Floating button that appears after scrolling to smoothly return to top.'
  },

  // Phase 6 (3)
  {
    slug: 'data-table',
    name: 'DataTable',
    category: 'Data',
    phase: 6,
    summary: 'Structured table with sorting, search filtering, selection, and pagination.'
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

  // Phase 7 (13)
  {
    slug: 'auto-complete',
    name: 'AutoComplete',
    category: 'Forms Advanced',
    phase: 7,
    summary: 'Text input with live suggestion filtering and keyboard selection.'
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
    summary: 'Rich text formatting editor with toolbar controls and HTML output.'
  },
  {
    slug: 'icon-field',
    name: 'IconField',
    category: 'Forms Advanced',
    phase: 7,
    summary: 'Wrapper input dengan posisi ikon kiri/kanan adaptif tema.'
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

  // Phase 11 (11)
  {
    slug: 'confirm-popup',
    name: 'ConfirmPopup',
    category: 'Overlays, Media & Directives',
    phase: 11,
    summary: 'Anchored confirmation popover for inline destructive actions.'
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
    summary: 'Drag-and-drop file uploader with queue preview and size validation.'
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
    summary: 'Directive confining keyboard Tab focus within a modal or region.'
  },
  {
    slug: 'v-animate-on-scroll',
    name: 'v-animate-on-scroll',
    category: 'Overlays, Media & Directives',
    phase: 11,
    summary: 'Directive applying enter/leave animation classes on viewport intersection.'
  },
  {
    slug: 'v-style-class',
    name: 'v-style-class',
    category: 'Overlays, Media & Directives',
    phase: 11,
    summary: 'Directive toggling CSS classes on target elements upon click.'
  }
]

export function getComponentBySlug(slug: string): ComponentNavItem {
  return COMPONENT_NAV.find((item) => item.slug === slug) ?? COMPONENT_NAV[0]
}
