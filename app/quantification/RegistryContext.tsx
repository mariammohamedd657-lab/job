"use client";
import {createContext,useContext,type ReactNode} from "react";
import {registryFor} from "./quantity-registry";
import type {Figures,Result} from "./solver";
const Context=createContext<{problemId:string;raw:Figures;result:Result}|null>(null);
export function QuantityRegistryProvider({problemId,raw,result,children}:{problemId:string;raw:Figures;result:Result;children:ReactNode}){
 return <Context.Provider value={{problemId,raw,result}}>{children}</Context.Provider>;
}
export function useQuantityRegistry(){const c=useContext(Context);if(!c)throw Error("Numerical input outside scoped registry");return {...c,registry:registryFor(c.problemId)};}
