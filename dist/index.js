import { addHandler, handleMessage } from "libkmodule";
import { ResolverRegistry, } from "./resolverRegistry.js";
import { DNS_RECORD_TYPE } from "@lumeweb/libresolver";
import { dnsClient } from "./client.js";
let resolver;
export function setup(rm) {
    addHandler("resolve", handleResolve);
    addHandler("register", handleRegister);
    addHandler("getSupportedTlds", handleGetSupportedTlds);
    onmessage = handleMessage;
    resolver = new rm(new ResolverRegistry());
}
async function handleRegister(aq) {
    await dnsClient.register();
    aq.respond();
}
async function handleResolve(aq) {
    if (!("domain" in aq.callerInput)) {
        aq.reject("domain required");
        return;
    }
    let ret;
    try {
        ret = await resolver.resolve(aq.callerInput.domain, aq.callerInput?.options ?? { type: DNS_RECORD_TYPE.CONTENT }, aq.callerInput?.bypassCache || false);
    }
    catch (e) {
        aq.reject(e);
        return;
    }
    if (ret.error) {
        aq.reject(ret.error);
        return;
    }
    aq.respond(ret);
}
function handleGetSupportedTlds(aq) {
    aq.respond(resolver.getSupportedTlds());
}
export * from "./resolverRegistry.js";
export * from "@lumeweb/libresolver/dist/util.js";
export * from "@lumeweb/libresolver/dist/types.js";
