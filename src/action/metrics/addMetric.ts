'use server';

import { db } from '@/db/db';
import { metrics } from '@/db/tables/metrics';
import { getCurrentUser } from '../auth/login';

export interface MetricData {
	action: 'view' | 'like' | 'comment' | 'share';
	targetType: 'blog' | 'project';
	targetId: number;
}

export const addMetric = async (data: MetricData) => {
	try {
		const user = await getCurrentUser();
		if (!user) {
			// Allow anonymous metrics
			await db.insert(metrics).values({
				action: data.action,
				targetType: data.targetType,
				targetId: data.targetId,
			});
		} else {
			await db.insert(metrics).values({
				userId: user.id,
				action: data.action,
				targetType: data.targetType,
				targetId: data.targetId,
			});
		}
		return { success: true };
	} catch (error) {
		console.error('[ADD METRIC ERROR]', error);
		return { success: false };
	}
};
