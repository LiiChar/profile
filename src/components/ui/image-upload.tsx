'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
	defaultImage?: string;
	onSelect: (base64: string | null) => void;
	className?: string;
	inlinePreview?: boolean; // превью в кнопке
}

export function ImageUpload({
	onSelect,
	defaultImage,
	className = '',
	inlinePreview = false,
}: ImageUploadProps) {
	const [preview, setPreview] = useState<string | null>(defaultImage ?? null);
	const [loading, setLoading] = useState(false);
	const [dragActive, setDragActive] = useState(false);
	const [ratioClass, setRatioClass] = useState('h-48'); // авто-высота контейнера
	const inputRef = useRef<HTMLInputElement>(null);

	const toBase64 = (file: File): Promise<string> =>
		new Promise((res, rej) => {
			const reader = new FileReader();
			reader.onload = () => res(reader.result as string);
			reader.onerror = rej;
			reader.readAsDataURL(file);
		});

	const handleImageMeta = async (base64: string) => {
		return new Promise<void>(resolve => {
			const img = new window.Image();
			img.src = base64;
			img.onload = () => {
				// Автоматический подбор высоты блока
				if (img.width > img.height) {
					setRatioClass('h-40'); // лендскейп
				} else {
					setRatioClass('h-60'); // портрет
				}
				resolve();
			};
		});
	};

	const processFile = async (file: File) => {
		if (!file.type.startsWith('image/')) {
			alert('Пожалуйста, выбери изображение');
			return;
		}

		setLoading(true);

		try {
			const base64 = await toBase64(file);
			await handleImageMeta(base64);

			setTimeout(() => {
				setPreview(base64);
				onSelect(base64);
				setLoading(false);
			}, 1000);
		} catch {
			setLoading(false);
		}
	};

	const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) processFile(file);
	};

	// DRAG & DROP HANDLERS
	const onDragEnter = () => setDragActive(true);
	const onDragLeave = () => setDragActive(false);
	const onDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
	};
	const onDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setDragActive(false);

		const file = e.dataTransfer.files?.[0];
		if (file) processFile(file);
	};

	return (
		<div
			className={cn(
				'relative flex flex-col gap-3  transition-all duration-300',
				dragActive ? 'border-blue-500 bg-blue-50' : 'border-border',
				className
			)}
			onDragEnter={onDragEnter}
			onDragLeave={onDragLeave}
			onDragOver={onDragOver}
			onDrop={onDrop}
		>
			<input
				ref={inputRef}
				type='file'
				accept='image/*'
				className='hidden'
				onChange={handleChange}
			/>

			{/* Превью в кнопке */}
			<Button
				type='button'
				onClick={() => inputRef.current?.click()}
				loading={loading}
				className={cn(
					'w-full relative overflow-hidden flex items-center justify-center gap-2',
					inlinePreview ? 'h-14' : ''
				)}
			>
				{inlinePreview && preview && (
					<div className='absolute w-14 h-14 left-0'>
						<Image
							src={preview}
							alt='preview small'
							fill
							className='object-cover  rounded-md animate-fadeIn'
						/>
					</div>
				)}
				{inlinePreview ? 'Заменить изображение' : 'Загрузить'}
			</Button>

			{/* Большое предпросмотрное изображение */}
			{preview && !inlinePreview && (
				<div
					className={cn(
						'relative rounded-xl overflow-hidden border shadow transition-opacity duration-500 opacity-0 animate-fadeIn',
						ratioClass
					)}
				>
					<Image src={preview} alt='Preview' fill className='object-contain' />
				</div>
			)}
		</div>
	);
}
