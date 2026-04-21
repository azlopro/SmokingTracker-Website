# Astro Cleanup Notes

This file tracks what is currently weak in the Astro site and what can be improved next.

## Already improved

- `src/pages/for-individuals.astro`
  - Rebalanced the page toward larger mobile-facing app visuals.
  - Removed some oversized one-off inline sizing in favor of reusable classes.
  - Switched the page to a proper dark nav/body setup instead of depending on the light theme.

- `src/layouts/BaseLayout.astro`
- `src/components/SiteNav.astro`
  - Added explicit nav theme support so pages can choose light or dark nav intentionally.

- `src/pages/for-individuals.astro`
- `src/pages/for-clinicians.astro`
  - Disabled `hideUntilLoad` on the two audience pages.
  - Hiding the whole document until `window.load` is not a good default in Astro.

- `public/main.js`
  - Kept Apollo tracking.
  - Refactored the shared script into safer guarded initializers.
  - Reduced legacy assumptions that every page has the same DOM.

## What is still wrong

### Concrete findings from this audit

- `src/layouts/MinimalLayout.astro`
  - Still hides the entire document with `html{visibility:hidden}` until `window.load`.
  - Current users:
    - `src/pages/index.astro`
    - `src/pages/getting-started-guide.astro`
  - This is the same legacy pattern already removed from the audience pages and should likely be removed here too after verification.

- Old `.navbar` path is close to legacy-only now.
  - Search findings show current references mainly in:
    - `public/style.css`
    - `public/trial.js`
    - `public/individual-signup.js`
    - compatibility checks inside `public/main.js`
  - There do not appear to be active Astro components still rendering a `.navbar` class.
  - This suggests the project is close to being able to retire old navbar styling, but it should be verified carefully first.

- Form scripts still duplicate common logic.
  - `public/trial.js`
  - `public/cud-application.js`
  - `public/individual-signup.js`
  - Common repeated patterns:
    - `getNestedValue`
    - translation application
    - submit button loading state
    - error/success toggling
    - `DOMContentLoaded` bootstrapping

- `includeMainJs={true}` is still fairly broad.
  - Current users include:
    - `src/pages/dpa.astro`
    - `src/pages/privacy.astro`
    - `src/pages/terms.astro`
    - `src/pages/security.astro`
    - `src/pages/features.astro`
    - `src/pages/knowledge-base.astro`
    - `src/pages/pricing.astro`
    - `src/pages/faq.astro`
    - `src/pages/resources.astro`
    - `src/pages/for-individuals.astro`
    - `src/pages/for-clinicians.astro`
    - `src/pages/trial.astro`
  - Some of these likely need only nav behavior and footer translation, while others need more.
  - This should be narrowed over time instead of remaining the default shared behavior bucket.

### 1. Too much page-local CSS inside `.astro` pages

Large amounts of styling still live inside individual pages:

- `src/pages/for-individuals.astro`
- `src/pages/for-clinicians.astro`
- several feature pages

Problems:

- hard to reuse
- hard to maintain visual consistency
- easy to create one-off spacing/type rules
- makes pages much larger than necessary

Better:

- move repeated patterns into shared CSS or component-scoped styles
- create reusable section classes for hero, showcase, pricing, CTA, cards, and feature grids

### 2. Too many inline styles in markup

There are still many inline `style="..."` attributes across the site, especially in marketing pages.

Problems:

- difficult to search and standardize
- weak separation between structure and presentation
- encourages accidental design drift

Better:

- replace repeated inline styles with semantic classes
- keep inline styles only for truly page-specific one-off values

### 3. Shared JS is still more global than it should be

File:

- `public/main.js`

Current state is better than before, but it is still a global script loaded by many pages.

Problems:

- page behavior is not colocated with the page/component that needs it
- harder to reason about what code runs where
- can grow into another legacy bucket over time

Better:

- keep only truly global behavior in `public/main.js`
- move page-specific interactivity into page scripts or small reusable components
- examples: pricing toggle, some reveal logic, audience-page carousel logic

### 4. Reveal/animation patterns are inconsistent

There are multiple animation systems in use:

- `.fade-in-up` / `.fade-in`
- `.reveal` / `.revealed`
- page-local observers
- global observer in `public/main.js`

Problems:

- duplicated behavior
- inconsistent timing and naming
- harder to debug or disable

Better:

- define one reveal pattern for global use
- keep exceptions only where the interaction is truly custom

### 5. Legacy naming and mixed architecture

Examples:

- `public/style.css` still contains rules for both old `.navbar` and new `.site-nav`
- old and new design systems overlap
- pages mix Astro layout patterns with migrated static-site conventions

Problems:

- unclear which patterns are still active
- higher risk of regressions when touching shared CSS
- developers have to remember historical context to edit safely

Better:

- decide what is deprecated
- remove dead or legacy selectors once verified unused
- converge on one nav system and one set of layout utilities

Specific note:

- old `.navbar` styles in `public/style.css` now look like a strong candidate for deprecation once `trial.js` and `individual-signup.js` stop depending on them

### 6. Some duplicated page logic still exists

Files worth checking:

- `public/trial.js`
- `public/cud-application.js`
- `public/individual-signup.js`

Problems:

- repeated translation/init/form behavior
- repeated success/error handling patterns
- repeated navbar/scroll assumptions in older scripts

Better:

- extract shared form helpers if the behavior is truly common
- otherwise keep page logic isolated and minimal

Specific note:

- `public/trial.js` and `public/cud-application.js` each reimplement translation helpers instead of using a shared helper or relying on the improved `public/main.js`

### 7. `public/style.css` is carrying too much responsibility

This file currently acts as:

- design tokens
- reset
- utilities
- old nav styles
- new nav styles
- page sections
- forms
- blog
- animations
- responsive rules

Problems:

- large blast radius for small edits
- hard to know what is safe to remove
- difficult to split ownership

Better:

- split into logical files over time
- suggested split:
  - `base.css`
  - `tokens.css`
  - `layout.css`
  - `components.css`
  - `forms.css`
  - `blog.css`
  - `utilities.css`

### 8. Some pages still rely on legacy public JS rather than Astro components

Examples:

- carousel/demo behavior embedded in pages
- forms relying on separate public scripts

Problems:

- business logic is split across markup, CSS, and unrelated JS files
- reuse is difficult
- testing becomes harder

Better:

- turn repeated interactive blocks into Astro components
- colocate markup, styling, and behavior when the feature is specific

### 9. Layout behavior is still inconsistent across layouts

Files:

- `src/layouts/BaseLayout.astro`
- `src/layouts/MinimalLayout.astro`

Problems:

- layout defaults are not fully aligned
- one layout still uses the legacy document-hiding pattern
- global page behavior is split depending on which layout a page happens to use

Better:

- align layout behavior around Astro-friendly defaults
- reserve exceptional loading behavior for specific pages only if genuinely needed

### 10. The codebase still needs a “what is canonical” decision

There are several places where old and new approaches coexist:

- `.navbar` and `.site-nav`
- shared global JS and page-local JS
- global reveal classes and page-local reveal observers
- heavy inline styling and reusable classes

Problems:

- hard to know which pattern should be used for new work
- cleanup gets delayed because nothing is explicitly marked deprecated

Better:

- define a small canonical set of patterns:
  - `SiteNav` for navigation
  - `BaseLayout` for standard marketing pages
  - one reveal system
  - one preferred place for page-specific interaction
  - one preferred styling strategy for repeated sections

## High-value next steps

### Short-term

1. Audit `public/style.css` and identify dead selectors.
2. Standardize reveal animations into one system.
3. Replace the biggest clusters of inline styles in:
   - `src/pages/for-clinicians.astro`
   - `src/pages/features.astro`
   - `src/pages/pricing.astro`
4. Review `public/trial.js`, `public/cud-application.js`, and `public/individual-signup.js` for duplicated init logic.
5. Review `src/layouts/MinimalLayout.astro` and remove full-document hiding if visual testing confirms it is safe.
6. Verify whether any real page still depends on old `.navbar` rendering; if not, begin deprecating that path.

### Medium-term

1. Split `public/style.css` into smaller files.
2. Convert repeated marketing sections into reusable Astro components.
3. Reduce `includeMainJs={true}` usage to pages that actually need it.

### Longer-term

1. Decide whether the remaining legacy `.navbar` path should still exist.
2. Remove deprecated styles and scripts after verifying no page depends on them.
3. Consider a more explicit content/component structure for marketing pages so the site is easier to evolve.

## Suggested principle going forward

When touching a page:

1. avoid adding new inline styles if a class is enough
2. avoid adding new global JS if the behavior is page-specific
3. prefer explicit layout/theme props over “it works because of existing CSS”
4. remove legacy assumptions instead of layering new exceptions on top
