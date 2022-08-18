import { addHandler, ActiveQuery, handleMessage } from "libkmodule";
import { register } from "@lumeweb/kernel-dns-client";
import type { DNSResult, ResolverModule } from "@lumeweb/resolver-common";

let resolver: ResolverModule;

export function setup(rm: ResolverModule) {
  addHandler("resolve", handleResolve);
  addHandler("register", handleRegister);
  onmessage = handleMessage;
  resolver = rm;
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
      aq.callerInput?.options ?? {},
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
