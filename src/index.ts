import { addHandler, ActiveQuery, handleMessage } from "libkmodule";

import type { DNSResult } from "@lumeweb/libresolver";
import {
  ResolverModule,
  ResolverModuleConstructor,
  ResolverRegistry,
} from "./resolverRegistry.js";
import { DNS_RECORD_TYPE } from "@lumeweb/libresolver";
import { dnsClient } from "./client.js";

let resolver: ResolverModule;

export function setup(rm: ResolverModuleConstructor) {
  addHandler("resolve", handleResolve);
  addHandler("register", handleRegister);
  addHandler("getSupportedTlds", handleGetSupportedTlds);
  onmessage = handleMessage;
  resolver = new rm(new ResolverRegistry());
}

async function handleRegister(aq: ActiveQuery) {
  await dnsClient.register();
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
      aq.callerInput?.options ?? { type: DNS_RECORD_TYPE.CONTENT },
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
export * from "@lumeweb/libresolver/dist/util.js";
export * from "@lumeweb/libresolver/dist/types.js";
export { AbstractResolverModule } from "@lumeweb/libresolver/dist/resolverModule.js";
