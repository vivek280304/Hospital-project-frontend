import { load } from "@cashfreepayments/cashfree-js";

let cashfreeInstance = null;

export const getCashfree = async () => {
    if (!cashfreeInstance) {
        cashfreeInstance = await load({
            mode: "sandbox"
        });
    }

    return cashfreeInstance;
};