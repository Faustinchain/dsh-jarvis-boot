/**
 * dsh-jarvis-boot — Node half.
 *
 * The whole feature is client-side (lib/client.js renders the boot overlay in
 * the web GUI). This half exists because the Loader mounts a package, not a
 * browser bundle: it keeps the entry alive with zero server-side behaviour.
 */

export const name = "dsh-jarvis-boot";

/** Nothing to configure or serve; the client bundle does the work. */
export function apply() {}
