import { DNS_RECORD_TYPE, resolverError, } from "@lumeweb/resolver-common";
import { getResolvers, resolve } from "@lumeweb/kernel-dns-client";
import { RpcNetwork } from "@lumeweb/kernel-rpc-client";
import { callModule } from "libkmodule";
export class ResolverRegistry {
    _rpcNetwork;
    constructor(network) {
        this._rpcNetwork = network;
    }
    get rpcNetwork() {
        return this._rpcNetwork;
    }
    get resolvers() {
        return getResolvers()
            .catch(() => {
            return new Set();
        })
            .then((resolvers) => {
            return new Set(resolvers.map((resolver) => new ResolverModule(this, resolver)));
        });
    }
    async resolve(domain, options = { type: DNS_RECORD_TYPE.DEFAULT }, bypassCache = false) {
        let result;
        try {
            result = await resolve(domain, options, bypassCache);
        }
        catch (e) {
            return resolverError(e);
        }
        return result;
    }
}
export class ResolverModule {
    resolver;
    domain;
    constructor(resolver, domain) {
        this.resolver = resolver;
        this.domain = domain;
    }
    async resolve(domain, options, bypassCache) {
        const [ret, err] = await callModule(this.domain, "resolve", {
            domain,
            options,
            bypassCache,
        });
        if (err) {
            return resolverError(err);
        }
        return ret;
    }
}
export { RpcNetwork };
