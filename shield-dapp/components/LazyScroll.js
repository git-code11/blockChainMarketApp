import {useState, useCallback} from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";

export default ({loading, start, end, step, children:ItemCreator, Parent:_parent, keyCreator})=>{
    const _start = start || 0;
    const _end = end - 1;
    const _step = step || 4;

    const [pos, setPos] = useState(_start);

    const loadMore = useCallback(()=>{
        setPos(d=>Math.min(_end, d + _step));
    },[_step, _end]);

    const Parent = _parent || (d=>d);
    return (
    <InfiniteScroll
        loadMore={loading || loadMore}
        hasMore={pos<_end}
        loader={
            <Stack key={0} py={3} alignItems="center">
                <CircularProgress/>
            </Stack>
        }>
        <Parent>
            {Array(pos).fill(0).map((_,i)=><ItemCreator key={keyCreator?keyCreator(i):i} index={i}/>)}
        </Parent>
    </InfiniteScroll>
    )
}