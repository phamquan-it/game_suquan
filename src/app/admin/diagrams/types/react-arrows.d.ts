// admin/diagrams/types/react-arrows.d.ts
// Full ambient types for `react-arrows` (v1.2.0, via `arrows-svg`).
// react-arrows ships compiled JS with no bundled .d.ts, so we declare the
// module here. Values below mirror the runtime exports of react-arrows/dist/main.js.
declare module 'react-arrows' {
  import { ReactNode } from 'react';

  /** 8 compass anchors around an element rect. */
  export enum DIRECTION {
    TOP_LEFT = 'top-left',
    TOP = 'top',
    TOP_RIGHT = 'top-right',
    RIGHT = 'right',
    BOTTOM_LEFT = 'bottom-left',
    BOTTOM = 'bottom',
    BOTTOM_RIGHT = 'bottom-right',
    LEFT = 'left',
  }

  /**
   * Every exported HEAD key. The enum holds the canonical lowercase keys;
   * react-arrows' head factory also accepts their UPPERCASE aliases and plain
   * string keys, so head typing below stays loose (see `HeadConfig`).
   */
  export enum HEAD {
    diamond = 'diamond',
    dot = 'dot',
    image = 'image',
    none = 'none',
    inv = 'inv',
    normal = 'normal',
    thin = 'thin',
    vee = 'vee',
  }

  /** Underscored/bare HEAD name aliases accepted by the arrow head factory. */
  export type HeadType =
    | 'diamond' | 'DIAMOND'
    | 'dot' | 'DOT'
    | 'image' | 'IMAGE'
    | 'none' | 'NONE'
    | 'inv' | 'INV'
    | 'normal' | 'NORMAL'
    | 'thin' | 'THIN'
    | 'vee' | 'VEE';

  /** Low-level per-head config object returned by the head factory. */
  export type HeadNode = {
    node: ReactNode;
    width: number;
    height: number;
  };

  /** Any form react-arrows accepts for a head specifier. */
  export type HeadConfig =
    | HeadType
    | { size?: number } // sized shapes: diamond, dot, inv, normal, thin, vee…
    | { src: string; width: number; height: number } // image head
    | { func?: HeadSpecifier } // resolve to another head first
    | ((size?: { size?: number }) => HeadNode)
    | string;

  /** Recursively-resolvable head specifier (used by `func`). */
  export type HeadSpecifier = HeadType | HeadConfig;

  /**
   * Gets/caches the element used to locate an endpoint. When not wrapped in a
   * function, react-arrows reads the node at render time (so the element must
   * already exist); a function defers the lookup so the anchor may be measured
   * after each layout.
   */
  export type Anchor = HTMLElement | (() => HTMLElement | null);

  /** An anchored arrow end, independently draggable. */
  export interface ArrowEndpoint {
    /** Which edge of the node the arrow attaches to (defaults per side). */
    direction: DIRECTION;
    node: Anchor;
    /** Fraction of the node width/height to offset the attach point. e.g. [0.5, 0]. */
    translation?: [number, number];
  }

  /** Full resolved arrow shape as passed to `onChange` (an SVG widget snapshot). */
  export interface ArrowDescription {
    offset: { x: number; y: number };
    size: { width: number; height: number };
    points: string; // SVG <path d>
    head: HeadNode & { transform: string };
    getPointXY?: (distance?: number) => { x: number; y: number; degree: number; radius: number };
  }

  /** Props accepted by the default exported <Arrow> React component. */
  export interface ArrowProps {
    className?: string;
    from: ArrowEndpoint;
    to: ArrowEndpoint;
    /** Shape of the arrow head — a HEAD name, config object, or callback. */
    head?: HeadConfig;
    /** Called after the arrow geometry recomputes (elements moved/resized). */
    onChange?: (arrow: ArrowDescription) => void;
    children?: ReactNode;
  }

  const Arrow: React.FC<ArrowProps>;
  export default Arrow;
}
