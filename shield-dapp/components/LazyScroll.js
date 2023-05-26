import {useState, useCallback} from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";



export default ({loading, start, end, step, children:ItemCreator, Parent:_parent, keyCreator})=>{
    const _start = Number(start) || 0;
    const _end = Number(end);
    //const _length = end;
    console.log({_end})
    const _step = Number(step) || 4;

    const [pos, setPos] = useState(_start);

    const loadMore = useCallback(()=>{
        setPos(d=>Math.min(_end, d + _step));
    },[_step, _end]);

    const Parent = _parent || (d=>d);
    console.log({pos});
    return (
    Boolean(_end)?
    <InfiniteScroll
        loadMore={loading || _end <= 0  || loadMore}
        hasMore={pos<_end}
        loader={
            <Stack key={0} py={3} alignItems="center">
                <CircularProgress/>
            </Stack>
        }>
        <Parent>
            {Array(Number(pos)).fill(0).map((_,i)=><ItemCreator key={keyCreator?keyCreator(i):i} index={i}/>)}
        </Parent>
    </InfiniteScroll>:<div></div>
    )
}