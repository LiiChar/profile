'use client';

import { useEffect, useRef } from 'react';
import { addMetric, MetricData } from '@/action/metrics/addMetric';

export const MetricTracker = ({ action, targetType, targetId }: MetricData) => {
	const hasTracked = useRef(false);

	useEffect(() => {
		if (hasTracked.current) return;
		hasTracked.current = true;
		addMetric({ action, targetType, targetId });
	}, [action, targetType, targetId]);

	return null;
};
