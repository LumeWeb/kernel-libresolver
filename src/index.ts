import { addHandler, ActiveQuery, handleMessage } from "libkmodule";

import type {
  DNSResult,
  ResolverModule as ResolverModuleBase,
} from "@lumeweb/libresolver";
import { DNS_RECORD_TYPE } from "@lumeweb/libresolver";
import { dnsClient } from "./client.js";
import { DnsClient } from "@lumeweb/kernel-dns-client";
import { ResolverOptions } from "@lumeweb/libresolver/src/types.js";

let resolver: ResolverModule | ResolverModuleBase;

export interface ResolverModule {
  get resolver(): DnsClient;
  set resolver(value: DnsClient);
  resolve(
    domain: string,
    options: ResolverOptions,
    bypassCache: boolean
  ): Promise<DNSResult>;

  getSupportedTlds(): string[];
  getSupportedTlds(): Promise<string[]>;
  getSupportedTlds(): any;
}

export function setup(rm: ResolverModule | ResolverModuleBase) {
  addHandler("resolve", handleResolve);
  addHandler("register", handleRegister);
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

export * from "@lumeweb/libresolver/dist/util.js";
export * from "@lumeweb/libresolver/dist/types.js";
export { AbstractResolverModule } from "@lumeweb/libresolver/dist/resolverModule.js";
