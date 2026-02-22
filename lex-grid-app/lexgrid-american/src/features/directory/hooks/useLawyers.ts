import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, setLawyers, setLawyersLoading, setLawyersError } from '../../../../store';
import { lawyerService } from '../services/lawyer.service';

export const useLawyers = () => {
    const dispatch = useDispatch();
    const { lawyers, loading, error, filters } = useSelector((state: RootState) => state.lawyers);

    useEffect(() => {
        const fetchLawyers = async () => {
            try {
                dispatch(setLawyersLoading(true));
                const data = await lawyerService.getLawyers(filters);
                dispatch(setLawyers(data));
            } catch (err: any) {
                dispatch(setLawyersError(err.message || 'Failed to fetch lawyers'));
            }
        };

        fetchLawyers();
    }, [filters, dispatch]);

    return { lawyers, loading, error };
};
