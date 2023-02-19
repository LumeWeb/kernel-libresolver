import { DNS_RECORD_TYPE, resolverError, } from "@lumeweb/libresolver";
import { Client, factory } from "@lumeweb/libkernel-universal";
import { dnsClient } from "./client.js";
export class ResolverRegistry {
    get resolvers() {
        return dnsClient
            .getResolvers()
            .then((resolvers) => {
            return new Set(resolvers.map((resolver) => factory(ResolverModule, resolver)(this, resolver)));
        })
            .catch(() => {
            return new Set();
        });
    }
    async resolve(domain, options = { type: DNS_RECORD_TYPE.CONTENT }, bypassCache = false) {
        try {
            return dnsClient.resolve(domain, options, bypassCache);
        }
        catch (e) {
            return resolverError(e);
        }
    }
    register(resolver) { }
    clear() { }
}
export class ResolverModule extends Client {
    resolver;
    domain;
    constructor(resolver, domain) {
        super();
        this.resolver = resolver;
        this.domain = domain;
    }
    async resolve(domain, options, bypassCache) {
        try {
            return this.callModuleReturn("resolve", {
                domain,
                options,
                bypassCache,
            });
        }
        catch (e) {
            return resolverError(e);
        }
    }
    async getSupportedTlds() {
        return this.callModuleReturn("getSupportedTlds");
    }
}
