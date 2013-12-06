﻿[<AutoOpen>]
/// Contains a task which can be used to run regasm .NET assembly
module Fake.RegAsmHelper

open System

/// RegAsm parameter type
type RegAsmParams = { 
    ToolPath: string
    WorkingDir:string
    TimeOut: TimeSpan}

/// RegAsm default params
let RegAsmDefaults = { 
    ToolPath = @"C:\Windows\Microsoft.NET\Framework\v2.0.50727\regasm.exe"
    WorkingDir = "."
    TimeOut = TimeSpan.FromMinutes 5. }

/// Runs regasm on the given lib
/// ## Parameters
/// 
///  - `setParams` - Function used to manipulate the default RegAsm parameters.
///  - `lib` - The assembly file name.
let RegAsm setParams lib = 
    traceStartTask "RegAsm" lib
    let parameters = setParams RegAsmDefaults
    let args = sprintf "%s /tlb:%s" lib (replace ".dll" ".tlb" lib)
    
    if 0 <> ExecProcess (fun info ->
        info.FileName <- parameters.ToolPath
        info.WorkingDirectory <- parameters.WorkingDir
        info.Arguments <- args) parameters.TimeOut
    then
        failwithf "RegAsm %s failed." args
                  
    traceEndTask "RegAsm" lib