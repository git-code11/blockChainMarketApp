import {useMemo} from 'react';
import allTokenLogo from './all_token_logo.json'
import moreTokenLogo from './more_token_logo'
import { getLogoURI } from './token_list';

const TEMP_LOGO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAA5dJREFUeF7tnbFtG0EUBfcKcCOqQpldAKtgolyBDasIVUHAsTMpsTOHBliHC6BTxTcHDD44yv/u6v3h7B7vSG6/n6+3Bf5up1dQvdZ2OaP675//onpa/O3nAxrCzm8LANS/FQAZABGUAdoCEEB0C20LQPGvtgBbYR0C2SE6A2SALgMJA10FdBVA+Fn2FtoWgNrXIVAnuENgh0D4GmblnQE6AyCCOgP0TiACqHcCuxvIAOpuIMpv/lvBv/48oecBqILoHsja51fb+W0B4EIQAPAqwm0fnz0AAgBRRLfQtgAUPy/OABkAUZQBUHx+cQbIAIjCDIDi84szQAZAFGYAFJ9fnAEyAKIwA6D4/OIMkAEQhRkAxecXZ4AMgCjEBrAfCEH/fcX4+xX0zwXUQ5YA3UICgOWvVweA3gJ3AQHg5q/PHgB6C9wFBICbvz57AOgtcBcQAG7++uwBoLfAXUAAuPnrsweA3gJ3AQHg5q/PHgB6C9wFBICbvz57AOgtcBeAAbA/Hu7GN392/EBIAMyGIABm9w+vPgBwhLMHCIDZ/cOrDwAc4ewBAmB2//DqAwBHOHuAAJjdP7z6AMARzh4gAGb3D68+AHCEswcIgNn9w6sPABzh7AECYHb/8OoDAEc4ewAMwJf3H+j3Ar5+ekMJvvx7RPXTi+38tgBwEQqADIAIpAbNACh+XpwBMgCiKAOg+PziDJABEIUZAMXnF2eADIAozAAoPr84A2QARGEGQPH5xRkgAyAKMwCKzy/OABkAUZgBUHx+sW4A+vFwGiH9ggM6v11PH+ig68c/Ho0XcDnTIUbXB0AAqABnADX+tTJABlARzABq/BkA/+qV3D88fVtAWwCGiAzQFkDSO6A2A2SAAzDaP0QG2J/dIZUZIAMcAtLeQTLA3uQOqssAGeAglPYNkwH25XZYVQbIAIfBtGcg/Ovheyb9WENfAfbzBNPXHwCQ4AC48wADIABQAvYW1haA2sdv5wbA6RW1wA6wLQC1b/4rKAACACVgG6wzAGrffIMFQABc0TeFwvzwY9G2QjsDQAKmBzh9/W0Bdw5wAARAZwDCQFsASW/Nv4waDwD9fgB6CqcBQv70cjs//EiY/Q/oHYQLsPMLANhAWh4A8G4gbYBdHwABgBikZ6i2ABQ/L84AGQBRlAFQfH5xBsgAiMIMgOLzizNABkAUZgAUn1+cATIAojADoPj84gyQARCFGQDF5xfbBvgPlP0hXcgXOXEAAAAASUVORK5CYII="

export default (token)=>{
   
    return useMemo(()=>{
        let {address, symbol, isNative} = token || {}
    
        if(isNative){
            address = token.wrapped.address;
            symbol = token.wrapped.symbol;
        }

        let logoUrl = getLogoURI({address, symbol});

        return (
            logoUrl||
            allTokenLogo[address] ||
            allTokenLogo[symbol] || 
            moreTokenLogo[address] ||
            moreTokenLogo[symbol] ||
            TEMP_LOGO
        );
        
    },[token]);
}