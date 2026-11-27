"use client";
import {createContext,useContext,type ReactNode} from "react";
import {registryFor} from "./quantity-registry";
import type {Figures,Result,EvidenceMap,MeasurementEvidence} from "./solver";
const Context=createContext<{problemId:string;raw:Figures;result:Result;show?:boolean;setEvidence?:(key:string,value:MeasurementEvidence)=>void}|null>(null);
export function QuantityRegistryProvider({problemId,raw,result,show,setEvidence,children}:{problemId:string;raw:Figures;result:Result;show?:boolean;setEvidence?:(key:string,value:MeasurementEvidence)=>void;children:ReactNode}){
 return <Context.Provider value={{problemId,raw,result,show,setEvidence}}>{children}</Context.Provider>;
}
export function useQuantityRegistry(){const c=useContext(Context);if(!c)throw Error("Numerical input outside scoped registry");return {...c,registry:registryFor(c.problemId)};}
