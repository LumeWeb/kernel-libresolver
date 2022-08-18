import { DNS_RECORD_TYPE, resolverError, } from "@lumeweb/resolver-common";
import { resolve } from "@lumeweb/kernel-dns-client";
import { RpcNetwork } from "@lumeweb/kernel-rpc-client";
export class ResolverRegistry {
    _rpcNetwork;
    constructor(network) {
        this._rpcNetwork = network;
    }
    get rpcNetwork() {
        return this._rpcNetwork;
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
export { RpcNetwork };
