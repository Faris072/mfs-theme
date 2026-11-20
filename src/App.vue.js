import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Palette, Menu, X, Layers, Sparkles, Circle, Minus, Square, LayoutGrid, Zap, Monitor, Grid, Box, ArrowRight } from 'lucide-vue-next';
import { useTheme, Toast, ConfirmDialog } from './lib';
const route = useRoute();
const router = useRouter();
const { currentTheme, themeOptions, setTheme } = useTheme();
const isLanding = computed(() => route.path === '/');
const mobileMenuOpen = ref(false);
const iconMap = {
    clay: Layers,
    glass: Sparkles,
    neo: Circle,
    minimalism: Minus,
    brutalism: Square,
    bento: LayoutGrid,
    cyberpunk: Zap,
    retro: Monitor,
    swiss: Grid,
    skeuomorphism: Box
};
const getThemeIcon = (id) => iconMap[id] ?? Layers;
const handleSelectTheme = (themeId) => {
    setTheme(themeId);
    if (route.path.startsWith('/themes/')) {
        router.push(`/themes/${themeId}`);
    }
};
const onThemeSelect = (e) => {
    const val = e.target.value;
    if (val)
        handleSelectTheme(val);
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "app" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
    ...{ class: "navbar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "navbar__container" },
});
const __VLS_0 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    to: "/",
    ...{ class: "navbar__brand" },
}));
const __VLS_2 = __VLS_1({
    to: "/",
    ...{ class: "navbar__brand" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "brand-logo" },
});
const __VLS_4 = {}.Palette;
/** @type {[typeof __VLS_components.Palette, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    size: (20),
    ...{ class: "brand-icon" },
}));
const __VLS_6 = __VLS_5({
    size: (20),
    ...{ class: "brand-icon" },
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "brand-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "brand-badge" },
});
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "navbar__actions" },
});
if (__VLS_ctx.isLanding) {
    const __VLS_8 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        to: "/components",
        ...{ class: "nav-simple-link" },
    }));
    const __VLS_10 = __VLS_9({
        to: "/components",
        ...{ class: "nav-simple-link" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    __VLS_11.slots.default;
    var __VLS_11;
    const __VLS_12 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        to: "/catalog",
        ...{ class: "nav-cta-btn" },
    }));
    const __VLS_14 = __VLS_13({
        to: "/catalog",
        ...{ class: "nav-cta-btn" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    __VLS_15.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    const __VLS_16 = {}.ArrowRight;
    /** @type {[typeof __VLS_components.ArrowRight, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        size: (15),
    }));
    const __VLS_18 = __VLS_17({
        size: (15),
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    var __VLS_15;
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.nav, __VLS_intrinsicElements.nav)({
        ...{ class: "nav-links" },
        'aria-label': "Main Navigation",
    });
    const __VLS_20 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        to: "/catalog",
        ...{ class: "nav-tab" },
        ...{ class: ({ 'is-active': __VLS_ctx.route.path === '/catalog' || __VLS_ctx.route.path.startsWith('/themes') }) },
    }));
    const __VLS_22 = __VLS_21({
        to: "/catalog",
        ...{ class: "nav-tab" },
        ...{ class: ({ 'is-active': __VLS_ctx.route.path === '/catalog' || __VLS_ctx.route.path.startsWith('/themes') }) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    __VLS_23.slots.default;
    var __VLS_23;
    const __VLS_24 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        to: "/components",
        ...{ class: "nav-tab" },
        ...{ class: ({ 'is-active': __VLS_ctx.route.path.startsWith('/components') }) },
    }));
    const __VLS_26 = __VLS_25({
        to: "/components",
        ...{ class: "nav-tab" },
        ...{ class: ({ 'is-active': __VLS_ctx.route.path.startsWith('/components') }) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    __VLS_27.slots.default;
    var __VLS_27;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "theme-selector-bar" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        for: "navbar-theme-select",
        ...{ class: "theme-selector-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)({
        ...{ onChange: (__VLS_ctx.onThemeSelect) },
        id: "navbar-theme-select",
        ...{ class: "theme-select" },
        value: (__VLS_ctx.currentTheme),
        'aria-label': "Select active theme",
    });
    for (const [item] of __VLS_getVForSourceType((__VLS_ctx.themeOptions))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
            key: (item.id),
            value: (item.id),
        });
        (item.name);
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
    href: "https://www.npmjs.com/package/mfs-theme",
    target: "_blank",
    ...{ class: "npm-link" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.mobileMenuOpen = !__VLS_ctx.mobileMenuOpen;
        } },
    ...{ class: "mobile-menu-btn" },
    'aria-label': "Toggle navigation",
});
if (!__VLS_ctx.mobileMenuOpen) {
    const __VLS_28 = {}.Menu;
    /** @type {[typeof __VLS_components.Menu, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        size: (20),
    }));
    const __VLS_30 = __VLS_29({
        size: (20),
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
}
else {
    const __VLS_32 = {}.X;
    /** @type {[typeof __VLS_components.X, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        size: (20),
    }));
    const __VLS_34 = __VLS_33({
        size: (20),
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
}
if (__VLS_ctx.mobileMenuOpen) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mobile-drawer" },
    });
    if (__VLS_ctx.isLanding) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "mobile-nav-row" },
        });
        const __VLS_36 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
        // @ts-ignore
        const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
            ...{ 'onClick': {} },
            to: "/components",
            ...{ class: "nav-tab mobile-outline-tab" },
        }));
        const __VLS_38 = __VLS_37({
            ...{ 'onClick': {} },
            to: "/components",
            ...{ class: "nav-tab mobile-outline-tab" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_37));
        let __VLS_40;
        let __VLS_41;
        let __VLS_42;
        const __VLS_43 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.mobileMenuOpen))
                    return;
                if (!(__VLS_ctx.isLanding))
                    return;
                __VLS_ctx.mobileMenuOpen = false;
            }
        };
        __VLS_39.slots.default;
        var __VLS_39;
        const __VLS_44 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
        // @ts-ignore
        const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
            ...{ 'onClick': {} },
            to: "/catalog",
            ...{ class: "nav-cta-btn mobile-cta-fill" },
        }));
        const __VLS_46 = __VLS_45({
            ...{ 'onClick': {} },
            to: "/catalog",
            ...{ class: "nav-cta-btn mobile-cta-fill" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_45));
        let __VLS_48;
        let __VLS_49;
        let __VLS_50;
        const __VLS_51 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.mobileMenuOpen))
                    return;
                if (!(__VLS_ctx.isLanding))
                    return;
                __VLS_ctx.mobileMenuOpen = false;
            }
        };
        __VLS_47.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        const __VLS_52 = {}.ArrowRight;
        /** @type {[typeof __VLS_components.ArrowRight, ]} */ ;
        // @ts-ignore
        const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
            size: (15),
        }));
        const __VLS_54 = __VLS_53({
            size: (15),
        }, ...__VLS_functionalComponentArgsRest(__VLS_53));
        var __VLS_47;
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "mobile-nav-row" },
        });
        const __VLS_56 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
        // @ts-ignore
        const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
            ...{ 'onClick': {} },
            to: "/catalog",
            ...{ class: "nav-tab" },
            ...{ class: ({ 'is-active': __VLS_ctx.route.path === '/catalog' || __VLS_ctx.route.path.startsWith('/themes') }) },
        }));
        const __VLS_58 = __VLS_57({
            ...{ 'onClick': {} },
            to: "/catalog",
            ...{ class: "nav-tab" },
            ...{ class: ({ 'is-active': __VLS_ctx.route.path === '/catalog' || __VLS_ctx.route.path.startsWith('/themes') }) },
        }, ...__VLS_functionalComponentArgsRest(__VLS_57));
        let __VLS_60;
        let __VLS_61;
        let __VLS_62;
        const __VLS_63 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.mobileMenuOpen))
                    return;
                if (!!(__VLS_ctx.isLanding))
                    return;
                __VLS_ctx.mobileMenuOpen = false;
            }
        };
        __VLS_59.slots.default;
        var __VLS_59;
        const __VLS_64 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
        // @ts-ignore
        const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
            ...{ 'onClick': {} },
            to: "/components",
            ...{ class: "nav-tab" },
            ...{ class: ({ 'is-active': __VLS_ctx.route.path.startsWith('/components') }) },
        }));
        const __VLS_66 = __VLS_65({
            ...{ 'onClick': {} },
            to: "/components",
            ...{ class: "nav-tab" },
            ...{ class: ({ 'is-active': __VLS_ctx.route.path.startsWith('/components') }) },
        }, ...__VLS_functionalComponentArgsRest(__VLS_65));
        let __VLS_68;
        let __VLS_69;
        let __VLS_70;
        const __VLS_71 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.mobileMenuOpen))
                    return;
                if (!!(__VLS_ctx.isLanding))
                    return;
                __VLS_ctx.mobileMenuOpen = false;
            }
        };
        __VLS_67.slots.default;
        var __VLS_67;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "drawer-label" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "mobile-theme-grid" },
        });
        for (const [item] of __VLS_getVForSourceType((__VLS_ctx.themeOptions))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                ...{ onClick: (...[$event]) => {
                        if (!(__VLS_ctx.mobileMenuOpen))
                            return;
                        if (!!(__VLS_ctx.isLanding))
                            return;
                        __VLS_ctx.handleSelectTheme(item.id);
                        __VLS_ctx.mobileMenuOpen = false;
                    } },
                key: (item.id),
                type: "button",
                ...{ class: "mobile-theme-chip" },
                ...{ class: ({ 'is-active': __VLS_ctx.currentTheme === item.id }) },
            });
            const __VLS_72 = ((__VLS_ctx.getThemeIcon(item.id)));
            // @ts-ignore
            const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
                size: (15),
                ...{ class: "theme-pill-icon" },
            }));
            const __VLS_74 = __VLS_73({
                size: (15),
                ...{ class: "theme-pill-icon" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_73));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (item.name);
        }
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({
    ...{ class: "app-main-content" },
});
const __VLS_76 = {}.RouterView;
/** @type {[typeof __VLS_components.RouterView, typeof __VLS_components.routerView, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({}));
const __VLS_78 = __VLS_77({}, ...__VLS_functionalComponentArgsRest(__VLS_77));
const __VLS_80 = {}.Toast;
/** @type {[typeof __VLS_components.Toast, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({}));
const __VLS_82 = __VLS_81({}, ...__VLS_functionalComponentArgsRest(__VLS_81));
const __VLS_84 = {}.ConfirmDialog;
/** @type {[typeof __VLS_components.ConfirmDialog, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({}));
const __VLS_86 = __VLS_85({}, ...__VLS_functionalComponentArgsRest(__VLS_85));
__VLS_asFunctionalElement(__VLS_intrinsicElements.footer, __VLS_intrinsicElements.footer)({
    ...{ class: "footer" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "footer__container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "footer-sub" },
});
/** @type {__VLS_StyleScopedClasses['app']} */ ;
/** @type {__VLS_StyleScopedClasses['navbar']} */ ;
/** @type {__VLS_StyleScopedClasses['navbar__container']} */ ;
/** @type {__VLS_StyleScopedClasses['navbar__brand']} */ ;
/** @type {__VLS_StyleScopedClasses['brand-logo']} */ ;
/** @type {__VLS_StyleScopedClasses['brand-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['brand-title']} */ ;
/** @type {__VLS_StyleScopedClasses['brand-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['navbar__actions']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-simple-link']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-cta-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-links']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-tab']} */ ;
/** @type {__VLS_StyleScopedClasses['is-active']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-tab']} */ ;
/** @type {__VLS_StyleScopedClasses['is-active']} */ ;
/** @type {__VLS_StyleScopedClasses['theme-selector-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['theme-selector-label']} */ ;
/** @type {__VLS_StyleScopedClasses['theme-select']} */ ;
/** @type {__VLS_StyleScopedClasses['npm-link']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-menu-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-drawer']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-nav-row']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-tab']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-outline-tab']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-cta-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-cta-fill']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-nav-row']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-tab']} */ ;
/** @type {__VLS_StyleScopedClasses['is-active']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-tab']} */ ;
/** @type {__VLS_StyleScopedClasses['is-active']} */ ;
/** @type {__VLS_StyleScopedClasses['drawer-label']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-theme-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-theme-chip']} */ ;
/** @type {__VLS_StyleScopedClasses['is-active']} */ ;
/** @type {__VLS_StyleScopedClasses['theme-pill-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['app-main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['footer']} */ ;
/** @type {__VLS_StyleScopedClasses['footer__container']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-sub']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Palette: Palette,
            Menu: Menu,
            X: X,
            ArrowRight: ArrowRight,
            Toast: Toast,
            ConfirmDialog: ConfirmDialog,
            route: route,
            currentTheme: currentTheme,
            themeOptions: themeOptions,
            isLanding: isLanding,
            mobileMenuOpen: mobileMenuOpen,
            getThemeIcon: getThemeIcon,
            handleSelectTheme: handleSelectTheme,
            onThemeSelect: onThemeSelect,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
