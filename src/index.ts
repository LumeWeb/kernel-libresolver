import { addHandler, ActiveQuery, handleMessage } from "libkmodule";
import { register } from "@lumeweb/kernel-dns-client";
import type {
  DNSResult,
  ResolverModuleConstructor,
  ResolverModule,
} from "@lumeweb/resolver-common";
import { RpcNetwork } from "@lumeweb/kernel-rpc-client";
import { ResolverRegistry } from "./resolverRegistry.js";

let resolver: ResolverModule;

export function setup(rm: ResolverModuleConstructor) {
  addHandler("resolve", handleResolve);
  addHandler("register", handleRegister);
  addHandler("getSupportedTlds", handleGetSupportedTlds);
  onmessage = handleMessage;
  resolver = new rm(new ResolverRegistry(new RpcNetwork()) as any);
}

async function handleRegister(aq: ActiveQuery) {
  await register();
  aq.respond();
}

async function handleResolve(aq: ActiveQuery) {
  if (!("domain" in aq.callerInput)) {
    aq.reject("domain required");
    return;
  }

  let ret: DNSResult;
  try {
    ret = await resolver.resolve(
      aq.callerInput.domain,
      aq.callerInput?.options,
      aq.callerInput?.bypassCache || false
    );
  } catch (e: any) {
    aq.reject(e);
    return;
  }

  if (ret.error) {
    aq.reject(ret.error as any);
    return;
  }

  aq.respond(ret);
}

function handleGetSupportedTlds(aq: ActiveQuery) {
  aq.respond(resolver.getSupportedTlds());
}

export * from "./resolverRegistry.js";
