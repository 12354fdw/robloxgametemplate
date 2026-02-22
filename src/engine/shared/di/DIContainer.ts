import { getDIClassSymbol } from "./DISymbol";

export type Constructor<T> = new (...args: never[]) => T;
type Lifetime = "singleton" | "transient";

interface Registration<T> {
    factory: (di: DIContainer) => T;
    lifetime: Lifetime;
    instance?: T;
}
export class DIContainer {
    private readonly registrations = new Map<string, Registration<unknown>>();

    /** register an object to a container */
    public register<T>(clazz: Constructor<T>, lifetime: Lifetime = "singleton") {
        const key = getDIClassSymbol(clazz);
        this.registrations.set(key, { lifetime, factory: () => new clazz()})
    }

    /** resolve a class from the container */
    public get<T>(clazz: Constructor<T>): T {
        const key = getDIClassSymbol(clazz);
        const registration = this.registrations.get(key);
        
        if (!registration) {
            error("ohno")
        }

        if (registration.lifetime === "singleton") {
            if (!registration.instance) {
                registration.instance =  registration.factory(this);
            }
            return registration.instance as T;
        }

        return registration.factory(this) as T;
    }
}