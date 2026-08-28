# Crypsis — Product Design Direction

## Three Visual Approaches

### 1. Ember Sentinel

**Very Brief Intro:** A protective, warm command center made from near-black graphite, ember red, and a trace of orange. It makes privacy controls feel calm, precise, and visibly active.

**Probability:** 0.07

### 2. Paper Signal

**Very Brief Intro:** A bright editorial interface with vermilion rules, tactile paper texture, and strict asymmetric composition. It treats blocking as a clear, legible utility rather than a security dashboard.

**Probability:** 0.03

### 3. Soft Circuit

**Very Brief Intro:** A light claymorphic workspace punctuated by small glass panes and burnished hardware colors. The interface feels friendly and accessible while retaining a technical edge.

**Probability:** 0.09

## Chosen Direction — Ember Sentinel

### Design Movement

**Ember Sentinel** draws on contemporary industrial interface design and refined skeuomateriality. It combines the disciplined hierarchy of a monitoring console with limited claymorphic physicality and background glass layers, avoiding visual clutter or generic cyberpunk styling.

### Core Principles

1. **Protection should be legible.** The blocking state, current site, and primary control are always readable at a glance.
2. **Warmth offsets technicality.** Ember red establishes confidence while a controlled orange edge signals active traffic handling.
3. **Depth serves hierarchy.** Soft raised surfaces identify touchable controls, while glass panels only separate information planes.
4. **Quiet precision wins.** The product uses generous breathing room, carefully weighted type, and a small number of purposeful visual effects.

### Color Philosophy

The base is deep graphite rather than pure black, which provides a calm canvas and preserves text contrast. **Crypsis Signal Red (#E53B2C)** is the ownable control color: it communicates decisive protection without becoming alarmist. Amber-orange (#F58A2A) appears sparingly in active states, counts, and live-traffic indicators, giving the product a feeling of motion and vigilance. Warm bone (#FFF7EE) softens reading surfaces and balances the red-heavy palette.

### Layout Paradigm

The dashboard follows an **asymmetric sentinel rail**. A fixed left rail holds the product identity, global protection switch, and navigation. The main stage uses a large live-protection panel offset against smaller operational cards, creating a reading path from protection state to current-site controls to rules and activity. Narrow screens collapse the rail into a compact top control strip, retaining immediate access to the primary switch.

### Signature Elements

1. **The Sentinel Halo:** a segmented, orange-red ring around the protection state that doubles as a live blocking meter.
2. **Frosted Ember Sheets:** translucent background panels with a fine red edge and diffuse clay-like shadow.
3. **Signal Notches:** short rounded marks that visualize blocked requests without relying on artificial charts or noisy decorative graphics.

### Interaction Philosophy

Interactions should confirm control without drama. The protection switch, per-site override, and rule toggles respond immediately with concise language, color shifts, and a tactile pressed state. Destructive or risk-affecting actions require clear, specific confirmation. Keyboard navigation and visible focus states are first-class.

### Animation

Motion is brief and functional. Protection state changes animate the Sentinel Halo with a 220ms stroke/opacity transition; new activity rows enter with a 30ms stagger and a 4px upward transform; cards use subtle hover elevation and 140ms press compression. Glass gradients drift only at an imperceptibly slow rate and are disabled for reduced-motion preferences. No looping decorative motion competes with control content.

### Typography System

**Space Grotesk** provides structured display headings and live counters, including semibold navigation and button labels. **DM Sans** handles body copy, labels, inputs, and helper text for compact readability. Display text is tight and assertive; operational labels are letter-spaced and uppercase only where it aids scanning. The system explicitly avoids generic default typefaces.

### Brand Essence

**Crypsis is an ad-blocking control center for people who want the web and their browser to stay quiet, private, and under their command.**

Personality: **protective, exacting, composed**.

### Brand Voice

Crypsis speaks plainly, with useful specificity and no fear tactics. Headlines are short, physical, and decisive; calls to action explain the result of the action; microcopy reports what happened without exaggeration.

Example headline: **Keep the page. Lose the noise.**

Example control label: **Pause filtering on this site**

### Wordmark & Logo

The mark is a compact **split shield**: two offset, rounded slabs form an abstract C-shaped negative space while a small central notch implies a filtered signal. It is used independently at large sizes, paired with a custom-spaced Crypsis wordmark in Space Grotesk for product headers. There is no AI, platform, or third-party brand association.

### Signature Brand Color

**Crypsis Signal Red — #E53B2C**

## Style Decisions

- The Sentinel Halo and Signal Notches recur across navigation, metrics, section breaks, and live-status surfaces; they are Crypsis’s visual grammar, not a one-off hero ornament.
- Crypsis Signal Red is reserved for decisive protection actions and critical controls. Amber-orange signals active telemetry, counts, and live filtering states.
- The Crypsis wordmark uses custom negative spacing, contrasting weights, and an amber signal underline alongside the split-shield mark; it is never presented as plain default text.
