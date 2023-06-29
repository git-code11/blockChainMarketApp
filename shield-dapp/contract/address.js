import _prod_address from "./_prod_address.json";
import _test_address from "./_test_address.json";

const IS_PRODUCTION = process.env.NEXT_PUBLIC_ENV === "production";
const ACTIVE_ADDR = IS_PRODUCTION?_prod_address:_test_address;

export default ACTIVE_ADDR;