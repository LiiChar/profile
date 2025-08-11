import Threads from '@/components/animation/Threads';

export default function Loading() {
	return (
		<div className='w-screen h-screen fixed bg-background z-50 top-0 left-0'>
			<Threads
				className='z-10 w-screen h-screen fixed  top-0 left-0'
				amplitude={1}
				distance={0}
				enableMouseInteraction={true}
			/>
		</div>
	);
}
