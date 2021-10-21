import React, { FunctionComponent, useEffect, useState } from 'react';
import classes from './Main.module.scss';
import Card from '../../../shared/components/card/Card';
import Label from '../../../shared/components/label/Label';
import Value from '../../../shared/components/value/Value';
import { useNavigation } from '../../../shared/hooks/navigation';
import { NavLink } from 'react-router-dom';
import { useSearch } from '../../../shared/hooks/search';
import { useFilterData } from '../../../shared/hooks/filter-data';
import Ellipsis from '../../../shared/components/ellipsis/Ellipsis';
import StatusCode from '../shared/StatusCode';
import { useTimeoutPolling } from '../../../shared/hooks/timeout-polling';
import NoResults from '../../../shared/components/no-results/NoResults';
import FullScreenLoading from '../../../shared/components/fullscreen-loading/FullScreenLoading';

const Main: FunctionComponent<any> = () => {
    const { searchTerm, setPlaceholder } = useSearch();
    const { showNavigationDrawer, showSubNavigation } = useNavigation();
    const { data, isFetching } = useTimeoutPolling('/api/transactions/polling');
    const [firstFetch, setFirstFetch] = useState(false);

    useEffect(() => {
        if (!isFetching && !firstFetch) {
            setFirstFetch(true);
        }
    }, [isFetching]);

    useEffect(() => {
        setPlaceholder('search for block numbers or tx hashes');
        showNavigationDrawer(false);
        showSubNavigation(true);
    }, []);

    const { filteredData } = useFilterData(data, searchTerm);

    return (
        <>
            {filteredData &&
                filteredData.map((item: any, i) => (
                    <Card key={i} className={classes.card}>
                        <div>
                            <Label>TRANSACTION ID</Label>
                            <Value>
                                <NavLink to={`/transactions/details/${item.id}`}>
                                    <Ellipsis className={classes.hash}>{item.id}</Ellipsis>
                                </NavLink>
                            </Value>
                        </div>
                        <div>
                            <Label>BLOCK ID</Label>
                            <Value>
                                <NavLink to={`/blocks/details/${item.referenceBlockId}`}>
                                    <Ellipsis className={classes.hash}>{item.referenceBlockId}</Ellipsis>
                                </NavLink>
                            </Value>
                        </div>
                        <div>
                            <StatusCode statusCode={item.status.statusCode} />
                        </div>
                        <div>
                            <Label>PAYER</Label>
                            <Value>{item.payer}</Value>
                        </div>
                        <div>
                            <Label>PROPOSER</Label>
                            <Value>{item.proposalKey.address}</Value>
                        </div>
                    </Card>
                ))}
            {!firstFetch && <FullScreenLoading />}
            {firstFetch && filteredData.length === 0 && <NoResults className={classes.noResults} />}
        </>
    );
};

export default Main;
