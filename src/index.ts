import {
  addHandler,
  ActiveQuery,
  handleMessage,
} from "@lumeweb/libkernel/module";

import type { DNSResult } from "@lumeweb/libresolver";
import { DNS_RECORD_TYPE } from "@lumeweb/libresolver";
import { dnsClient } from "./client.js";
import { ResolverModule } from "@lumeweb/kernel-dns-client";

let resolver: ResolverModule;

export function setup(rm: ResolverModule) {
  addHandler("resolve", handleResolve);
  addHandler("register", handleRegister);
  addHandler("ready", handleReady);
  addHandler("getSupportedTlds", handleGetSupportedTlds);
  onmessage = handleMessage;
  resolver = rm;
  // @ts-ignore
  resolver.resolver = dnsClient;
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
      aq.callerInput?.bypassCache || false,
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

async function handleReady(aq: ActiveQuery) {
  aq.respond(await resolver.ready());
}

export * from "@lumeweb/libresolver/lib/util.js";
export * from "@lumeweb/libresolver/lib/types.js";
export { AbstractResolverModule } from "@lumeweb/libresolver/lib/resolverModule.js";
