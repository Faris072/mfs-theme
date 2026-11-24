import type { App, Component, Directive, Plugin } from 'vue'
// Fase 1
import Button from './components/Button.vue'
import ButtonGroup from './components/ButtonGroup.vue'
import Card from './components/Card.vue'
import Input from './components/Input.vue'
import Badge from './components/Badge.vue'
import Switch from './components/Switch.vue'
import Modal from './components/Modal.vue'
// Fase 2
import Textarea from './components/Textarea.vue'
import InputNumber from './components/InputNumber.vue'
import Password from './components/Password.vue'
import Checkbox from './components/Checkbox.vue'
import RadioButton from './components/RadioButton.vue'
import Select from './components/Select.vue'
import MultiSelect from './components/MultiSelect.vue'
import Slider from './components/Slider.vue'
import Rating from './components/Rating.vue'
import ColorPicker from './components/ColorPicker.vue'
import DatePicker from './components/DatePicker.vue'
// Fase 3
import Avatar from './components/Avatar.vue'
import Chip from './components/Chip.vue'
import Divider from './components/Divider.vue'
import Accordion from './components/Accordion.vue'
import Timeline from './components/Timeline.vue'
import Carousel from './components/Carousel.vue'
import Image from './components/Image.vue'
// Fase 4
import Toast from './components/Toast.vue'
import Alert from './components/Alert.vue'
import Tooltip from './components/Tooltip.vue'
import Drawer from './components/Drawer.vue'
import Popover from './components/Popover.vue'
import Skeleton from './components/Skeleton.vue'
import ProgressBar from './components/ProgressBar.vue'
import ProgressSpinner from './components/ProgressSpinner.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'
// Fase 5
import Navbar from './components/Navbar.vue'
import Tabs from './components/Tabs.vue'
import Breadcrumb from './components/Breadcrumb.vue'
import Pagination from './components/Pagination.vue'
import Steps from './components/Steps.vue'
import ContextMenu from './components/ContextMenu.vue'
import ScrollTop from './components/ScrollTop.vue'
// Fase 6
import DataTable from './components/DataTable.vue'
import Column from './components/Column.vue'
import DataView from './components/DataView.vue'
import Tree from './components/Tree.vue'
// Fase 7
import AutoComplete from './components/AutoComplete.vue'
import Cascader from './components/Cascader.vue'
import TreeSelect from './components/TreeSelect.vue'
import Knob from './components/Knob.vue'
import SelectButton from './components/SelectButton.vue'
import ToggleButton from './components/ToggleButton.vue'
import InputOtp from './components/InputOtp.vue'
import InputMask from './components/InputMask.vue'
import InputGroup from './components/InputGroup.vue'
import InputGroupAddon from './components/InputGroupAddon.vue'
import IconField from './components/IconField.vue'
import InputIcon from './components/InputIcon.vue'
import Listbox from './components/Listbox.vue'
import FloatLabel from './components/FloatLabel.vue'
import IftaLabel from './components/IftaLabel.vue'
import Editor from './components/Editor.vue'
// Fase 8
import SplitButton from './components/SplitButton.vue'
import SpeedDial from './components/SpeedDial.vue'
import Panel from './components/Panel.vue'
import Fieldset from './components/Fieldset.vue'
import Splitter from './components/Splitter.vue'
import Toolbar from './components/Toolbar.vue'
import ScrollPanel from './components/ScrollPanel.vue'
import Fluid from './components/Fluid.vue'
import Deferred from './components/Deferred.vue'
// Fase 9
import Menu from './components/Menu.vue'
import TieredMenu from './components/TieredMenu.vue'
import SlideMenu from './components/SlideMenu.vue'
import PanelMenu from './components/PanelMenu.vue'
import MegaMenu from './components/MegaMenu.vue'
import Dock from './components/Dock.vue'
import TabMenu from './components/TabMenu.vue'
// Fase 10
import OrderList from './components/OrderList.vue'
import PickList from './components/PickList.vue'
import TreeTable from './components/TreeTable.vue'
import OrganizationChart from './components/OrganizationChart.vue'
import VirtualScroller from './components/VirtualScroller.vue'
import MeterGroup from './components/MeterGroup.vue'
import Inplace from './components/Inplace.vue'
// Fase 11
import ConfirmPopup from './components/ConfirmPopup.vue'
import InlineMessage from './components/InlineMessage.vue'
import BlockUI from './components/BlockUI.vue'
import Galleria from './components/Galleria.vue'
import FileUpload from './components/FileUpload.vue'
import Terminal from './components/Terminal.vue'
import Chart from './components/Chart.vue'
import ImageCropper, { type ImageCropResult } from './components/ImageCropper.vue'
// Fase 12
import AvatarGroup from './components/AvatarGroup.vue'
import OverlayBadge from './components/OverlayBadge.vue'
import ImageCompare from './components/ImageCompare.vue'
import Portal from './components/Portal.vue'
import Chips from './components/Chips.vue'
import CheckboxGroup from './components/CheckboxGroup.vue'
import RadioButtonGroup from './components/RadioButtonGroup.vue'
import DynamicDialog from './components/DynamicDialog.vue'
// Fase 13
import CommandPalette, { type CommandItem } from './components/CommandPalette.vue'
import InfiniteScroll from './components/InfiniteScroll.vue'
import Mentions, { type MentionOption } from './components/Mentions.vue'
import SignaturePad, { type SignatureExportPayload } from './components/SignaturePad.vue'
import Form, { type MfsFormSubmitPayload, type MfsFormContext } from './components/Form.vue'
import FormField from './components/FormField.vue'

import { useTheme, type ThemeType, THEME_OPTIONS } from './composables/useTheme'
import { useToast } from './composables/useToast'
import { useConfirm } from './composables/useConfirm'
import { useDialog } from './composables/useDialog'
import { useStyle } from './composables/useStyle'
import { vRipple } from './directives/ripple'
import { vTooltip } from './directives/tooltip'
import { vFocusTrap } from './directives/focusTrap'
import { vAnimateOnScroll } from './directives/animateOnScroll'
import { vStyleClass } from './directives/styleClass'
import { vBadge, BadgeDirective } from './directives/badgeDirective'
import { vKeyFilter, KeyFilter } from './directives/keyFilter'
import './themes/index.css'

export {
  Button,
  ButtonGroup,
  Card,
  Input,
  Input as InputText,
  Badge,
  Switch,
  Switch as ToggleSwitch,
  Switch as InputSwitch,
  Modal,
  Modal as Dialog,
  Textarea,
  InputNumber,
  Password,
  Checkbox,
  RadioButton,
  Select,
  Select as Dropdown,
  MultiSelect,
  Slider,
  Rating,
  ColorPicker,
  DatePicker,
  DatePicker as Calendar,
  Avatar,
  Chip,
  Chip as Tag,
  Divider,
  Accordion,
  Timeline,
  Carousel,
  Image,
  Toast,
  Alert,
  Alert as Message,
  Tooltip,
  Drawer,
  Drawer as Sidebar,
  Popover,
  Popover as OverlayPanel,
  Skeleton,
  ProgressBar,
  ProgressSpinner,
  ConfirmDialog,
  Navbar,
  Navbar as Menubar,
  Tabs,
  Tabs as TabView,
  Breadcrumb,
  Pagination,
  Pagination as Paginator,
  Steps,
  Steps as Stepper,
  ContextMenu,
  ScrollTop,
  DataTable,
  Column,
  DataView,
  Tree,
  AutoComplete,
  Cascader,
  Cascader as CascadeSelect,
  TreeSelect,
  Knob,
  SelectButton,
  ToggleButton,
  InputOtp,
  InputMask,
  InputGroup,
  InputGroupAddon,
  IconField,
  InputIcon,
  Listbox,
  FloatLabel,
  IftaLabel,
  Editor,
  SplitButton,
  SpeedDial,
  Panel,
  Fieldset,
  Splitter,
  Toolbar,
  ScrollPanel,
  Fluid,
  Deferred,
  Deferred as DeferredContent,
  Menu,
  TieredMenu,
  SlideMenu,
  PanelMenu,
  MegaMenu,
  Dock,
  TabMenu,
  OrderList,
  PickList,
  TreeTable,
  OrganizationChart,
  VirtualScroller,
  MeterGroup,
  Inplace,
  ConfirmPopup,
  InlineMessage,
  BlockUI,
  Galleria,
  FileUpload,
  Terminal,
  Chart,
  ImageCropper,
  type ImageCropResult,
  AvatarGroup,
  OverlayBadge,
  ImageCompare,
  Portal,
  Chips,
  Chips as InputChips,
  CheckboxGroup,
  RadioButtonGroup,
  DynamicDialog,
  CommandPalette,
  type CommandItem,
  InfiniteScroll,
  Mentions,
  type MentionOption,
  SignaturePad,
  type SignatureExportPayload,
  Form,
  type MfsFormSubmitPayload,
  type MfsFormContext,
  FormField,
  useTheme,
  useToast,
  useConfirm,
  useDialog,
  useStyle,
  vRipple,
  vTooltip,
  vTooltip as TooltipDirective,
  vFocusTrap,
  vAnimateOnScroll,
  vStyleClass,
  vBadge,
  BadgeDirective,
  vKeyFilter,
  KeyFilter,
  THEME_OPTIONS,
  type ThemeType
}

const components: Record<string, Component> = {
  Button,
  ButtonGroup,
  Card,
  Input,
  InputText: Input,
  Badge,
  Switch,
  ToggleSwitch: Switch,
  InputSwitch: Switch,
  Modal,
  Dialog: Modal,
  Textarea,
  InputNumber,
  Password,
  Checkbox,
  RadioButton,
  Select,
  Dropdown: Select,
  MultiSelect,
  Slider,
  Rating,
  ColorPicker,
  DatePicker,
  Calendar: DatePicker,
  Avatar,
  Chip,
  Tag: Chip,
  Divider,
  Accordion,
  Timeline,
  Carousel,
  Image,
  Toast,
  Alert,
  Message: Alert,
  Tooltip,
  Drawer,
  Sidebar: Drawer,
  Popover,
  OverlayPanel: Popover,
  Skeleton,
  ProgressBar,
  ProgressSpinner,
  ConfirmDialog,
  Navbar,
  Menubar: Navbar,
  Tabs,
  TabView: Tabs,
  Breadcrumb,
  Pagination,
  Paginator: Pagination,
  Steps,
  Stepper: Steps,
  ContextMenu,
  ScrollTop,
  DataTable,
  Column,
  DataView,
  Tree,
  AutoComplete,
  Cascader,
  CascadeSelect: Cascader,
  TreeSelect,
  Knob,
  SelectButton,
  ToggleButton,
  InputOtp,
  InputMask,
  InputGroup,
  InputGroupAddon,
  IconField,
  InputIcon,
  Listbox,
  FloatLabel,
  IftaLabel,
  Editor,
  SplitButton,
  SpeedDial,
  Panel,
  Fieldset,
  Splitter,
  Toolbar,
  ScrollPanel,
  Fluid,
  Deferred,
  DeferredContent: Deferred,
  Menu,
  TieredMenu,
  SlideMenu,
  PanelMenu,
  MegaMenu,
  Dock,
  TabMenu,
  OrderList,
  PickList,
  TreeTable,
  OrganizationChart,
  VirtualScroller,
  MeterGroup,
  Inplace,
  ConfirmPopup,
  InlineMessage,
  BlockUI,
  Galleria,
  FileUpload,
  Terminal,
  Chart,
  ImageCropper,
  AvatarGroup,
  OverlayBadge,
  ImageCompare,
  Portal,
  Chips,
  InputChips: Chips,
  CheckboxGroup,
  RadioButtonGroup,
  DynamicDialog,
  CommandPalette,
  InfiniteScroll,
  Mentions,
  SignaturePad,
  Form,
  FormField
}

const directives: Record<string, Directive> = {
  ripple: vRipple,
  tooltip: vTooltip,
  focustrap: vFocusTrap,
  animateonscroll: vAnimateOnScroll,
  styleclass: vStyleClass,
  badge: vBadge,
  keyfilter: vKeyFilter
}

export interface ThemePluginOptions {
  defaultTheme?: ThemeType
}

const ThemePlugin: Plugin = {
  install(app: App, options: ThemePluginOptions = {}) {
    for (const [name, component] of Object.entries(components)) {
      app.component(name, component)
    }

    for (const [name, directive] of Object.entries(directives)) {
      app.directive(name, directive)
    }

    if (typeof window !== 'undefined') {
      const { initTheme } = useTheme()
      initTheme(options.defaultTheme || 'clay')
    }
  }
}

export default ThemePlugin
