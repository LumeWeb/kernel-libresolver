import {
  DNSResult,
  ResolverOptions,
  DNS_RECORD_TYPE,
  resolverError,
  ResolverModuleConstructor as ResolverModuleConstructorBase,
} from "@lumeweb/libresolver";
import { Client, factory } from "@lumeweb/libkernel-universal";
import { dnsClient } from "./client.js";

export interface ResolverModuleConstructor
  extends ResolverModuleConstructorBase {
  new (resolver: ResolverRegistry): ResolverModule;
}

export class ResolverRegistry {
  get resolvers(): Promise<Set<ResolverModule>> {
    return dnsClient
      .getResolvers()
      .then((resolvers: string[]) => {
        return new Set(
          resolvers.map((resolver) =>
            factory<ResolverModule>(ResolverModule, resolver)(this, resolver)
          )
        );
      })
      .catch(() => {
        return new Set();
      });
  }

  public async resolve(
    domain: string,
    options: ResolverOptions = { type: DNS_RECORD_TYPE.CONTENT },
    bypassCache: boolean = false
  ): Promise<DNSResult> {
    try {
      return dnsClient.resolve(domain, options, bypassCache);
    } catch (e: any) {
      return resolverError(e);
    }
  }
  public register(resolver: ResolverModule): void {}
  public clear(): void {}
}

export class ResolverModule extends Client {
  private resolver: ResolverRegistry;
  private domain: string;

  constructor(resolver: ResolverRegistry, domain: string) {
    super();
    this.resolver = resolver;
    this.domain = domain;
  }

  async resolve(
    domain: string,
    options: ResolverOptions,
    bypassCache: boolean
  ): Promise<DNSResult> {
    try {
      return this.callModuleReturn("resolve", {
        domain,
        options,
        bypassCache,
      });
    } catch (e) {
      return resolverError(e as Error);
    }
  }
  async getSupportedTlds(): Promise<string[]> {
    return this.callModuleReturn("getSupportedTlds");
  }
}
