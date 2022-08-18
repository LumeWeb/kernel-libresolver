import {
  DNSResult,
  ResolverOptions,
  DNS_RECORD_TYPE,
  resolverError,
} from "@lumeweb/resolver-common";
import { resolve } from "@lumeweb/kernel-dns-client";
import { RpcNetwork } from "@lumeweb/kernel-rpc-client";

export class ResolverRegistry {
  private _rpcNetwork: RpcNetwork;

  constructor(network: RpcNetwork) {
    this._rpcNetwork = network;
  }

  get rpcNetwork(): RpcNetwork {
    return this._rpcNetwork;
  }

  public async resolve(
    domain: string,
    options: ResolverOptions = { type: DNS_RECORD_TYPE.DEFAULT },
    bypassCache: boolean = false
  ): Promise<DNSResult> {
    let result: DNSResult;

    try {
      result = await resolve(domain, options, bypassCache);
    } catch (e: any) {
      return resolverError(e);
    }

    return result;
  }
}

export { RpcNetwork };
