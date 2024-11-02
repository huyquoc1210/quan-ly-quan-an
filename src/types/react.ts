"use client";

import type {
  Dispatch,
  FunctionComponent,
  PropsWithChildren,
  SetStateAction,
} from "react";
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type FCC<T = {}> = FunctionComponent<PropsWithChildren<T>>;

//  {
//     (props: PropsWithChildren<P = unknown>, context?: any): ReactNode;
//     propTypes?: WeakValidationMap<P> | undefined;
//     contextTypes?: ValidationMap<any> | undefined;
//     defaultProps?: Partial<P> | undefined;
//     displayName?: string | undefined;
// }
// type PropsWithChildren<P = unknown> = P & { children?: ReactNode | undefined };

export type DispatchAction<T> = Dispatch<SetStateAction<T>>;
//   type SetStateAction<S> = S | ((prevState: S) => S);
//type Dispatch<A> = (value: A) => void;
