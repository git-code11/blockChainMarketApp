import Script from 'next/script'
import mainConfig from "../mainConfig"

/**
 * Google Analytics
 */
 
export default ()=>{
    const gtagID = mainConfig.gtagID;

    const onReady = ()=>{
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', `${gtagID}`);
    }

    return (
    <Script
        async 
        strategy='afterInteractive'
        src={`https://www.googletagmanager.com/gtag/js?id=${gtagID}`}
        onReady={onReady}
    />
    )
}