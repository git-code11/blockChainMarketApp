import { Typography, Stack} from "@mui/material"
import { StyledLinearProgress } from "."


export default ({
    data,
    investedAmount,
    remainAmount,
    loading
})=>{

    const {
    saleRate,
    dexRate,
    buySym,
    launchSym,
    tokenSold,
    tokenTotal,
    percent,
    totalParticipant
    } = data??{};

    const percentStr = percent.toFixed(2);
    const investedAmountStr = investedAmount?.toString();
    const remainAmountStr = remainAmount?.toString();

    return (
        <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between">
                <Stack>
                    <Typography varaint="body2">Sale Rate</Typography>
                    <Typography varaint="body2" fontFamily="consolas">{`${saleRate} ${launchSym}/${buySym}`}</Typography>
                </Stack>
                <Stack>
                    <Typography varaint="body2">Dex Rate</Typography>
                    <Typography varaint="body2" fontFamily="consolas">{`${dexRate} ${launchSym}/${buySym}`}</Typography>
                </Stack>
            </Stack>

            <Stack spacing={0.25}>
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="subtitle2">{`Progress(${percentStr}%)`}</Typography>
                    <Typography variant="subtitle2">{`Participants ${totalParticipant}`}</Typography>
                </Stack>

                <StyledLinearProgress value={percent} variant="determinate"/>

                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="subtitle2" fontFamily="consolas">{`${tokenSold} ${launchSym}`}</Typography>
                    <Typography variant="subtitle2" fontFamily="consolas">{`${tokenTotal} ${launchSym}`}</Typography>
                </Stack>
            </Stack>

        { investedAmountStr &&
    <Typography variant="consolas" 
                varaint="h6"
                textAlign="center" fontWeight="bold">Invested ➜ {investedAmountStr}{buySym}</Typography>
    }
           
{remainAmountStr &&
<Typography variant="consolas" 
                varaint="h6"
                textAlign="center" fontWeight="bold">Remains ➜ {remainAmountStr}{buySym}</Typography>
    }
        </Stack>
    )
}
