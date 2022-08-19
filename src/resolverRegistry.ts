import {
  DNSResult,
  ResolverOptions,
  DNS_RECORD_TYPE,
  resolverError,
} from "@lumeweb/resolver-common";
import { getResolvers, resolve } from "@lumeweb/kernel-dns-client";
import { RpcNetwork } from "@lumeweb/kernel-rpc-client";
import { callModule } from "libkmodule";

export class ResolverRegistry {
  private _rpcNetwork: RpcNetwork;

  constructor(network: RpcNetwork) {
    this._rpcNetwork = network;
  }

  get rpcNetwork(): RpcNetwork {
    return this._rpcNetwork;
  }

  get resolvers(): Promise<Set<ResolverModule>> {
    return getResolvers()
      .catch(() => {
        return new Set();
      })
      .then((resolvers: string[]) => {
        return new Set(
          resolvers.map((resolver) => new ResolverModule(this, resolver))
        );
      });
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

export class ResolverModule {
  private resolver: ResolverRegistry;
  private domain: string;

  constructor(resolver: ResolverRegistry, domain: string) {
    this.resolver = resolver;
    this.domain = domain;
  }

  async resolve(
    domain: string,
    options: ResolverOptions,
    bypassCache: boolean
  ): Promise<DNSResult> {
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
