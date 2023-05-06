import { h, AnyComponent, VNode } from "preact";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
    interface ElementChildrenAttribute {
      children: object;
    }
    interface ElementAttributesProperty {
      props: object;
    }
    type Element = h.JSX.Element;
  }
}

export {
  Attributes,
  FunctionalComponent as SFC,
  AnyComponent as ComponentType,
  AnyComponent as JSXElementConstructor,
  Component as ComponentClass,
  ClassAttributes,
  PreactContext as Context,
  PreactProvider as Provider,
  VNode as ReactElement,
  VNode as ReactNode,
  createElement,
  Fragment,
  Ref,
  render,
  JSX,
  RenderableProps as ComponentPropsWithRef,
} from "preact";

declare module "preact/compat" {
  export type ReactNode = VNode;
  export type ComponentType<P> = AnyComponent<P>;
  export type ComponentPropsWithoutRef<P> = JSX.HTMLAttributes<P>;
}
