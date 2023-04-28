import {useRef, useMemo, useState} from 'react';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Slide from "@mui/material/Slide";

import CreatedTab from './tabs/Created';
import OwnedTab from './tabs/Owned';


export default ()=>{
    const containerRef = useRef(null);
    const [value, setValue] = useState(0);
    
    return (  
            <Box ref={containerRef}>
                <TabMenu {...{value, setValue}}/>
                <Slide direction="up" key={value} in={true} container={containerRef.current}>
                    <div key={value}>
                        <TabPanel value={value}/>
                    </div>
                </Slide>
            </Box>
    );
}

const TabMenu = ({value, setValue})=>{
   
    return (
        <Tabs sx={{position:"sticky", top:"58px", zIndex:1, backdropFilter:"blur(15px)", pb:1}} variant="scrollable" value={value} onChange={(e, v)=>setValue(v)}>
            <Tab selected label="Created"/>
            <Tab label="Owned"/>
            <Tab label="Offer"/>
            <Tab label="Auction"/>
            <Tab label="Transaction"/>
        </Tabs>
    )
}


const panelList = [CreatedTab, OwnedTab];

const TabPanel = ({value})=>{
    const panel = useMemo(()=>{
        const index = (value && value < panelList.length)?value:0;
        const Panel =  panelList[index];
        return <Panel/> 
    },[value]);

    return panel
}

